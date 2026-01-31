---
description: How to push to GitHub and Deploy to Firebase
---

### 1. Push to GitHub
If you have already connected your project to GitHub, run these commands:

```powershell
git add .
git commit -m "feat: consolidate rank management and refactor landing page"
git push origin main
```

> [!NOTE]
> If you haven't connected to GitHub yet:
> 1. Create a repository on github.com
> 2. Run: `git remote add origin YOUR_URL`
> 3. Then run the commands above.

---

### 2. Deploy to Firebase
The project is configured to deploy to Firebase Hosting.

**Step 1: Login to Firebase (one-time)**
```powershell
npm run firebase:login
```

**Step 2: Build and Deploy**
Run this command to automatically build the project and upload it to Firebase:
```powershell
npm run deploy
```

> [!TIP]
> This command will:
> 1. Run `tsc` (TypeScript check)
> 2. Run `vite build` (Create production files in `dist/`)
> 3. Run `firebase deploy` (Upload everything to the cloud)
