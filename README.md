# Global OTP

A colourful, responsive starter website for **first-party phone verification**. It uses Firebase Authentication to send and verify SMS codes for users of your own website.

## Important scope

This project does not generate or retrieve login codes for WhatsApp, Instagram, Facebook, TikTok, Telegram, Google, or other third-party accounts. Each platform controls its own verification process. Use this project only to verify accounts on your own service and phone numbers you are authorized to use.

## 1. Requirements

- Node.js 20 or newer
- A Google account for Firebase
- A phone number you control for testing

## 2. Configure Firebase

1. Open https://console.firebase.google.com/ and create a project.
2. Add a **Web App** to the project.
3. Copy the Firebase web configuration.
4. Open `src/firebase.js` and replace the placeholder values.
5. In Firebase Console, go to **Authentication → Sign-in method** and enable **Phone**.
6. In Authentication settings, add your website's hosting domain to **Authorized domains**.
7. Review Firebase's phone-authentication pricing, SMS region policy, quotas and abuse protections before launch.
8. For development, add test phone numbers and fixed test codes in Firebase Authentication's phone-number testing section. Never use real customer numbers as test fixtures.

Firebase uses reCAPTCHA as an anti-abuse check for web phone authentication. Do not remove it.

## 3. Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## 4. Build for production

```bash
npm run build
```

Vite creates the production site in `dist/`.

## 5. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository at https://vercel.com/
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.
7. Add the deployed domain to Firebase Authentication's authorized domains.

Netlify works too: build command `npm run build`, publish directory `dist`.

## Security and production notes

- Firebase Authentication handles the SMS verification flow; this starter does not store raw OTPs.
- Do not put service-account keys, private API secrets, or admin credentials in frontend code.
- Set appropriate Firebase SMS regions, quotas, billing alerts and abuse controls.
- Use Firebase Security Rules for any Firestore data you add. Never trust a client-side "admin" flag.
- A real admin dashboard requires server-side authorization, such as Firebase Admin SDK with custom claims, deployed in a trusted server environment.
- Add a privacy notice, terms, support contact and consent wording before accepting public users.
- Test resend limits, invalid codes, expired sessions, accessibility and mobile browsers before launch.
- Phone numbers can be recycled or unavailable; consider offering another secure sign-in method.

## Troubleshooting

- `auth/operation-not-allowed`: enable Phone sign-in in Firebase.
- `auth/unauthorized-domain`: add the current hostname to Firebase Authorized domains.
- `auth/invalid-api-key`: check `src/firebase.js`.
- SMS quota or region errors: check Firebase billing, usage quotas and allowed SMS regions.
