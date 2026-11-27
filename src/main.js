import "./style.css";
import { auth } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
  <header class="topbar">
    <a class="brand" href="#"><span class="brand-mark">✦</span> Global<span>OTP</span></a>
    <div class="top-actions"><span class="secure"><i></i> Secure verification</span><a class="help-link" href="#how">How it works</a></div>
  </header>
  <main class="shell">
    <section class="intro">
      <div class="eyebrow"><span class="spark">✦</span> SIMPLE. FAST. SECURE.</div>
      <h1>Your account.<br><span>Verified.</span></h1>
      <p class="lead">A safer, simpler way to access your Global OTP account with your phone number.</p>
      <div class="trust-row"><span>✓ Private by design</span><span>✓ One-time codes</span></div>
      <div class="orb-card">
        <div class="orb orb-a"></div><div class="orb orb-b"></div>
        <div class="mini-lock">♙</div>
        <div class="orbit-caption"><b>YOUR SECURITY MATTERS</b><small>Phone verification helps protect your account.</small></div>
      </div>
    </section>
    <section class="auth-card">
      <div class="card-top"><div class="card-icon">✧</div><div><p class="overline">WELCOME</p><h2 id="panel-title">Sign in or create account</h2></div></div>
      <p class="sub" id="panel-sub">Enter your phone number to receive a verification code.</p>
      <div id="phone-step">
        <label for="phone">Phone number</label>
        <div class="phone-input"><span class="phone-prefix">＋</span><input id="phone" type="tel" autocomplete="tel" placeholder="2348012345678" /><span class="input-check">●</span></div>
        <small class="hint">Use international format with + and country code, e.g. +2348012345678 for Nigeria.</small>
        <div id="recaptcha-container"></div>
        <button class="primary" id="send-code">Send verification code <span>→</span></button>
        <p class="notice" id="message" role="status"></p>
        <p class="terms">By continuing, you agree to use this service only for accounts and phone numbers you are authorized to verify.</p>
      </div>
      <div id="code-step" hidden>
        <label for="code">6-digit verification code</label>
        <input class="code-input" id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" />
        <p class="hint">Enter the code sent to your phone. Never share it with anyone.</p>
        <button class="primary" id="verify-code">Verify and continue <span>→</span></button>
        <button class="text-button" id="resend-code" disabled>Resend code in <b id="countdown">30</b>s</button>
        <button class="text-button muted" id="change-number">Use a different number</button>
        <p class="notice" id="code-message" role="status"></p>
      </div>
      <div id="signed-in" hidden>
        <div class="success-mark">✓</div><h3>You're verified!</h3>
        <p class="sub">Your Global OTP account is signed in.</p>
        <div class="account-box"><small>Signed in phone number</small><b id="user-phone"></b></div>
        <button class="primary" id="sign-out">Sign out</button>
      </div>
      <div class="card-foot"><span class="shield">◇</span> Protected with Firebase Authentication</div>
    </section>
  </main>
  <section class="how" id="how"><div><span class="overline">HOW IT WORKS</span><h2>Three steps. One secure sign-in.</h2></div>
    <div class="steps"><article><b>01</b><h3>Enter your number</h3><p>Use a phone number you own or are authorized to use.</p></article><article><b>02</b><h3>Receive your code</h3><p>Firebase sends a one-time SMS verification code.</p></article><article><b>03</b><h3>Verify and access</h3><p>Enter the code to sign in securely to this website.</p></article></div>
  </section>
  <footer>© ${new Date().getFullYear()} Global OTP <span>Built for secure first-party verification.</span></footer>
`;

const $ = (id) => document.getElementById(id);
let confirmationResult = null;
let verifier = null;
let countdownTimer = null;

function setMessage(id, text, kind = "") {
  const el = $(id);
  el.textContent = text;
  el.className = `notice ${kind}`;
}
function setupRecaptcha() {
  if (verifier) return verifier;
  verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => {}
  });
  return verifier;
}
function startCountdown(seconds = 30) {
  clearInterval(countdownTimer);
  let remaining = seconds;
  $("countdown").textContent = remaining;
  $("resend-code").disabled = true;
  countdownTimer = setInterval(() => {
    remaining -= 1;
    $("countdown").textContent = remaining;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      $("resend-code").disabled = false;
      $("resend-code").textContent = "Resend verification code";
    }
  }, 1000);
}
async function sendCode() {
  const phone = $("phone").value.trim().replace(/[()\s-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    setMessage("message", "Enter a valid number in international format, starting with +. Example: +2348012345678", "error");
    return;
  }
  $("send-code").disabled = true;
  setMessage("message", "Preparing secure verification…");
  try {
    const appVerifier = setupRecaptcha();
    confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
    $("phone-step").hidden = true;
    $("code-step").hidden = false;
    $("panel-title").textContent = "Check your messages";
    $("panel-sub").textContent = `We sent a verification code to ${phone}.`;
    startCountdown();
  } catch (error) {
    console.error(error);
    const extra = error?.code === "auth/invalid-api-key" ? " Check the Firebase config in src/firebase.js." : "";
    setMessage("message", friendlyError(error) + extra, "error");
    if (verifier) { verifier.clear(); verifier = null; }
  } finally {
    $("send-code").disabled = false;
  }
}
function friendlyError(error) {
  const map = {
    "auth/invalid-phone-number": "That phone number is not valid. Check the country code and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait before trying again.",
    "auth/quota-exceeded": "The SMS quota for this Firebase project has been reached.",
    "auth/captcha-check-failed": "The security check failed. Refresh the page and try again.",
    "auth/operation-not-allowed": "Phone sign-in is not enabled in your Firebase project."
  };
  return map[error?.code] || "We couldn't send the code. Check your Firebase setup and try again.";
}
async function verifyCode() {
  const code = $("code").value.trim();
  if (!/^\d{6}$/.test(code)) {
    setMessage("code-message", "Enter the six-digit code.", "error");
    return;
  }
  $("verify-code").disabled = true;
  try {
    await confirmationResult.confirm(code);
    setMessage("code-message", "Verification successful.", "success");
  } catch (error) {
    console.error(error);
    setMessage("code-message", error?.code === "auth/invalid-verification-code" ? "That code is incorrect. Check the SMS and try again." : friendlyError(error), "error");
  } finally {
    $("verify-code").disabled = false;
  }
}
$("send-code").addEventListener("click", sendCode);
$("verify-code").addEventListener("click", verifyCode);
$("code").addEventListener("keydown", (e) => { if (e.key === "Enter") verifyCode(); });
$("resend-code").addEventListener("click", async () => {
  if (verifier) { verifier.clear(); verifier = null; }
  $("code-step").hidden = true;
  $("phone-step").hidden = false;
  $("panel-title").textContent = "Sign in or create account";
  $("panel-sub").textContent = "Request a new verification code.";
  await sendCode();
});
$("change-number").addEventListener("click", () => {
  clearInterval(countdownTimer);
  if (verifier) { verifier.clear(); verifier = null; }
  confirmationResult = null;
  $("code-step").hidden = true;
  $("phone-step").hidden = false;
  $("panel-title").textContent = "Sign in or create account";
  $("panel-sub").textContent = "Enter your phone number to receive a verification code.";
});
$("sign-out").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  const signedIn = Boolean(user);
  $("signed-in").hidden = !signedIn;
  $("phone-step").hidden = signedIn || Boolean(confirmationResult);
  $("code-step").hidden = signedIn || !confirmationResult;
  if (signedIn) {
    $("panel-title").textContent = "Account dashboard";
    $("panel-sub").textContent = "Your phone number has been verified.";
    $("user-phone").textContent = user.phoneNumber || "Verified account";
  }
});
