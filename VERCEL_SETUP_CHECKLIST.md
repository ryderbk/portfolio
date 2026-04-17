# Quick Vercel Setup Checklist ✅

## 1️⃣ Environment Variables (CRITICAL!)

Visit: https://vercel.com/projects → your-project → Settings → Environment Variables

Add these variables exactly as shown:

```
✓ VITE_FIREBASE_API_KEY
  Value: AIzaSyB3c2kJ6v_Kn3VMV8MTQ5lVomnROtRYy0k
  Scopes: Production ✓ Preview ✓ Development ✓

✓ VITE_FIREBASE_AUTH_DOMAIN
  Value: portfoliobkss.firebaseapp.com
  Scopes: Production ✓ Preview ✓ Development ✓

✓ VITE_FIREBASE_PROJECT_ID
  Value: portfoliobkss
  Scopes: Production ✓ Preview ✓ Development ✓

✓ VITE_FIREBASE_STORAGE_BUCKET
  Value: portfoliobkss.firebasestorage.app
  Scopes: Production ✓ Preview ✓ Development ✓

✓ VITE_FIREBASE_MESSAGING_SENDER_ID
  Value: 578334313857
  Scopes: Production ✓ Preview ✓ Development ✓

✓ VITE_FIREBASE_APP_ID
  Value: 1:578334313857:web:5716d44e7bd606e3a9ac80
  Scopes: Production ✓ Preview ✓ Development ✓

✓ VITE_FIREBASE_MEASUREMENT_ID
  Value: G-YGBQW7ST7X
  Scopes: Production ✓ Preview ✓ Development ✓
```

## 2️⃣ Redeploy

Go to: **Deployments** → Click **...** on latest → **Redeploy**

OR commit & push to trigger auto-redeploy

## 3️⃣ Test in Browser

Open your deployed site and press **F12** (DevTools)

Look for these success messages in Console:
- ✅ "📱 App startup started"
- ✅ "✅ Root element found"
- ✅ "✅ Firebase App initialized successfully"
- ✅ "🚀 App rendering"

## 4️⃣ Test Routes

- [ ] https://yoursite.com/ → Shows home page
- [ ] https://yoursite.com/admin → Shows admin page
- [ ] https://yoursite.com/random → Shows 404 page

## 5️⃣ If Blank Screen Still Shows

Open DevTools → Console tab and check for:
- [ ] Red errors about Firebase
- [ ] "Cannot read property" errors
- [ ] "undefined" errors

Share those error messages for debugging

---

## What Was Fixed

✅ **vercel.json** - Added SPA routing (fixes 404 on routes)
✅ **Error boundary** - Shows errors instead of blank screen
✅ **Firebase init** - Better error handling & logging
✅ **Build test** - No compilation errors
✅ **Console logs** - Easy debugging

---

## Most Common Issues

| Issue | Fix |
|-------|-----|
| Still blank? | Env vars not in Vercel - check Step 1 |
| 404 on /admin? | Redeploy after adding env vars |
| Firebase errors? | Make sure all 7 env vars added to Vercel |
| Shows error? | This is GOOD - means error boundary works. Fix the error. |

---

## Support Info

If you see errors in the console, they're actually helpful! The error boundary is catching them and showing details instead of just a blank screen. Follow the error message to fix the underlying issue.

Most common: "Cannot read property 'projectId'" = Firebase env vars not set in Vercel
