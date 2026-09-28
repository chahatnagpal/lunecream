/**
 * MAISON SUCRE — CONFIGURATION
 * Supabase Project Keys & Environment Settings
 * Stitch Reference: Pastel Cake Studio Website (ID: 10785910662555848309)
 * Screen: Atelier Home — Pastel Blush & Lilac (ID: ff0d8f25dc4e4f2eb4cc7bd5aef8ab11)
 */

const CONFIG = {
  // Supabase Configuration - Connected to live project
  SUPABASE_URL: localStorage.getItem('MS_SUPABASE_URL') || 'https://jnovjohpgyhcfjewimpy.supabase.co',
  SUPABASE_ANON_KEY: localStorage.getItem('MS_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3Zqb2hwZ3loY2ZqZXdpbXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODMyOTEsImV4cCI6MjEwNjE1OTI5MX0.N-bi2y5OsboyoExa0hn8NchDkh2u6PmGYDnGmI4oyz4',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_aCbwJ-dsGURg6Mnl3psaIw_hkyMxdSh',
  SUPABASE_PROJECT_REF: 'jnovjohpgyhcfjewimpy',

  // Admin Master Passkey (for presentation and studio staff access)
  ADMIN_PASSKEY: 'maison2026',
  
  // Studio Business Settings
  CURRENCY: '$',
  TAX_RATE: 0.08, // 8% sales tax
  DELIVERY_FEE: 25.00,
  FREE_DELIVERY_THRESHOLD: 250.00,
  MIN_LEAD_TIME_HOURS: 48, // 48-hour notice required for artisanal cakes

  // Theme & Design reference
  STITCH_THEME: {
    title: 'Pastel Cake Studio Website',
    screen: 'Atelier Home — Pastel Blush & Lilac',
    projectId: '10785910662555848309',
    screenId: 'ff0d8f25dc4e4f2eb4cc7bd5aef8ab11',
    primaryPastel: '#E5D5F2', // Pastel Lilac
    blushPastel: '#F4E4DC',   // Pastel Blush
    accentGold: '#CCA459'     // Champagne Gold
  },

  // Storage Keys
  STORAGE_CART_KEY: 'maison_sucre_cart',
  STORAGE_ADMIN_SESSION: 'maison_sucre_admin_session',
  STORAGE_MOCK_DB: 'maison_sucre_db',
  STORAGE_STORE_VERSION: 'maison_sucre_version'
};

// Export configuration globally
window.APP_CONFIG = CONFIG;
