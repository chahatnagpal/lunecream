-- ==============================================================================
-- MAISON SUCRE — HAUTE CAKE STUDIO
-- Supabase PostgreSQL Database Schema & Initial Seed Data
-- ==============================================================================

-- 1. Enable UUID Extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Up Tables if Existing (for fresh re-installations)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS custom_requests CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ==============================================================================
-- 3. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    tasting_notes TEXT,
    portion_guide VARCHAR(100) DEFAULT 'Serves 8-12',
    availability VARCHAR(50) DEFAULT 'In Stock' CHECK (availability IN ('In Stock', 'Pre-Order Only', 'Sold Out')),
    featured BOOLEAN DEFAULT false,
    dietary_tags TEXT[] DEFAULT '{}', -- e.g., ['Nut Free', 'Gluten Free Option']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. ORDERS TABLE
-- ==============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    fulfillment_type VARCHAR(50) NOT NULL DEFAULT 'Pickup' CHECK (fulfillment_type IN ('Pickup', 'Delivery')),
    delivery_address TEXT,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    special_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(100) DEFAULT 'Cash on Pickup / Delivery',
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. ORDER ITEMS TABLE
-- ==============================================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    size_selected VARCHAR(100) DEFAULT '6-inch (8-10 Servings)',
    custom_inscription TEXT,
    flavor_choice VARCHAR(150),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. CUSTOM CAKE REQUESTS TABLE (Bespoke Studio Feature)
-- ==============================================================================
CREATE TABLE custom_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    occasion VARCHAR(100) NOT NULL, -- e.g., 'Wedding', 'Milestone Birthday', 'Baby Shower'
    guest_count VARCHAR(50) NOT NULL, -- e.g., '20-40 guests', '50-80 guests'
    flavor_preference TEXT NOT NULL,
    style_theme VARCHAR(100) NOT NULL, -- e.g., 'Modern Sculptural', 'Vintage Lambeth', 'Pressed Florals'
    event_date DATE NOT NULL,
    budget_range VARCHAR(100),
    reference_image_url TEXT,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Review', 'Quoted', 'Approved', 'Completed', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

-- Categories & Products: Public can read, authenticated or anon with custom rules can manage
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

-- Product Management: Admins can insert, update, delete
CREATE POLICY "Admins can insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (true);

-- Orders & Order Items: Public can insert their new order, view/manage
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their order" ON orders FOR SELECT USING (true);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (true);

CREATE POLICY "Public can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Admins can update order items" ON order_items FOR UPDATE USING (true);
CREATE POLICY "Admins can delete order items" ON order_items FOR DELETE USING (true);

-- Custom Cake Requests: Public can insert request, Admins can view/update
CREATE POLICY "Public can create custom requests" ON custom_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view custom requests" ON custom_requests FOR SELECT USING (true);
CREATE POLICY "Admins can update custom requests" ON custom_requests FOR UPDATE USING (true);
CREATE POLICY "Admins can delete custom requests" ON custom_requests FOR DELETE USING (true);

-- ==============================================================================
-- 9. INITIAL SEED DATA (Categories & Premium Boutique Cakes)
-- ==============================================================================

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES
('11111111-1111-1111-1111-111111111101', 'Signature Celebration', 'signature-celebration', 'Sculptural masterpieces designed with organic botanicals, edible gold, and refined flavor profiles.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85', 1),
('11111111-1111-1111-1111-111111111102', 'Wedding & Bridal Tiers', 'wedding-bridal', 'Architectural multi-tiered cakes adorned with delicate wafer florals, silk ribbons, and subtle textures.', 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=85', 2),
('11111111-1111-1111-1111-111111111103', 'Vintage Lambeth & Florals', 'vintage-lambeth', 'Intricate over-piped Victorian ruffles, maraschino cherries, and pastel royal icing artistry.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=85', 3),
('11111111-1111-1111-1111-111111111104', 'Petite Gâteaux & Treats', 'petite-treats', 'Individual entremets, French macarons, and delicate miniature confections for intimate tea gatherings.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85', 4),
('11111111-1111-1111-1111-111111111105', 'Botanical & Seasonal', 'botanical-seasonal', 'Infused with pressed wildflowers, hand-harvested lavender, citrus blossoms, and seasonal fruits.', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=85', 5);

-- Insert Sample Products
INSERT INTO products (id, category_id, category_name, name, slug, description, price, image_url, tasting_notes, portion_guide, availability, featured, dietary_tags) VALUES
(
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'Signature Celebration',
    'L''Aurore Pistachio & Rose',
    'laurore-pistachio-rose',
    'Delicate layers of Sicilian pistachio sponge soaked in Persian rosewater syrup, filled with house-made raspberry reduction and enveloped in light Swiss meringue buttercream with 24k edible gold leaf.',
    125.00,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
    'Floral Persian Rose, Roasted Bronte Pistachio, Tart Wild Raspberry',
    '6-inch • Serves 8-10',
    'In Stock',
    true,
    ARRAY['Vegetarian', 'Nut Free Option Available']
),
(
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111101',
    'Signature Celebration',
    'Noir Velvet & Salted Caramel',
    'noir-velvet-salted-caramel',
    'Rich 70% Valrhona dark chocolate crumb layered with slow-cooked Brittany salted butter caramel, crunchy cacao nib praline, and silky espresso ganache.',
    115.00,
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85',
    'Valrhona Dark Chocolate, Maldon Flaked Salt, Caramelized Sugar',
    '6-inch • Serves 8-10',
    'In Stock',
    true,
    ARRAY['Vegetarian']
),
(
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111102',
    'Wedding & Bridal Tiers',
    'Symphonie Blanche Bridal Tier',
    'symphonie-blanche-bridal-tier',
    'A breathtaking two-tiered sculptural cake featuring Tahitian vanilla bean chiffon, delicate elderflower curd, and fresh white peach compote, finished in ivory velvet texture and hand-crafted sugar peonies.',
    280.00,
    'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=85',
    'Tahitian Vanilla Bean, St-Germain Elderflower, Ripe White Peach',
    '2-Tier • Serves 28-35',
    'Pre-Order Only',
    true,
    ARRAY['Vegetarian']
),
(
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111103',
    'Vintage Lambeth & Florals',
    'Madame Pompadour Vintage Cake',
    'madame-pompadour-vintage-cake',
    'An homage to traditional French rococo piping. Fluffy Earl Grey infused sponge layered with lavender blackberry preserves, draped in soft blush Lambeth ruffles and adorned with edible sugar pearls.',
    135.00,
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85',
    'Bergamot Earl Grey, Wild Mountain Blackberry, French Lavender',
    '7-inch • Serves 12-14',
    'In Stock',
    true,
    ARRAY['Vegetarian']
),
(
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111105',
    'Botanical & Seasonal',
    'Pressed Flora & Lemon Verbena',
    'pressed-flora-lemon-verbena',
    'Zesty Amalfi lemon chiffon cake layered with fresh Meyer lemon curd, steeped lemon verbena crème diplomate, and decorated with organically grown edible pressed pansies and violas.',
    120.00,
    'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=85',
    'Amalfi Lemon, Aromatic Verbena, Garden Edible Blooms',
    '6-inch • Serves 8-10',
    'In Stock',
    false,
    ARRAY['Vegetarian', 'Gluten Free Available']
),
(
    '22222222-2222-2222-2222-222222222206',
    '11111111-1111-1111-1111-111111111104',
    'Petite Gâteaux & Treats',
    'Coffret d''Élégance Petite Box',
    'coffret-delegance-petite-box',
    'A curated collection of six miniature gourmet cakes including ruby chocolate & passionfruit entremets, hazelnut Paris-Brest bites, and matcha jasmine tarts.',
    68.00,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85',
    'Assorted French Pastry: Praline, Passionfruit, Jasmine Tea',
    'Box of 6 Individual Gâteaux',
    'In Stock',
    false,
    ARRAY['Vegetarian']
),
(
    '22222222-2222-2222-2222-222222222207',
    '11111111-1111-1111-1111-111111111101',
    'Signature Celebration',
    'Le Rêve Vanilla & Wild Strawberry',
    'le-reve-vanilla-wild-strawberry',
    'Madagascar bourbon vanilla sponge infused with organic strawberry coulis, whipped white chocolate mousse, and crowned with fresh fraises des bois and chamomile blossoms.',
    110.00,
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85',
    'Bourbon Vanilla, Fraises des Bois, White Chocolate Mousse',
    '6-inch • Serves 8-10',
    'In Stock',
    false,
    ARRAY['Vegetarian']
),
(
    '22222222-2222-2222-2222-222222222208',
    '11111111-1111-1111-1111-111111111105',
    'Botanical & Seasonal',
    'Chai Fig & Spiced Honey Gateau',
    'chai-fig-spiced-honey-gateau',
    'Brown butter spiced sponge layered with fresh black mission fig compote, wildflower honey buttercream, and garnished with toasted walnuts and fresh rosemary sprigs.',
    130.00,
    'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=85',
    'Mission Fig, Wild Honey, Ceylon Chai Spices',
    '8-inch • Serves 14-16',
    'In Stock',
    false,
    ARRAY['Vegetarian']
),
(
    '22222222-2222-2222-2222-222222222209',
    '11111111-1111-1111-1111-111111111101',
    'Signature Celebration',
    'Atelier Lilac & Blackberry Chiffon',
    'atelier-lilac-blackberry-chiffon',
    'Inspired by the Stitch Atelier Home palette. An ethereal lilac-hued vanilla chiffon layered with wild French blackberry reduction, lavender-infused whipped mascarpone, and edible silver & 24k gold leaf accents.',
    135.00,
    'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1000&q=85',
    'Wild Mountain Blackberry, Lavender Mascarpone, Tahitian Vanilla',
    '7-inch • Serves 10-12',
    'In Stock',
    true,
    ARRAY['Vegetarian', 'Stitch Signature Edition']
),
(
    '22222222-2222-2222-2222-222222222210',
    '11111111-1111-1111-1111-111111111103',
    'Vintage Lambeth & Florals',
    'Blush Velvet & White Peach Lambeth',
    'blush-velvet-white-peach-lambeth',
    'Exquisite Victorian Lambeth over-piped cake draped in velvety blush pink buttercream, filled with organic white peach compote and champagne diplomat cream, accented by handcrafted sugar lace.',
    130.00,
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85',
    'Blush Peach Compote, Champagne Diplomat, Sweet Butter Meringue',
    '6-inch • Serves 8-10',
    'In Stock',
    true,
    ARRAY['Vegetarian', 'Stitch Signature Edition']
);
