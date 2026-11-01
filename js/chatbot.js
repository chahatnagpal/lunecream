/**
 * MAISON SUCRE — AI ATELIER CONCIERGE CHATBOT
 * Client-Side Controller & Google Gemini 3 Proxy Interface
 * 
 * Features:
 * - Auto-injected 3D-styled floating concierge button and modal window.
 * - Multi-lingual support: English, Roman Urdu, and Urdu (اردو).
 * - Calls Cloudflare Worker proxy holding the Google Gemini 3 API key.
 * - Resilient built-in atelier fallback engine when proxy is pending deployment.
 * - Zero security leaks: Never contains or exposes the raw API key.
 */

(function () {
  'use strict';

  // State
  let isOpen = false;
  let isLoading = false;
  let chatHistory = [];

  const STORAGE_KEY = 'maison_sucre_chat_history';

  // Verified Local Studio Knowledge Base for immediate responsiveness & fallback
  const STUDIO_KB = {
    name: 'Maison Sucre Haute Cake Studio',
    address: '148 Mercer Street, Soho, New York, NY 10012',
    hours: 'Tuesday – Sunday: 10:00 AM – 6:30 PM (Closed Mondays for studio baking)',
    delivery: 'Complimentary studio pickup in Soho. White-glove temperature-controlled courier delivery across NYC (Manhattan, Brooklyn, Queens) and Tri-State area for $25 flat rate (FREE on orders over $250).',
    leadTime: 'Minimum 48 hours notice for Signature Collection cakes. 5–7 days for custom single/two-tier cakes. 4–8 weeks for multi-tiered wedding cakes.',
    bespoke: 'Custom cakes available for Weddings, Milestone Birthdays, Anniversaries, and Galas via bespoke.html. Budgets: $250–$450 (Petite), $450–$800 (Two-Tier), $800–$1,500 (Three-Tier), $1,500+ (Monumental).',
    storage: 'Refrigerate until 1 to 2 hours before serving. Buttercream is at its silkiest at room temperature.',
    dietary: 'All cakes are vegetarian. Gluten-free and eggless recipes available on request. Kitchen handles wheat, nuts, and dairy.',
    cakes: [
      { name: "L'Aurore Pistachio & Rose", price: 125, size: '6-inch (serves 8-10)', notes: 'Sicilian pistachio sponge, Persian rosewater, raspberry reduction, Swiss meringue, 24k gold leaf.' },
      { name: "Noir Velvet & Salted Caramel", price: 115, size: '6-inch (serves 8-10)', notes: '70% Valrhona dark chocolate, Brittany salted butter caramel, cacao nib praline, espresso ganache.' },
      { name: "Symphonie Blanche Bridal Tier", price: 280, size: '2-Tier (serves 28-35)', notes: 'Tahitian vanilla chiffon, elderflower curd, white peach compote, sugar peonies.' },
      { name: "Madame Pompadour Vintage Cake", price: 135, size: '7-inch (serves 12-14)', notes: 'Earl Grey sponge, lavender blackberry preserves, blush Lambeth ruffles, edible pearls.' },
      { name: "Pressed Flora & Lemon Verbena", price: 120, size: '6-inch (serves 8-10)', notes: 'Amalfi lemon chiffon, Meyer lemon curd, verbena diplomat, organic pressed flowers.' },
      { name: "Coffret d'Élégance Petite Box", price: 68, size: 'Box of 6 miniature cakes', notes: 'Ruby chocolate & passionfruit entremets, hazelnut Paris-Brest, matcha jasmine tarts.' },
      { name: "Le Rêve Vanilla & Wild Strawberry", price: 110, size: '6-inch (serves 8-10)', notes: 'Madagascar bourbon vanilla, strawberry coulis, white chocolate mousse, fraises des bois.' },
      { name: "Chai Fig & Spiced Honey Gateau", price: 130, size: '8-inch (serves 14-16)', notes: 'Brown butter spiced sponge, black mission fig compote, wildflower honey buttercream, walnuts, rosemary.' },
      { name: "Atelier Lilac & Blackberry Chiffon", price: 135, size: '7-inch (serves 10-12)', notes: 'Stitch Atelier signature. Lilac vanilla chiffon, wild French blackberry, lavender mascarpone, gold leaf.' },
      { name: "Blush Velvet & White Peach Lambeth", price: 130, size: '6-inch (serves 8-10)', notes: 'Stitch Atelier signature. Victorian Lambeth piping, blush buttercream, white peach, champagne diplomat.' }
    ]
  };

  // Helper: Get Configured Proxy URL
  function getProxyUrl() {
    return (window.APP_CONFIG && window.APP_CONFIG.CHATBOT_PROXY_URL) ||
           localStorage.getItem('MS_CHATBOT_PROXY_URL') ||
           '';
  }

  // Initialize Chatbot when DOM is ready
  function initChatbot() {
    if (document.getElementById('ms-chatbot-root')) return;

    // Create Root Container
    const root = document.createElement('div');
    root.id = 'ms-chatbot-root';
    root.innerHTML = `
      <!-- 3D Floating Action Button -->
      <button class="ms-chatbot-trigger" id="ms-chatbot-trigger" aria-label="Open Maison Sucre AI Concierge" title="Ask Maison Sucre Atelier Concierge">
        <div class="ms-trigger-orb">
          <span class="ms-trigger-icon">✦</span>
        </div>
        <div class="ms-trigger-label">
          <span class="ms-trigger-title">Atelier Concierge</span>
          <span class="ms-trigger-sub">
            <span class="ms-pulse-dot"></span> Online • Soho
          </span>
        </div>
      </button>

      <!-- Chatbot Modal Window -->
      <div class="ms-chatbot-window" id="ms-chatbot-window" role="dialog" aria-modal="true" aria-label="Maison Sucre Concierge">
        
        <!-- Header -->
        <div class="ms-chat-header">
          <div class="ms-chat-header-brand">
            <div class="ms-chat-crest">MS</div>
            <div class="ms-chat-header-info">
              <h3>Maison Sucre</h3>
              <p><span class="ms-pulse-dot"></span> AI Atelier Concierge • Soho, NY</p>
            </div>
          </div>
          <div class="ms-chat-actions">
            <button class="ms-chat-btn-action" id="ms-btn-settings" title="Proxy Setup / Status" aria-label="Proxy Settings">⚙</button>
            <button class="ms-chat-btn-action" id="ms-btn-clear" title="Clear Conversation" aria-label="Clear Chat">↺</button>
            <button class="ms-chat-btn-action" id="ms-btn-close" title="Close Chat" aria-label="Close Chat">&times;</button>
          </div>
        </div>

        <!-- Substrip: Language Support & Status -->
        <div class="ms-chat-substrip">
          <span class="ms-lang-badge">EN • Roman Urdu • اردو</span>
          <span class="ms-proxy-indicator" id="ms-proxy-status-tag" title="Click to configure Cloudflare Worker proxy">
            ${getProxyUrl() ? '✦ Gemini 3 Live' : '✦ Atelier Mode (Setup Proxy)'}
          </span>
        </div>

        <!-- Messages Area -->
        <div class="ms-chat-messages" id="ms-chat-messages">
          <!-- Dynamic conversation cards -->
        </div>

        <!-- Quick Suggestion Chips -->
        <div class="ms-quick-prompts" id="ms-quick-prompts">
          <button class="ms-prompt-chip" data-prompt="Show me your signature cakes and prices">🎂 Signature Cakes &amp; Prices</button>
          <button class="ms-prompt-chip" data-prompt="How do bespoke wedding tiers work and what is the lead time?">💍 Wedding &amp; Bespoke Tiers</button>
          <button class="ms-prompt-chip" data-prompt="What are your NYC delivery fees and studio hours?">🚚 NYC Delivery &amp; Hours</button>
          <button class="ms-prompt-chip" data-prompt="Do you offer gluten-free or eggless cakes?">🌿 Dietary Options</button>
        </div>

        <!-- Input Footer -->
        <div class="ms-chat-footer">
          <form class="ms-chat-form" id="ms-chat-form">
            <input 
              type="text" 
              class="ms-chat-input" 
              id="ms-chat-input" 
              placeholder="Ask about cakes, flavors, delivery, bespoke tiers..." 
              autocomplete="off"
              maxlength="1000"
              required
            >
            <button type="submit" class="ms-chat-send-btn" id="ms-chat-send-btn" aria-label="Send Message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div class="ms-chat-caption">
            Google Gemini 3 Powered • Maison Sucre Atelier Soho
          </div>
        </div>

        <!-- Proxy Settings Modal (Inside Chatbot) -->
        <div class="ms-proxy-modal-overlay" id="ms-proxy-modal-overlay">
          <div class="ms-proxy-modal">
            <h4>Cloudflare Worker Proxy</h4>
            <p>
              Your Google Gemini 3 API key is safely stored in your Cloudflare Worker secret. Paste your public Worker URL below:
            </p>
            <input 
              type="url" 
              id="ms-worker-url-input" 
              placeholder="https://maison-sucre-ai-proxy.YOUR_SUBDOMAIN.workers.dev"
              value="${getProxyUrl()}"
            >
            <div class="ms-proxy-modal-actions">
              <button class="ms-proxy-modal-btn secondary" id="ms-proxy-cancel">Cancel</button>
              <button class="ms-proxy-modal-btn primary" id="ms-proxy-save">Save &amp; Connect</button>
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(root);
    attachEvents();
    loadHistory();

    // Auto-open if URL has ?chat=true or #chat
    if (window.location.search.includes('chat=true') || window.location.hash === '#chat') {
      setTimeout(() => toggleChat(true), 400);
    }
  }

  // Attach Event Listeners
  function attachEvents() {
    const trigger = document.getElementById('ms-chatbot-trigger');
    const windowEl = document.getElementById('ms-chatbot-window');
    const closeBtn = document.getElementById('ms-btn-close');
    const clearBtn = document.getElementById('ms-btn-clear');
    const settingsBtn = document.getElementById('ms-btn-settings');
    const proxyStatusTag = document.getElementById('ms-proxy-status-tag');
    const form = document.getElementById('ms-chat-form');
    const input = document.getElementById('ms-chat-input');
    const quickPrompts = document.getElementById('ms-quick-prompts');

    // Proxy modal controls
    const proxyModal = document.getElementById('ms-proxy-modal-overlay');
    const proxyCancel = document.getElementById('ms-proxy-cancel');
    const proxySave = document.getElementById('ms-proxy-save');
    const proxyInput = document.getElementById('ms-worker-url-input');

    // Toggle Chat Window
    trigger.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));

    // Clear Chat
    clearBtn.addEventListener('click', () => {
      chatHistory = [];
      sessionStorage.removeItem(STORAGE_KEY);
      renderInitialGreeting();
    });

    // Proxy Settings Modal
    settingsBtn.addEventListener('click', () => {
      proxyInput.value = getProxyUrl();
      proxyModal.classList.add('open');
    });
    proxyStatusTag.addEventListener('click', () => {
      proxyInput.value = getProxyUrl();
      proxyModal.classList.add('open');
    });
    proxyCancel.addEventListener('click', () => proxyModal.classList.remove('open'));
    proxySave.addEventListener('click', () => {
      const val = proxyInput.value.trim();
      localStorage.setItem('MS_CHATBOT_PROXY_URL', val);
      if (window.APP_CONFIG) {
        window.APP_CONFIG.CHATBOT_PROXY_URL = val;
      }
      proxyModal.classList.remove('open');
      updateProxyStatusIndicator();
      addMessage('bot', val 
        ? `✦ **Cloudflare Proxy Connected!** Now using Google Gemini 3 at: \`${val}\`. How may I assist you with Maison Sucre today?`
        : `✦ **Using Local Atelier Concierge Mode.** All studio menu items, pricing, hours, and bespoke policies are active.`
      );
    });

    // Send Form
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || isLoading) return;
      input.value = '';
      handleUserSubmit(text);
    });

    // Quick prompt chips
    quickPrompts.addEventListener('click', (e) => {
      const chip = e.target.closest('.ms-prompt-chip');
      if (!chip || isLoading) return;
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        handleUserSubmit(prompt);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat(false);
      }
    });
  }

  function updateProxyStatusIndicator() {
    const el = document.getElementById('ms-proxy-status-tag');
    if (!el) return;
    const url = getProxyUrl();
    el.textContent = url ? '✦ Gemini 3 Live' : '✦ Atelier Mode (Setup Proxy)';
    el.style.color = url ? '#10B981' : 'var(--color-taupe, #8C7667)';
  }

  function toggleChat(forceState) {
    const windowEl = document.getElementById('ms-chatbot-window');
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    if (isOpen) {
      windowEl.classList.add('open');
      document.getElementById('ms-chat-input').focus();
    } else {
      windowEl.classList.remove('open');
    }
  }

  function loadHistory() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        chatHistory = JSON.parse(saved);
      }
    } catch (e) {
      chatHistory = [];
    }

    if (!chatHistory.length) {
      renderInitialGreeting();
    } else {
      renderAllMessages();
    }
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.slice(-20)));
    } catch (e) {}
  }

  function renderInitialGreeting() {
    const messagesEl = document.getElementById('ms-chat-messages');
    messagesEl.innerHTML = '';
    addMessage('bot', 
      `*Bonjour & Welcome to Maison Sucre.* ✦\n\nI am your AI Atelier Concierge. Ask me anything about our sculptural cakes, exact pricing, flavors, NYC courier delivery, or bespoke wedding commissions.\n\n*(Feel free to chat in English, Roman Urdu, یا اردو!)*`,
      false
    );
  }

  function renderAllMessages() {
    const messagesEl = document.getElementById('ms-chat-messages');
    messagesEl.innerHTML = '';
    chatHistory.forEach(item => {
      appendMessageToDOM(item.role, item.content, item.time, false);
    });
    scrollToBottom();
  }

  function addMessage(role, content, shouldSave = true) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appendMessageToDOM(role, content, time, true);
    if (shouldSave) {
      chatHistory.push({ role, content, time });
      saveHistory();
    }
    scrollToBottom();
  }

  function appendMessageToDOM(role, content, time, animate) {
    const messagesEl = document.getElementById('ms-chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `ms-message ${role}`;
    if (!animate) msgDiv.style.animation = 'none';

    const bubble = document.createElement('div');
    bubble.className = 'ms-message-bubble';
    bubble.innerHTML = formatMarkdown(content);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'ms-message-time';
    timeDiv.textContent = time || '';

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(timeDiv);
    messagesEl.appendChild(msgDiv);
  }

  function showTypingIndicator() {
    const messagesEl = document.getElementById('ms-chat-messages');
    const indicator = document.createElement('div');
    indicator.className = 'ms-typing-indicator';
    indicator.id = 'ms-typing-indicator';
    indicator.innerHTML = `
      <div class="ms-typing-dot"></div>
      <div class="ms-typing-dot"></div>
      <div class="ms-typing-dot"></div>
    `;
    messagesEl.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('ms-typing-indicator');
    if (indicator) indicator.remove();
  }

  function scrollToBottom() {
    const messagesEl = document.getElementById('ms-chat-messages');
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  // Handle User Message Submission
  async function handleUserSubmit(text) {
    addMessage('user', text);
    isLoading = true;
    toggleSendBtn(false);
    showTypingIndicator();

    const proxyUrl = getProxyUrl();

    if (proxyUrl) {
      // 1. Live Call to Cloudflare Worker Proxy (Google Gemini 3)
      try {
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: chatHistory.slice(-8)
          })
        });

        hideTypingIndicator();

        if (response.ok) {
          const data = await response.json();
          addMessage('bot', data.reply || "I am here to assist with Maison Sucre's confections. How may I help?");
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('Worker proxy error, falling back to local atelier concierge:', errData);
          const fallbackReply = generateAtelierFallbackResponse(text);
          addMessage('bot', fallbackReply);
        }
      } catch (err) {
        hideTypingIndicator();
        console.warn('Network error reaching proxy, using local engine:', err);
        const fallbackReply = generateAtelierFallbackResponse(text);
        addMessage('bot', fallbackReply);
      }
    } else {
      // 2. Intelligent Local Atelier Concierge (Always adheres to strict rules)
      setTimeout(() => {
        hideTypingIndicator();
        const fallbackReply = generateAtelierFallbackResponse(text);
        addMessage('bot', fallbackReply);
      }, 500);
    }

    isLoading = false;
    toggleSendBtn(true);
  }

  function toggleSendBtn(enabled) {
    const btn = document.getElementById('ms-chat-send-btn');
    if (btn) btn.disabled = !enabled;
  }

  // Strict Local Knowledge Base Responder (Rule Enforcing)
  function generateAtelierFallbackResponse(query) {
    const q = query.toLowerCase().trim();

    // Detect language
    const isUrduScript = /[\u0600-\u06FF]/.test(query);
    const isRomanUrdu = /\b(kya|hai|hain|mein|ka|ke|ki|mujhe|chahiye|batao|shukriya|kitne|kitna|kahan|kab|deliver|bhejo|pucho|assalam|salam)\b/i.test(query);

    // Rule 4: Refuse unrelated questions
    const unrelatedKeywords = ['weather', 'crypto', 'bitcoin', 'politics', 'president', 'homework', 'code', 'python', 'javascript', 'recipe of biryani', 'gym', 'stocks'];
    const isUnrelated = unrelatedKeywords.some(w => q.includes(w));

    if (isUnrelated) {
      if (isUrduScript) {
        return "معذرت، میں صرف میسن سوکرے (Maison Sucre) کیک اسٹوڈیو، ہمارے مینیو، آرڈرز اور ڈیلیوری سے متعلق معلومات فراہم کر سکتا ہوں۔";
      }
      if (isRomanUrdu) {
        return "Maazrat, main sirf **Maison Sucre** cake studio, hamaray artisanal cakes, bespoke orders aur delivery ke baray mein madad kar sakta hoon.";
      }
      return "I am Maison Sucre's atelier concierge and can only assist with inquiries regarding our cake collection, bespoke orders, and confections.";
    }

    // 1. Menu & Prices
    if (q.includes('price') || q.includes('menu') || q.includes('cake') || q.includes('cost') || q.includes('kitne') || q.includes('list') || q.includes('collection') || q.includes('aurore') || q.includes('noir') || q.includes('lambeth')) {
      if (isUrduScript) {
        return `**میسن سوکرے کے دستخطی کیکس اور قیمتیں:**\n\n` +
          `• **L'Aurore Pistachio & Rose** — $125.00 (پستہ، گلاب، رسبری اور 24k سونا)\n` +
          `• **Noir Velvet & Salted Caramel** — $115.00 (70% والرہونا ڈارک چاکلیٹ اور سالٹڈ کیریمل)\n` +
          `• **Madame Pompadour Vintage Cake** — $135.00 (ارل گرے، بلیک بیری اور ونٹیج لیمبتھ پائپنگ)\n` +
          `• **Pressed Flora & Lemon Verbena** — $120.00 (لیمن شیفون اور اصلی پریس کیے ہوئے پھول)\n` +
          `• **Symphonie Blanche Bridal Tier** — $280.00 (دو منزلہ شادی کا کیک • 28-35 افراد)\n` +
          `• **Coffret d'Élégance Petite Box** — $68.00 (6 نفیس منی ایچر کیکس)\n\n` +
          `سائز اپ گریڈ: 8-انچ (+$35) • 2-ٹائر (+$120)۔ تمام آرڈرز کم از کم 48 گھنٹے پہلے درکار ہیں۔`;
      }
      if (isRomanUrdu) {
        return `**Maison Sucre Signature Cakes & Prices:**\n\n` +
          `• **L'Aurore Pistachio & Rose** — $125.00 (Pistachio, Persian rosewater, raspberry aur 24k gold leaf)\n` +
          `• **Noir Velvet & Salted Caramel** — $115.00 (70% Valrhona dark chocolate aur salted butter caramel)\n` +
          `• **Madame Pompadour Vintage Cake** — $135.00 (Earl Grey, blackberry preserves aur Victorian Lambeth ruffles)\n` +
          `• **Pressed Flora & Lemon Verbena** — $120.00 (Amalfi lemon aur organic pressed flowers)\n` +
          `• **Symphonie Blanche Bridal Tier** — $280.00 (2-Tier bridal cake • 28-35 servings)\n` +
          `• **Coffret d'Élégance Box** — $68.00 (6 miniature French pastries)\n\n` +
          `**Size Options:** 6-inch standard (base price), 8-inch large (+$35), 2-Tier (+$120). Order ke liye kam az kam 48 ghantay pehle notice darkaar hai!`;
      }
      return `**Maison Sucre Signature Collection:**\n\n` +
        `• **L'Aurore Pistachio & Rose** — $125.00 (Pistachio sponge, rosewater, raspberry, 24k gold leaf)\n` +
        `• **Noir Velvet & Salted Caramel** — $115.00 (70% Valrhona chocolate, salted caramel, espresso ganache)\n` +
        `• **Madame Pompadour Vintage Cake** — $135.00 (Earl Grey, lavender blackberry, blush Lambeth ruffles)\n` +
        `• **Pressed Flora & Lemon Verbena** — $120.00 (Amalfi lemon, verbena diplomat, pressed violas)\n` +
        `• **Symphonie Blanche Bridal Tier** — $280.00 (2-Tier sculptural tier, serves 28–35)\n` +
        `• **Coffret d'Élégance Petite Box** — $68.00 (Curated gift box of 6 individual entremets)\n\n` +
        `**Portion Sizing:** 6-inch (serves 8–10), 8-inch (+$35, serves 16–20), 2-Tier (+$120, serves 28–35). Custom gold plaques included!`;
    }

    // 2. Timings & Hours
    if (q.includes('timing') || q.includes('hour') || q.includes('open') || q.includes('close') || q.includes('kab') || q.includes('waqt')) {
      if (isUrduScript) {
        return `**اسٹوڈیو کے اوقات:**\n\n• منگل تا اتوار: 10:00 AM تا 6:30 PM\n• پیر کے روز اسٹوڈیو بند رہتا ہے (بیکنگ اور پرائیویٹ کلاسز)۔`;
      }
      if (isRomanUrdu) {
        return `**Maison Sucre Timings:**\n\n• Tuesday se Sunday: 10:00 AM se 6:30 PM tak open rehta hai.\n• Monday ko studio closed hota hai (private baking & atelier prep).`;
      }
      return `**Studio Hours:**\n\n• Tuesday – Sunday: 10:00 AM – 6:30 PM\n• Monday: Closed for atelier baking & private masterclasses.`;
    }

    // 3. Address & Location
    if (q.includes('address') || q.includes('location') || q.includes('where') || q.includes('kahan') || q.includes('soho') || q.includes('directions')) {
      if (isUrduScript) {
        return `**ہمارا پتہ:**\n148 Mercer Street, Soho, New York, NY 10012\n(سوہو کے تاریخی کاسٹ آئرن ڈسٹرکٹ میں واقع ہے)۔`;
      }
      if (isRomanUrdu) {
        return `**Maison Sucre Address:**\n148 Mercer Street, Soho, New York, NY 10012.\nAap hamaray Soho studio se complimentary pickup bhi kar saktay hain!`;
      }
      return `**Studio Location:**\n148 Mercer Street, Soho, New York, NY 10012.\nComplimentary studio pickup is available Tuesday through Sunday during business hours.`;
    }

    // 4. Delivery & Fees
    if (q.includes('deliver') || q.includes('courier') || q.includes('pickup') || q.includes('fee') || q.includes('free') || q.includes('bhejo')) {
      if (isUrduScript) {
        return `**ڈیلیوری اور پک اپ:**\n\n` +
          `• **اسٹوڈیو پک اپ:** 148 Mercer St, Soho پر بالکل مفت ہے۔\n` +
          `• **وائٹ گلوو کوریئر ڈیلیوری:** پورے NYC (مین ہیٹن، بروک لین، کوئنز) میں $25.00 فلیٹ ریٹ ہے۔\n` +
          `• **مفت ڈیلیوری:** $250 یا اس سے زائد کے تمام آرڈرز پر ڈیلیوری بالکل مفت ہے!`;
      }
      if (isRomanUrdu) {
        return `**Delivery & Pickup Details:**\n\n` +
          `• **Studio Pickup:** 148 Mercer St, Soho par bilkul free hai.\n` +
          `• **Courier Delivery:** Chilled temperature-controlled delivery poore NYC (Manhattan, Brooklyn, Queens) mein $25.00 flat rate par dastiyab hai.\n` +
          `• **Free Delivery:** $250 se zyada ke orders par delivery bilkul FREE hai!`;
      }
      return `**Delivery & Pickup Options:**\n\n` +
        `• **Studio Pickup:** Complimentary from our Soho studio (148 Mercer St, NY).\n` +
        `• **White-Glove Courier Delivery:** $25.00 flat rate temperature-controlled delivery across Manhattan, Brooklyn, Queens, and the Tri-State area.\n` +
        `• **FREE Delivery:** Complimentary on all orders of $250.00 and above!`;
    }

    // 5. Bespoke & Weddings
    if (q.includes('bespoke') || q.includes('custom') || q.includes('wedding') || q.includes('tier') || q.includes('shadi') || q.includes('order')) {
      if (isUrduScript) {
        return `**بیسپوک اور ویڈنگ کیکس:**\n\nہم شادیوں اور یادگار سالگرہ کے لیے خاص مجسمہ نما کیکس تیار کرتے ہیں۔\n` +
          `• بجٹ رینج: $250 سے $1,500+ تک۔\n` +
          `• پیشگی نوٹس: سنگل یا دو منزلہ کیک کے لیے 5–7 دن، جبکہ بڑے ویڈنگ کیکس کے لیے 4–8 ہفتے درکار ہوتے ہیں۔\n` +
          `آپ ہماری ویب سائٹ کے **Bespoke Studio** پیج پر فارم پر کر کے 24 گھنٹوں میں تفصیلی ڈیزائن اور کوٹیشن حاصل کر سکتے ہیں۔`;
      }
      if (isRomanUrdu) {
        return `**Bespoke & Wedding Commissions:**\n\n` +
          `Hum weddings aur special milestones ke liye custom sculptural cakes banatay hain.\n` +
          `• **Budget:** $250 se $1,500+ tak.\n` +
          `• **Notice:** Bespoke cakes ke liye 5–7 din aur baray wedding tiers ke liye 4–8 weeks pehle book karna zaroori hai.\n` +
          `Aap hamaray **Bespoke Studio (bespoke.html)** page par form submit kar saktay hain, 24 hours mein proposal mil jayega!`;
      }
      return `**Bespoke & Wedding Commissions:**\n\n` +
        `We craft bespoke centerpieces for weddings, milestone birthdays, and galas.\n` +
        `• **Budget Ranges:** $250–$450 (Petite), $450–$800 (Two-Tier), $800–$1,500 (Three-Tier), $1,500+ (Monumental Installation).\n` +
        `• **Lead Times:** 5–7 days for bespoke celebrations, 4–8 weeks recommended for grand wedding tiers.\n` +
        `You can submit your date and vision directly on our **Bespoke Studio** page ([bespoke.html](bespoke.html)) for a custom sketch within 24 hours.`;
    }

    // 6. Ingredients & Allergies
    if (q.includes('ingredient') || q.includes('gluten') || q.includes('vegan') || q.includes('egg') || q.includes('allergy') || q.includes('nut') || q.includes('halal') || q.includes('vegetarian')) {
      if (isUrduScript) {
        return `**اجزاء اور خوراک کی معلومات:**\n\n` +
          `• ہمارے تمام کیکس 100% ویجیٹیرین ہیں، جن میں نارمنڈی مکھن، نامیاتی تاہیتی ونیلا اور والرہونا چاکلیٹ استعمال ہوتی ہے۔\n` +
          `• گلوٹین فری (Gluten-Free) اور بغیر انڈے (Eggless) کیکس بھی فرمائش پر تیار کیے جاتے ہیں۔\n` +
          `• کچن میں گندم، میوہ جات اور ڈیری پراڈکٹس کا استعمال ہوتا ہے۔`;
      }
      if (isRomanUrdu) {
        return `**Ingredients & Dietary Info:**\n\n` +
          `• Hamaray tamam cakes 100% vegetarian hain. Hum 84% Normandy butter, organic Tahitian vanilla aur Valrhona chocolate use kartay hain.\n` +
          `• Gluten-free aur eggless options request par available hain.\n` +
          `• Hamare kitchen mein nuts aur dairy handle hoti hai.`;
      }
      return `**Ingredients & Dietary Accommodations:**\n\n` +
        `• All of our cakes are vegetarian, crafted with 84% butterfat Normandy dairy, organic Tahitian vanilla, single-origin Valrhona chocolate, and organic edible pressed flowers.\n` +
        `• Gluten-free adaptations and eggless recipes are available for select cakes upon request.\n` +
        `• Please note our kitchen handles wheat, dairy, and tree nuts.`;
    }

    // 7. Rule 3: Unknown info fallback (Contact Details)
    if (isUrduScript) {
      return `معذرت، یہ خاص معلومات میرے پاس ریکارڈ میں موجود نہیں ہے۔ براہ کرم ہمارے سوہو اسٹوڈیو سے رابطہ کریں:\n\n` +
        `📍 **پتہ:** 148 Mercer Street, Soho, New York, NY 10012\n` +
        `🕒 **اوقات:** منگل تا اتوار، 10:00 AM تا 6:30 PM\n` +
        `🌐 یا ہماری ویب سائٹ کے ذریعے پیغام بھیجیں۔`;
    }
    if (isRomanUrdu) {
      return `Maazrat, yeh exact information meray verified records mein nahi hai. Barah-e-karam hamaray Soho studio se direct rabta karein:\n\n` +
        `📍 **Address:** 148 Mercer Street, Soho, New York, NY 10012\n` +
        `🕒 **Timings:** Tuesday – Sunday, 10:00 AM – 6:30 PM\n` +
        `🌐 Ya website par Bespoke inquiry form submit karein.`;
    }
    return `I do not have that specific detail in our verified atelier records. Please visit or contact our Soho studio directly:\n\n` +
      `📍 **Location:** 148 Mercer Street, Soho, New York, NY 10012\n` +
      `🕒 **Hours:** Tuesday – Sunday, 10:00 AM – 6:30 PM\n` +
      `🌐 Or submit an inquiry via our **Bespoke Studio** page.`;
  }

  // Simple Markdown Parser for Assistant Bubbles
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(126,91,158,0.12); padding: 2px 6px; border-radius: 4px; font-size: 0.85em;">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n• /g, '<br>• ')
      .replace(/\n- /g, '<br>• ');
    return html;
  }

  // Auto-boot on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

})();
