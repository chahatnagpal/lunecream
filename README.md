# Maison Sucre — Pastel Cake Studio Website
### Atelier Home — Pastel Blush & Lilac Collection

A modern, production-ready, premium boutique cake studio and bakery e-commerce platform crafted with pure **HTML5**, **CSS3**, **Vanilla JavaScript (ES6)**, and real **Supabase** backend database integration.

Based on the Google Stitch project:
- **Title:** *Pastel Cake Studio Website* (Project ID: `10785910662555848309`)
- **Screen:** *Atelier Home — Pastel Blush & Lilac* (Screen ID: `ff0d8f25dc4e4f2eb4cc7bd5aef8ab11`)

---

## ✦ Brand & Visual Direction (Stitch Atelier Theme)

- **Brand Aesthetic:** Soft, feminine, editorial boutique cake atelier with couture pastry presentation.
- **Palette Tokens:**
  - **Pastel Lilac & Lavender:** `#FAF6FC` (whisper), `#F2E9F7` (soft mist), `#E5D5F2` (primary lilac), `#B392D6` (accent lilac), `#7E5B9E` (deep lilac).
  - **Soft Blush Pinks:** `#FDF7F5` (whisper), `#FAF0EC` (soft blush), `#F4E4DC` (primary blush), `#E8D0C5` (rich blush), `#D9BBAE` (rose nude).
  - **Whipped Creams & Ivory:** `#FDFBF8` (warm ivory), `#FAF6F0` (whipped cream), `#F3ECE3` (sweet butter).
  - **Champagne Gold Accents:** `#CCA459` (couture gold), `#E8D3A2` (champagne shimmer).
  - **Rich Plum Charcoal Typography:** `#261E28` (editorial text), `#584A59` (secondary text).
- **Typography:** Refined editorial serif headings (*Cormorant Garamond* / *Playfair Display*) paired with clean modern sans-serif (*Plus Jakarta Sans*).
- **Design Rhythm:** Generous editorial whitespace, delicate pastel borders, fluid transitions, and cinematic product showcase.

---

## 📁 Project Architecture

```
cake/
├── index.html                 # Editorial homepage (hero, Stitch collections, philosophy, cinema reel, gallery, FAQ)
├── shop.html                  # Confectionery catalogue (search, filter pills, sorting, in-stock toggle, dynamic cards)
├── product.html               # Product details (image gallery, 360° film, tier size price configurator, inscriptions, accordions)
├── bespoke.html               # Custom Cake Request Studio (interactive occasion, styling & flavor journey with pastel theme)
├── checkout.html              # Frictionless guest checkout (fulfillment choice, delivery address, 48h lead-time picker)
├── order-confirmation.html    # Order confirmation receipt with reference number and print functionality
├── admin.html                 # Protected Admin Portal (stats metrics, orders ledger, products CRUD, categories, Supabase setup)
├── admin/
│   └── index.html             # /admin route entry point
├── sql/
│   └── schema.sql             # Complete PostgreSQL Supabase database schema, RLS policies, and seed data
├── css/
│   ├── variables.css          # Design system tokens, typography scales, Stitch pastel color palette, elevations
│   ├── global.css             # CSS reset, responsive typography, container layouts, animations
│   ├── components.css         # Navigation, buttons, product cards, cart slide-over drawer, modals, toasts, footer
│   ├── home.css               # Hero banner, story collage, category showcase, gallery, testimonials, FAQ
│   ├── shop.css               # Catalog search bar, category pills, filter controls, product grid
│   ├── product.css            # Detail gallery, sizing options, custom inscription input, accordion tabs
│   ├── checkout.css           # Checkout form cards, fulfillment selector, order summary sidebar, receipt
│   ├── bespoke.css            # Interactive visual selection cards for custom cake commissions
│   └── admin.css              # Admin layout, sidebar, metrics cards, data tables, live status selectors, diagnostics
└── js/
    ├── config.js              # Supabase project URL, Anon Key, Stitch metadata, admin passkey, business settings
    ├── data.js                # Initial seed data for categories, boutique cakes, sample orders & custom requests
    ├── supabase-client.js     # Supabase client wrapper with live API integration & resilient local store fallback
    ├── ui.js                  # Global UI helpers: Toast notifications, modals, drawer, formatting
    ├── cart.js                # Shopping cart manager with LocalStorage persistence & slide-over drawer
    ├── home.js                # Homepage dynamic loaders (featured products, categories, FAQ accordions, video switcher)
    ├── shop.js                # Shop filtering, search debouncing, sorting, and dynamic grid rendering
    ├── product.js             # Product details parser, gallery thumbnail switcher, size price calculator
    ├── bespoke.js             # Custom cake request submission to Supabase `custom_requests` table
    ├── checkout.js            # Guest order placement to Supabase `orders` and `order_items` tables
    ├── order-confirmation.js  # Order confirmation receipt renderer & print controller
    └── admin.js               # Admin authentication, dashboard metrics, CRUD for products/categories, status updates
```

---

## ⚡ Quick Start / Local Development

To run the website locally on any web browser:

1. Open your terminal in the project directory:
   ```bash
   cd cake
   ```

2. Start a local HTTP server:
   ```bash
   python -m http.server 8000
   ```

3. Open your browser and navigate to:
   - **Customer Boutique:** [http://localhost:8000](http://localhost:8000)
   - **The Collection / Shop:** [http://localhost:8000/shop.html](http://localhost:8000/shop.html)
   - **Bespoke Custom Cake Studio:** [http://localhost:8000/bespoke.html](http://localhost:8000/bespoke.html)
   - **Admin Management Portal:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html) (or `http://localhost:8000/admin`)

---

## 🔑 Admin Portal & Protected Access

- **Admin URL:** `admin.html` (or click **Studio Admin** in the header or footer)
- **Demo Presentation Passkey:** `maison2026`

### Admin Capabilities:
- **Overview Dashboard:** Live metrics for Total Revenue, Total Orders, Pending Orders, Custom Inquiries, and Active Catalogue Products.
- **Orders Management:** Real-time orders ledger, line items view, customer delivery details, and live status dropdown (`New` &rarr; `Confirmed` &rarr; `Preparing` &rarr; `Ready` &rarr; `Delivered` &rarr; `Cancelled`).
- **Product Management:** Add new boutique cakes (name, price, category, image URL with live preview, tasting notes, portion guide, availability, featured status), edit existing products, delete products, and 1-click toggle availability (`In Stock`, `Pre-Order Only`, `Sold Out`).
- **Categories Management:** Create and organize boutique collections.
- **Custom Cake Inquiries:** Review personalized bespoke inquiries submitted by clients with event date, guest count, flavor palette, and design notes.
- **Supabase Backend Settings:** Input live Supabase project credentials with **1-Click SQL Schema Copy** and **Direct SQL Editor link**!

---

## 🗄️ Supabase Database Integration

The platform is pre-configured to connect to your live Supabase project:
- **Supabase URL:** `https://jnovjohpgyhcfjewimpy.supabase.co`
- **Project Ref:** `jnovjohpgyhcfjewimpy`

### 1-Click Database Setup:
1. In `admin.html`, go to the **Supabase Settings** tab.
2. Click **"Copy SQL Schema"** (or open [`sql/schema.sql`](file:///c:/Users/SAHIL%20KHAN/Desktop/cake/sql/schema.sql)).
3. Click **"Open SQL Editor ↗"** (opens [https://supabase.com/dashboard/project/jnovjohpgyhcfjewimpy/sql/new](https://supabase.com/dashboard/project/jnovjohpgyhcfjewimpy/sql/new)).
4. Paste the SQL schema and click **Run**.
5. Return to `admin.html` and click **"Check Now"** — the diagnostic card will immediately confirm **Live Supabase Connected & Ready**!

*(Note: Even before executing the schema, the store runs smoothly with an instant resilient local storage fallback, ensuring zero broken pages or error screens).*

---

## 🍰 Key User Journeys

1. **Browse & Discover:** Customers explore curated collections on the homepage or search/filter by category, price, and in-stock status on `shop.html`.
2. **Product Customization:** On `product.html`, customers choose tier sizing (6", 8", 2-Tier), customize edible cake plaque inscriptions, and view tasting notes.
3. **Frictionless Guest Ordering:** On `checkout.html`, customers choose between Soho studio pickup or courier delivery, select a delivery date (with 48h lead-time enforcement), and submit their order directly to Supabase.
4. **Bespoke Commissions:** On `bespoke.html`, clients submit custom tiered inquiries with visual occasion, guest count, and flavor preference cards.
5. **Studio Management:** The bakery owner manages orders, updates statuses, edits cake descriptions, and adjusts inventory from `admin.html`.

---

## ✦ AI Atelier Concierge Chatbot (Google Gemini 3 API)

A minimal, luxury AI concierge integrated directly into every store page.

### Features:
- **3D Floating Interactive Button:** Styled in pastel blush, lilac, and champagne gold with a pulsating indicator and smooth float animation.
- **Strict Brand Knowledge:** Knows everything about Maison Sucre: Soho address (148 Mercer St), operating hours (Tue–Sun: 10:00 AM – 6:30 PM, closed Mon), exact cake prices, portion guides, $25 flat delivery / FREE over $250, 48h lead times, bespoke tiers ($250–$1,500+), ingredients (84% Normandy butter, Valrhona chocolate, organic Tahitian vanilla, pressed botanicals).
- **Trilingual Fluency:** Seamlessly answers visitors in **English**, **Roman Urdu** (e.g., *"Prices kya hain?"*), and **Urdu (اردو)**.
- **Strict Anti-Hallucination & Scope:** Never invents facts or prices. Politely declines unrelated topics and provides verified studio contact info.
- **Zero API Key Leakage:** The Google Gemini API key is stored strictly in `private/` (git-ignored) and as an encrypted secret in a free Cloudflare Worker. The public frontend only talks to the proxy.

---

## 🔒 Cloudflare Worker Proxy Deployment (2-Minute Setup)

### Step 1: Open Cloudflare Dashboard
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) (sign up for free if you don't have an account).
2. On the left sidebar, click **Compute (Workers & Pages)** &rarr; **Workers & Pages**.
3. Click **Create application** &rarr; **Create Worker**.
4. Name your worker: `maison-sucre-ai-proxy` and click **Deploy**.

### Step 2: Paste the Worker Code
1. Click **Edit code** on your newly created Worker.
2. Replace all existing code with the complete code inside [`cloudflare-worker/worker.js`](cloudflare-worker/worker.js).
3. Click **Deploy** in the top right.

### Step 3: Add Your Gemini API Key as an Encrypted Secret
1. Click the back arrow (&larr;) to return to your Worker overview.
2. Click **Settings** &rarr; **Variables and Secrets**.
3. Under **Secrets**, click **Add secret**:
   - **Variable name:** `GEMINI_API_KEY`
   - **Value:** Paste your API key from `private/gemini-api-key.txt`.
4. Click **Deploy** / **Save**.
5. *(Optional)* Under **Environment Variables**, you can add `GEMINI_MODEL` with value `gemini-3-flash-preview` (default).

### Step 4: Connect to Your Website
1. Copy your worker URL (e.g. `https://maison-sucre-ai-proxy.YOUR_SUBDOMAIN.workers.dev`).
2. Open [`js/config.js`](js/config.js) and paste it into `CHATBOT_PROXY_URL`:
   ```javascript
   CHATBOT_PROXY_URL: 'https://maison-sucre-ai-proxy.YOUR_SUBDOMAIN.workers.dev',
   ```
   *(Or click the **⚙** gear icon inside the floating chat window on your website and paste it there!)*

---

## 🚀 Publishing to GitHub & GitHub Pages

Follow these simple steps to push your public store to GitHub:

```bash
# 1. Check git status (confirm private/ is ignored)
git status

# 2. Stage all public website files
git add .

# 3. Commit the changes
git commit -m "feat: add Maison Sucre store with 3D AI Atelier Concierge powered by Gemini 3"

# 4. Set main branch and push
git branch -M main
git remote add origin https://github.com/chahatnagpal/lunecream.git
git push -u origin main
```

### Enable GitHub Pages:
1. Open your repository on GitHub: `https://github.com/chahatnagpal/lunecream`.
2. Go to **Settings** &rarr; **Pages** (under "Code and automation" in the left sidebar).
3. Under **Build and deployment** &rarr; **Source**: Select **Deploy from a branch**.
4. Under **Branch**: Select `main` and folder `/ (root)`.
5. Click **Save**.
6. In 1 to 2 minutes, your website will be live at:
   **`https://chahatnagpal.github.io/lunecream/`**

