# Deployment Guide

## Overview

| Layer    | Service    | Free Tier | URL pattern                        |
|----------|------------|-----------|-------------------------------------|
| Frontend | Vercel     | Yes       | https://your-app.vercel.app         |
| Backend  | Render     | Yes       | https://your-api.onrender.com       |
| LLM API  | Groq       | Yes       | api.groq.com (14,400 req/day)       |

---

## Step 1 — Get your Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in (free, no credit card)
3. Click **API Keys** in the left sidebar
4. Click **Create API Key**, give it a name like "email-assistant"
5. Copy the key — it looks like: `gsk_xxxxxxxxxxxxxxxxxxxx`
6. Keep this open, you will need it in Step 3

---

## Step 2 — Push the project to GitHub

If you have not done this yet:

```bash
# Inside the ai-email-assistant folder
git init
git add .
git commit -m "initial commit"
```

Then create a new repository at https://github.com/new (name it `ai-email-assistant`),
then push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-email-assistant.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy the backend on Render

### 3.1 — Create the service

1. Go to https://render.com and sign up (free)
2. Click **New +** → **Web Service**
3. Click **Connect a repository** → select your `ai-email-assistant` repo
4. Fill in the settings exactly as follows:

   | Field            | Value                    |
   |------------------|--------------------------|
   | Name             | ai-email-assistant-api   |
   | Root Directory   | server                   |
   | Runtime          | Node                     |
   | Build Command    | npm install              |
   | Start Command    | node server.js           |
   | Instance Type    | Free                     |

5. Click **Advanced** to expand it

### 3.2 — Add environment variables on Render

Still on the same page, scroll down to **Environment Variables** and add:

| Key            | Value                          |
|----------------|--------------------------------|
| GROQ_API_KEY   | gsk_xxxx (your key from Step 1)|
| CLIENT_URL     | leave blank for now            |
| NODE_ENV       | production                     |

6. Click **Create Web Service**

Render will now build and deploy. This takes about 2 minutes.
Once it says **Live**, copy your backend URL — it looks like:
`https://ai-email-assistant-api.onrender.com`

### 3.3 — Test the backend is working

Open your browser and visit:
```
https://ai-email-assistant-api.onrender.com/health
```
You should see:
```json
{ "status": "ok", "timestamp": "2026-05-28T..." }
```

If you see that, the backend is live and healthy.

---

## Step 4 — Update the production env file for the frontend

Open `client/.env.production` in your project and replace the placeholder URL
with the actual Render URL you got in Step 3:

```
# client/.env.production
VITE_API_URL=https://ai-email-assistant-api.onrender.com
```

Save the file, then commit and push:

```bash
git add client/.env.production
git commit -m "set production API URL"
git push
```

---

## Step 5 — Deploy the frontend on Vercel

### 5.1 — Import the project

1. Go to https://vercel.com and sign up (free, use GitHub login)
2. Click **Add New** → **Project**
3. Find and import your `ai-email-assistant` repository
4. Vercel will auto-detect it as a Vite project

### 5.2 — Configure the project settings

Set the following on the import screen:

| Field              | Value      |
|--------------------|------------|
| Framework Preset   | Vite       |
| Root Directory     | client     |
| Build Command      | npm run build |
| Output Directory   | dist       |

### 5.3 — Add the environment variable on Vercel

Click **Environment Variables** and add:

| Key           | Value                                          |
|---------------|------------------------------------------------|
| VITE_API_URL  | https://ai-email-assistant-api.onrender.com    |

(Use the actual Render URL from Step 3)

5. Click **Deploy**

Vercel builds in about 60 seconds. Once done you get a URL like:
`https://ai-email-assistant.vercel.app`

### 5.4 — Test the full app

Open the Vercel URL in your browser, paste an email, click Generate Reply.
You should get a reply from Groq within a few seconds.

---

## Step 6 — Update CORS on the backend with the Vercel URL

Now that you have the final Vercel URL, go back to Render:

1. Open your web service → **Environment** tab
2. Edit the `CLIENT_URL` variable and set it to your Vercel URL:
   ```
   https://ai-email-assistant.vercel.app
   ```
3. Click **Save Changes** — Render will automatically redeploy

This locks down the backend so only your Vercel frontend can call it.

---

## Preventing Render cold starts (optional but recommended)

Render's free tier spins down after 15 minutes of no traffic.
The first request after that takes ~30 seconds to wake up.

To fix this for free, use https://uptimerobot.com:

1. Sign up (free)
2. Click **Add New Monitor**
3. Monitor type: **HTTP(s)**
4. URL: `https://ai-email-assistant-api.onrender.com/health`
5. Monitoring interval: **5 minutes**
6. Save

UptimeRobot pings your `/health` endpoint every 5 minutes, keeping Render warm.
This is why the `/health` route was added to the server.

---

## Final checklist

- [ ] Groq API key is saved in Render env vars (not in code)
- [ ] `client/.env.production` has the correct Render URL
- [ ] `client/.env.local` and `server/.env` are in `.gitignore` and NOT pushed to GitHub
- [ ] `CLIENT_URL` on Render is set to your Vercel URL
- [ ] `/health` endpoint returns `{ status: "ok" }` in browser
- [ ] App loads on Vercel URL and generates a reply end-to-end

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "Failed to generate reply" in the app | CORS error or server cold start | Check browser console for exact error; wait 30s and retry |
| CORS blocked error in console | `CLIENT_URL` not set on Render | Add your Vercel URL to `CLIENT_URL` env var on Render |
| Render build fails | Wrong root directory | Make sure Root Directory is set to `server` |
| Vercel build fails | Wrong root directory | Make sure Root Directory is set to `client` |
| Reply generates locally but not on Vercel | `.env.production` has wrong URL | Double-check the URL matches exactly what Render shows |
| Groq API error 401 | Wrong API key | Re-copy the key from console.groq.com and update on Render |
