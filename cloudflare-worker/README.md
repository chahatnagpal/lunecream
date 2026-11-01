# Cloudflare Worker Proxy for Maison Sucre AI Concierge

This Worker acts as a secure reverse proxy between your public website on GitHub Pages and the **Google Gemini 3 API**.

### 🔒 Why Use This Proxy?
- Your website code on GitHub Pages is 100% public.
- The Cloudflare Worker keeps your `GEMINI_API_KEY` hidden inside Cloudflare Secrets.
- Visitors talk only to your Cloudflare Worker endpoint, which enforces rate limits and forwards requests to Google Gemini 3.

---

## Option A: Deploy via Cloudflare Dashboard (Easiest — No Terminal Needed, 2 Minutes)

1. **Log in to Cloudflare:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) (create a free account if you don't have one).

2. **Create a Worker:**
   - In the left sidebar, click **Compute (Workers & Pages)** > **Workers & Pages**.
   - Click **Create application** > **Create Worker**.
   - Name it `maison-sucre-ai-proxy` and click **Deploy**.

3. **Paste the Worker Code:**
   - Click **Edit code** on the worker page.
   - Delete any default code in `worker.js`.
   - Copy the entire contents of [`cloudflare-worker/worker.js`](./worker.js) and paste it into the editor.
   - Click **Deploy** in the top right corner.

4. **Add Your Gemini API Key as a Secret:**
   - Click the back arrow to return to your Worker's overview page.
   - Go to **Settings** > **Variables and Secrets**.
   - Under **Secrets**, click **Add secret**.
   - Variable name: `GEMINI_API_KEY`
   - Value: Paste your key from `private/gemini-api-key.txt`.
   - Click **Deploy** / **Save**.
   - (Optional) Under **Environment Variables**, you can add `GEMINI_MODEL` with value `gemini-3-flash-preview` (default).

5. **Copy Your Worker URL:**
   - On the Worker overview page, copy your public worker URL (e.g. `https://maison-sucre-ai-proxy.YOUR_SUBDOMAIN.workers.dev`).

6. **Paste into `js/config.js`:**
   - Open `js/config.js` in your website folder and set:
     ```javascript
     CHATBOT_PROXY_URL: 'https://maison-sucre-ai-proxy.YOUR_SUBDOMAIN.workers.dev',
     ```

---

## Option B: Deploy via Wrangler CLI (Command Line)

If you have Node.js and Wrangler installed:

```bash
cd cloudflare-worker

# 1. Login to Cloudflare
npx wrangler login

# 2. Add your Gemini API key secret
npx wrangler secret put GEMINI_API_KEY
# (When prompted, paste your key from private/gemini-api-key.txt)

# 3. Deploy the worker
npx wrangler deploy
```

Once deployed, copy the output URL and update `CHATBOT_PROXY_URL` in `js/config.js`.
