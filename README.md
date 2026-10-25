# Daily Avenue

Plain HTML/CSS/JS news site with an admin dashboard (`admin.html`). No build step. Posts, settings and admin sign-in are stored in Firebase, so everything you publish is visible to all visitors.

## 1. Connect Firebase (required, about 5 minutes)
1. Create a project at https://console.firebase.google.com and add a Web app. Copy its config object into `firebase-config.js` (replace `null`).
2. Authentication > Sign-in method: enable Email/Password. In the Users tab, add your admin email and password. Turn off new sign-ups in Authentication > Settings if the option is available.
3. Firestore Database: create it, then set these rules (use your admin email):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{d}/documents {
    match /{doc=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'you@example.com';
    }
  }
}
```

## 2. Deploy
- **Netlify:** drag this folder onto https://app.netlify.com/drop, or connect your GitHub repo (build command: none, publish directory: `.`).
- **GitHub Pages:** push the files to a repo, then Settings > Pages > deploy from the main branch (root).

## 3. Authorize your domain
Firebase console > Authentication > Settings > Authorized domains: add your Netlify or GitHub Pages domain.

## 4. Publish
Open `/admin.html`, sign in with your admin email, and use Write to publish. Use Settings for the site name, colors, categories, WhatsApp, social and ad links, About text and footer.
