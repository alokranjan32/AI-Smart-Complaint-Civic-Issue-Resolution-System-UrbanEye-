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

## Recommended Online Deployment Plan

This repo now includes:

- `render.yaml` for the backend API, AI service, PostgreSQL, and Redis.
- `web_app/vercel.json` for deploying the Next.js dashboard on Vercel.
- `.env.example` files for backend, AI service, web, and mobile runtime configuration.

Deploy in this order:

1. Render: backend API, AI service, PostgreSQL, Redis
2. Vercel: web dashboard
3. Expo EAS: mobile Android/iOS builds

## 1. Deploy Backend, AI Service, Database, and Redis on Render

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml` and create:
   - `urbaneye-api`
   - `urbaneye-ai`
   - `urbaneye-db`
   - `urbaneye-redis`
4. Set the required secret environment variables in Render:

```text
GROQ_API_KEY=your_groq_api_key
CORS_ORIGINS=https://YOUR_WEB_APP_DOMAIN
```

`CORS_ORIGINS` can be updated after the Vercel URL is created. Multiple origins should be comma-separated.

The backend start command runs Prisma migrations automatically:

```bash
npm run deploy:start
```

Expected health URLs after deploy:

```text
https://YOUR_BACKEND_DOMAIN/health
https://YOUR_AI_SERVICE_DOMAIN/health
```

## 2. Deploy Web App on Vercel

1. Import the GitHub repository into Vercel.
2. Set the Vercel project root directory to:

```text
web_app
```

3. Add this environment variable:

```text
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_DOMAIN/api
```

4. Deploy.
5. Copy the Vercel production URL and update the Render backend variable:

```text
CORS_ORIGINS=https://YOUR_WEB_APP_DOMAIN
```

## 3. Deploy Mobile App with Expo EAS

Before building, replace `https://YOUR_BACKEND_DOMAIN/api` in `mobile_app/eas.json` with your deployed backend API URL.

Set `EXPO_PUBLIC_API_URL` to the deployed backend API:

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
