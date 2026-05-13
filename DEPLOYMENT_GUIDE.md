# UrbanEye Deployment Guide

## Database Used

UrbanEye uses PostgreSQL as the main database through Prisma ORM.

Current local database:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/civic_db
```

Redis is also configured for cache or supporting runtime features:

```text
REDIS_URL=redis://localhost:6379
```

For online deployment, use a managed PostgreSQL database such as Neon, Supabase, Railway, or Render PostgreSQL. Use Upstash Redis if Redis is needed online.

## Online Deployment Plan

Deploy these parts separately:

1. Backend API
   - Deploy `/backend` to Render, Railway, or similar Node.js hosting.
   - Set `DATABASE_URL` to the online PostgreSQL URL.
   - Set `REDIS_URL` to the online Redis URL if Redis is used.
   - Public backend URL example: `https://urbaneye-api.example.com`

2. AI Service
   - Deploy `/ai_service` to Render, Railway, or a Python-compatible host.
   - Public AI URL example: `https://urbaneye-ai.example.com`
   - Update backend AI service environment variables if required.

3. Web App
   - Deploy `/web_app` to Vercel.
   - Set the backend API URL environment variable to the hosted backend.
   - Public web URL example: `https://urbaneye.vercel.app`

4. Mobile App
   - Use Expo EAS Build.
   - Set `EXPO_PUBLIC_API_URL` to the deployed backend API:

```text
EXPO_PUBLIC_API_URL=https://urbaneye-api.example.com/api
```

## Android APK for Direct Website Download

Use this when you want a file users can download directly from your website:

```bash
cd /Users/alokranjan/Desktop/major/mobile_app
npx eas build --platform android --profile preview
```

The `preview` profile in `eas.json` builds an APK file. After the build finishes, download the APK from Expo and upload it to the website, for example:

```text
web_app/public/downloads/urbaneye.apk
```

Then the website can link to:

```text
/downloads/urbaneye.apk
```

## Play Store Build

Use this when preparing for Google Play:

```bash
cd /Users/alokranjan/Desktop/major/mobile_app
npx eas build --platform android --profile production
```

The `production` profile creates an Android App Bundle file suitable for Play Store upload.

## Important

Do not ship the app with `localhost` or a laptop IP such as `10.62.229.121`. Those only work during local testing. Before building the APK, replace `YOUR_BACKEND_DOMAIN` in `mobile_app/eas.json` with the deployed backend domain.
