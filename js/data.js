/**
 * MAISON SUCRE — INITIAL SEED DATA
 * High-End Artisanal Cake Studio Initial Catalogue & Reference Data
 * Stitch Theme: Pastel Cake Studio Website (Pastel Blush & Lilac Atelier)
 */

const INITIAL_CATEGORIES = [
  {
    id: 'cat-01',
    name: 'Signature Celebration',
    slug: 'signature-celebration',
    description: 'Sculptural masterpieces designed with organic botanicals, edible gold, and refined flavor profiles.',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
    display_order: 1
  },
  {
    id: 'cat-02',
    name: 'Wedding & Bridal Tiers',
    slug: 'wedding-bridal',
    description: 'Architectural multi-tiered cakes adorned with delicate wafer florals, silk ribbons, and subtle textures.',
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=85',
    display_order: 2
  },
  {
    id: 'cat-03',
    name: 'Vintage Lambeth & Florals',
    slug: 'vintage-lambeth',
    description: 'Intricate over-piped Victorian ruffles, maraschino cherries, and pastel royal icing artistry.',
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=85',
    display_order: 3
  },
  {
    id: 'cat-04',
    name: 'Petite Gâteaux & Treats',
    slug: 'petite-treats',
    description: 'Individual entremets, French macarons, and delicate miniature confections for intimate tea gatherings.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
    display_order: 4
  },
  {
    id: 'cat-05',
    name: 'Botanical & Seasonal',
    slug: 'botanical-seasonal',
    description: 'Infused with pressed wildflowers, hand-harvested lavender, citrus blossoms, and seasonal fruits.',
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=85',
    display_order: 5
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-01',
    category_id: 'cat-01',
    category_name: 'Signature Celebration',
    name: "L'Aurore Pistachio & Rose",
    slug: 'laurore-pistachio-rose',
    description: 'Delicate layers of Sicilian pistachio sponge soaked in Persian rosewater syrup, filled with house-made raspberry reduction and enveloped in light Swiss meringue buttercream with 24k edible gold leaf.',
    price: 125.00,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Floral Persian Rose, Roasted Bronte Pistachio, Tart Wild Raspberry',
    portion_guide: '6-inch • Serves 8-10',
    availability: 'In Stock',
    featured: true,
    dietary_tags: ['Vegetarian', 'Nut Free Option Available']
  },
  {
    id: 'prod-02',
    category_id: 'cat-01',
    category_name: 'Signature Celebration',
    name: 'Noir Velvet & Salted Caramel',
    slug: 'noir-velvet-salted-caramel',
    description: 'Rich 70% Valrhona dark chocolate crumb layered with slow-cooked Brittany salted butter caramel, crunchy cacao nib praline, and silky espresso ganache.',
    price: 115.00,
    image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Valrhona Dark Chocolate, Maldon Flaked Salt, Caramelized Sugar',
    portion_guide: '6-inch • Serves 8-10',
    availability: 'In Stock',
    featured: true,
    dietary_tags: ['Vegetarian']
  },
  {
    id: 'prod-03',
    category_id: 'cat-02',
    category_name: 'Wedding & Bridal Tiers',
    name: 'Symphonie Blanche Bridal Tier',
    slug: 'symphonie-blanche-bridal-tier',
    description: 'A breathtaking two-tiered sculptural cake featuring Tahitian vanilla bean chiffon, delicate elderflower curd, and fresh white peach compote, finished in ivory velvet texture and hand-crafted sugar peonies.',
    price: 280.00,
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Tahitian Vanilla Bean, St-Germain Elderflower, Ripe White Peach',
    portion_guide: '2-Tier • Serves 28-35',
    availability: 'Pre-Order Only',
    featured: true,
    dietary_tags: ['Vegetarian']
  },
  {
    id: 'prod-04',
    category_id: 'cat-03',
    category_name: 'Vintage Lambeth & Florals',
    name: 'Madame Pompadour Vintage Cake',
    slug: 'madame-pompadour-vintage-cake',
    description: 'An homage to traditional French rococo piping. Fluffy Earl Grey infused sponge layered with lavender blackberry preserves, draped in soft blush Lambeth ruffles and adorned with edible sugar pearls.',
    price: 135.00,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Bergamot Earl Grey, Wild Mountain Blackberry, French Lavender',
    portion_guide: '7-inch • Serves 12-14',
    availability: 'In Stock',
    featured: true,
    dietary_tags: ['Vegetarian']
  },
  {
    id: 'prod-05',
    category_id: 'cat-05',
    category_name: 'Botanical & Seasonal',
    name: 'Pressed Flora & Lemon Verbena',
    slug: 'pressed-flora-lemon-verbena',
    description: 'Zesty Amalfi lemon chiffon cake layered with fresh Meyer lemon curd, steeped lemon verbena crème diplomate, and decorated with organically grown edible pressed pansies and violas.',
    price: 120.00,
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Amalfi Lemon, Aromatic Verbena, Garden Edible Blooms',
    portion_guide: '6-inch • Serves 8-10',
    availability: 'In Stock',
    featured: false,
    dietary_tags: ['Vegetarian', 'Gluten Free Available']
  },
  {
    id: 'prod-06',
    category_id: 'cat-04',
    category_name: 'Petite Gâteaux & Treats',
    name: "Coffret d'Élégance Petite Box",
    slug: 'coffret-delegance-petite-box',
    description: 'A curated collection of six miniature gourmet cakes including ruby chocolate & passionfruit entremets, hazelnut Paris-Brest bites, and matcha jasmine tarts.',
    price: 68.00,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Assorted French Pastry: Praline, Passionfruit, Jasmine Tea',
    portion_guide: 'Box of 6 Individual Gâteaux',
    availability: 'In Stock',
    featured: false,
    dietary_tags: ['Vegetarian']
  },
  {
    id: 'prod-07',
    category_id: 'cat-01',
    category_name: 'Signature Celebration',
    name: 'Le Rêve Vanilla & Wild Strawberry',
    slug: 'le-reve-vanilla-wild-strawberry',
    description: 'Madagascar bourbon vanilla sponge infused with organic strawberry coulis, whipped white chocolate mousse, and crowned with fresh fraises des bois and chamomile blossoms.',
    price: 110.00,
    image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Bourbon Vanilla, Fraises des Bois, White Chocolate Mousse',
    portion_guide: '6-inch • Serves 8-10',
    availability: 'In Stock',
    featured: false,
    dietary_tags: ['Vegetarian']
  },
  {
    id: 'prod-08',
    category_id: 'cat-05',
    category_name: 'Botanical & Seasonal',
    name: 'Chai Fig & Spiced Honey Gateau',
    slug: 'chai-fig-spiced-honey-gateau',
    description: 'Brown butter spiced sponge layered with fresh black mission fig compote, wildflower honey buttercream, and garnished with toasted walnuts and fresh rosemary sprigs.',
    price: 130.00,
    image_url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Mission Fig, Wild Honey, Ceylon Chai Spices',
    portion_guide: '8-inch • Serves 14-16',
    availability: 'In Stock',
    featured: false,
    dietary_tags: ['Vegetarian']
  },
  {
    id: 'prod-09',
    category_id: 'cat-01',
    category_name: 'Signature Celebration',
    name: 'Atelier Lilac & Blackberry Chiffon',
    slug: 'atelier-lilac-blackberry-chiffon',
    description: 'Inspired by the Stitch Atelier Home palette. An ethereal lilac-hued vanilla chiffon layered with wild French blackberry reduction, lavender-infused whipped mascarpone, and edible silver & 24k gold leaf accents.',
    price: 135.00,
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Wild Mountain Blackberry, Lavender Mascarpone, Tahitian Vanilla',
    portion_guide: '7-inch • Serves 10-12',
    availability: 'In Stock',
    featured: true,
    dietary_tags: ['Vegetarian', 'Stitch Signature Edition']
  },
  {
    id: 'prod-10',
    category_id: 'cat-03',
    category_name: 'Vintage Lambeth & Florals',
    name: 'Blush Velvet & White Peach Lambeth',
    slug: 'blush-velvet-white-peach-lambeth',
    description: 'Exquisite Victorian Lambeth over-piped cake draped in velvety blush pink buttercream, filled with organic white peach compote and champagne diplomat cream, accented by handcrafted sugar lace.',
    price: 130.00,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85'
    ],
    tasting_notes: 'Blush Peach Compote, Champagne Diplomat, Sweet Butter Meringue',
    portion_guide: '6-inch • Serves 8-10',
    availability: 'In Stock',
    featured: true,
    dietary_tags: ['Vegetarian', 'Stitch Signature Edition']
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    order_number: 'MS-89210',
    customer_name: 'Camille Laurent',
    customer_phone: '+1 (555) 234-8901',
    customer_email: 'camille.laurent@example.com',
    fulfillment_type: 'Delivery',
    delivery_address: '742 Evergreen Terrace, Apt 4B, New York, NY 10021',
    preferred_date: '2026-10-04',
    preferred_time: '2:00 PM - 4:00 PM',
    special_notes: 'Please write "Joyeux Anniversaire Chloé" on the gold plaque.',
    subtotal: 135.00,
    delivery_fee: 25.00,
    tax: 10.80,
    total_amount: 170.80,
    payment_method: 'Cash on Delivery',
    status: 'Preparing',
    created_at: '2026-09-26T14:30:00Z',
    items: [
      {
        product_id: 'prod-09',
        product_name: 'Atelier Lilac & Blackberry Chiffon',
        product_image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=85',
        unit_price: 135.00,
        quantity: 1,
        size_selected: '7-inch (10-12 Servings)',
        custom_inscription: 'Joyeux Anniversaire Chloé',
        flavor_choice: 'Blackberry & Lavender Mascarpone',
        total_price: 135.00
      }
    ]
  },
  {
    id: 'ord-1002',
    order_number: 'MS-89211',
    customer_name: 'Julian Montgomery',
    customer_phone: '+1 (555) 876-5432',
    customer_email: 'j.montgomery@artgallery.org',
    fulfillment_type: 'Pickup',
    delivery_address: 'Studio Pickup: 148 Mercer St, Soho, NY',
    preferred_date: '2026-10-06',
    preferred_time: '11:00 AM - 1:00 PM',
    special_notes: 'Art gallery private opening reception.',
    subtotal: 280.00,
    delivery_fee: 0.00,
    tax: 22.40,
    total_amount: 302.40,
    payment_method: 'Cash on Pickup',
    status: 'Confirmed',
    created_at: '2026-09-27T09:15:00Z',
    items: [
      {
        product_id: 'prod-03',
        product_name: 'Symphonie Blanche Bridal Tier',
        product_image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=85',
        unit_price: 280.00,
        quantity: 1,
        size_selected: '2-Tier (28-35 Servings)',
        custom_inscription: 'Étoile Exhibition 2026',
        flavor_choice: 'Tahitian Vanilla & White Peach',
        total_price: 280.00
      }
    ]
  }
];

const INITIAL_CUSTOM_REQUESTS = [
  {
    id: 'req-201',
    request_number: 'CR-7412',
    customer_name: 'Eleanor Vance',
    customer_phone: '+1 (555) 902-1144',
    customer_email: 'eleanor.vance@studio.com',
    occasion: 'Wedding',
    guest_count: '80-100 guests',
    flavor_preference: 'Earl Grey Lavender bottom tier, Tahitian Vanilla Berry top tier',
    style_theme: 'Pastel Lilac & Blush Sculptural with Pressed Florals & Gold Leaf',
    event_date: '2026-11-14',
    budget_range: '$600 - $900',
    reference_image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=85',
    notes: 'Outdoor autumn botanical wedding in the Hudson Valley. Venue has chilled storage.',
    status: 'In Review',
    created_at: '2026-09-25T11:20:00Z'
  }
];

window.INITIAL_DATA = {
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
  custom_requests: INITIAL_CUSTOM_REQUESTS
};
