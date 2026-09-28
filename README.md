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
