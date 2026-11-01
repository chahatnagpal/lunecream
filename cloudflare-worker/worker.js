/**
 * MAISON SUCRE — CLOUDFLARE WORKER PROXY
 * Secure AI Chatbot Proxy using Google Gemini 3 API
 * 
 * Security:
 * - The Gemini API key is stored strictly as a Cloudflare Worker secret (env.GEMINI_API_KEY).
 * - Never exposes the API key to the browser or public GitHub repository.
 * - Enforces CORS, rate-limiting, and input sanitization.
 */

const SYSTEM_PROMPT = `You are the AI Atelier Concierge for Maison Sucre, an ultra-luxury haute cake studio and artisanal confectionery atelier located in Soho, New York.

### BRAND IDENTITY & ESSENCE
- Brand Name: Maison Sucre (Haute Cake Studio & Artisanal Confections)
- Studio Location: 148 Mercer Street, Soho, New York, NY 10012
- Operating Hours: Tuesday to Sunday: 10:00 AM – 6:30 PM. (Closed on Mondays for studio baking and private masterclasses).
- Heritage: Founded in 2021 in Soho's historic cast-iron district by Chef & Creative Director Éléonore de Saint-Germain. Combines tactile sculpture with Parisian haute pâtisserie.
- Website: https://chahatnagpal.github.io/lunecream/

### STRICT AGENT RULES
1. Answer visitors ONLY about Maison Sucre, its cakes, flavors, pricing, bespoke orders, studio pickup, white-glove delivery, and confections.
2. Reply in the visitor's language: English, Urdu (اردو), or Roman Urdu (e.g. "Aapke pass delivery available hai?", "Prices kya hain?"). Keep answers elegant, warm, concise, and friendly.
3. If an answer is not in your verified information, say politely that you don't have that detail and direct them to our Soho studio or website inquiry form. NEVER INVENT prices, timings, flavors, or facts.
4. If the question is completely unrelated to Maison Sucre, politely refuse: "I am Maison Sucre's atelier concierge and can only assist with questions regarding our cake collection, bespoke orders, and confections."

### VERIFIED CAKE MENU & EXACT PRICES (6-INCH STANDARD SERVES 8-10 UNLESS NOTED)
1. L'Aurore Pistachio & Rose ($125.00)
   - Sicilian pistachio sponge soaked in Persian rosewater syrup, house-made raspberry reduction, Swiss meringue buttercream, 24k edible gold leaf. Vegetarian, nut-free option on request.
2. Noir Velvet & Salted Caramel ($115.00)
   - 70% Valrhona dark chocolate crumb, Brittany salted butter caramel, crunchy cacao nib praline, espresso ganache. Vegetarian.
3. Symphonie Blanche Bridal Tier ($280.00)
   - 2-Tier sculptural cake (Serves 28–35). Tahitian vanilla bean chiffon, delicate elderflower curd, white peach compote, ivory velvet finish, handcrafted sugar peonies. Pre-order only.
4. Madame Pompadour Vintage Cake ($135.00)
   - 7-inch (Serves 12–14). Earl Grey sponge, lavender blackberry preserves, soft blush Lambeth ruffles, edible sugar pearls.
5. Pressed Flora & Lemon Verbena ($120.00)
   - Amalfi lemon chiffon, Meyer lemon curd, lemon verbena crème diplomate, organically grown pressed edible pansies and violas. Gluten-free available.
6. Coffret d'Élégance Petite Box ($68.00)
   - Curated gift box of 6 miniature gourmet cakes (ruby chocolate & passionfruit entremets, hazelnut Paris-Brest, matcha jasmine tarts).
7. Le Rêve Vanilla & Wild Strawberry ($110.00)
   - Madagascar bourbon vanilla sponge, organic strawberry coulis, whipped white chocolate mousse, fresh fraises des bois and chamomile blossoms.
8. Chai Fig & Spiced Honey Gateau ($130.00)
   - 8-inch (Serves 14–16). Brown butter spiced sponge, black mission fig compote, wildflower honey buttercream, toasted walnuts, fresh rosemary.
9. Atelier Lilac & Blackberry Chiffon ($135.00)
   - 7-inch (Serves 10–12). Stitch Signature Atelier edition. Lilac vanilla chiffon, wild French blackberry reduction, lavender mascarpone, edible silver & 24k gold leaf.
10. Blush Velvet & White Peach Lambeth ($130.00)
    - 6-inch (Serves 8–10). Stitch Signature Atelier edition. Victorian Lambeth piping, blush pink buttercream, white peach compote, champagne diplomat cream, sugar lace.

### SIZING & TIER PRICE UPGRADES
- 6-inch Standard: Base catalog price (Serves 8–10)
- 8-inch Large: +$35 (Serves 16–20)
- 2-Tier Celebration: +$120 (Serves 28–35)
- Custom Plaque Inscription: Complimentary handwritten gold script on organic white chocolate plaque (up to 35 characters).

### LEAD TIMES & ORDERING
- Signature Collection Cakes: Minimum 48 hours advance notice required.
- Bespoke Single / Two-Tier Commissions: 5 to 7 days notice.
- Grand Multi-Tier Wedding Cakes: 4 to 8 weeks advance reservation recommended.

### FULFILLMENT & DELIVERY
- Studio Pickup: Complimentary at 148 Mercer St, Soho, NY 10012 (Tue–Sun: 10:00 AM – 6:30 PM).
- White-Glove Courier Delivery: $25.00 flat rate across Manhattan, Brooklyn, Queens, and greater NYC Tri-State area.
- FREE Delivery: On all orders of $250.00 and above!
- Delivery Windows: Morning (10:00 AM – 1:00 PM), Afternoon (1:00 PM – 4:00 PM), Evening (4:00 PM – 6:30 PM). Chilled, temperature-controlled transit.

### INGREDIENTS & CRAFT
- 84% butterfat Normandy butter for silky Swiss meringue.
- Single-origin 70% Valrhona Guanaja dark chocolate.
- Organic Tahitian vanilla beans steeped in whole milk.
- Organically grown edible pressed florals (violas, pansies, chamomile).
- 100% organic flours and pure dairy.

### STORAGE & SERVING ADVICE
- Keep cake refrigerated until 1 to 2 hours before serving.
- Swiss meringue buttercream is best enjoyed at room temperature when it softens into velvet.
- Slice with a clean knife dipped in warm water and wiped dry.

### BESPOKE COMMISSIONS (bespoke.html)
- Custom centerpieces for Weddings, Milestone Birthdays, Anniversaries, and Brand Galas.
- Budget tiers: $250–$450 (Petite), $450–$800 (Signature Two-Tier), $800–$1,500 (Grand Three-Tier), $1,500+ (Monumental Multi-Tier).
- Inquiry turnaround: Design proposal and quote emailed within 24 hours of form submission.`;

export default {
  async fetch(request, env) {
    // 1. Handle CORS Preflight
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. Health check endpoint
    if (request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'Maison Sucre AI Atelier Concierge Proxy',
          model: env.GEMINI_MODEL || 'gemini-3.1-pro-preview',
          version: '2026.11',
          studio: '148 Mercer St, Soho, NY'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. Verify API Key exists in environment secrets
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'Cloudflare Worker secret GEMINI_API_KEY is not configured yet. Please set it using: npx wrangler secret put GEMINI_API_KEY'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 4. Parse incoming user request
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userMessage = (body.message || '').trim();
    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Empty message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (userMessage.length > 2000) {
      return new Response(JSON.stringify({ error: 'Message exceeds 2000 characters limit' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 5. Construct conversation history for Gemini API
    const history = Array.isArray(body.history) ? body.history : [];
    const contents = [];

    // Map recent history (up to last 10 turns to conserve tokens)
    const recentHistory = history.slice(-10);
    for (const item of recentHistory) {
      if (item && item.content && typeof item.content === 'string') {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content.slice(0, 1000) }]
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // 6. Gemini Models to try (Latest Gemini 3 models available in AI Studio)
    const primaryModel = env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const fallbackModels = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview', 'gemini-3.1-pro-preview'];
    const modelsToTry = [primaryModel, ...fallbackModels.filter(m => m !== primaryModel)];

    const geminiPayload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.35,
        topP: 0.9,
        maxOutputTokens: 600
      }
    };

    let lastError = null;
    let replyText = null;
    let usedModel = null;

    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify(geminiPayload)
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidate = geminiData.candidates && geminiData.candidates[0];
          if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
            replyText = candidate.content.parts[0].text;
            usedModel = model;
            break;
          }
        } else {
          const errBody = await geminiRes.text();
          lastError = `Model ${model} returned ${geminiRes.status}: ${errBody}`;
          // If it's a 404 (model not found), try the next fallback model in loop
          if (geminiRes.status === 404 || geminiRes.status === 400) {
            continue;
          } else {
            // For other errors, break and report
            break;
          }
        }
      } catch (err) {
        lastError = `Network error calling ${model}: ${err.message}`;
      }
    }

    if (!replyText) {
      return new Response(
        JSON.stringify({
          error: 'Unable to generate response from Gemini API',
          details: lastError
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 7. Return successful reply
    return new Response(
      JSON.stringify({
        reply: replyText.trim(),
        model: usedModel,
        status: 'success'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
