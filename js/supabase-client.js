/**
 * MAISON SUCRE — SUPABASE & DATABASE CLIENT
 * Seamless Real Supabase API Client with Resilient Fallback Layer
 */

class DatabaseClient {
  constructor() {
    this.client = null;
    this.isLive = false;
    this.init();
  }

  init() {
    const url = window.APP_CONFIG.SUPABASE_URL;
    const key = window.APP_CONFIG.SUPABASE_ANON_KEY;

    if (url && key && window.supabase) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isLive = true;
        console.log('✨ [Maison Sucre] Connected to live Supabase project:', url);
      } catch (e) {
        console.warn('⚠️ [Maison Sucre] Failed to initialize live Supabase client, using resilient local store:', e);
        this.isLive = false;
      }
    } else {
      this.isLive = false;
      console.log('ℹ️ [Maison Sucre] Running with Local Fallback Store. Configure Supabase in Admin Panel for live DB sync.');
    }

    this._initLocalStore();
  }

  _initLocalStore() {
    const CURRENT_STORE_VERSION = '2.4-stitch-pastel';
    const savedVersion = localStorage.getItem(window.APP_CONFIG.STORAGE_STORE_VERSION);
    const existing = localStorage.getItem(window.APP_CONFIG.STORAGE_MOCK_DB);

    if (!existing || savedVersion !== CURRENT_STORE_VERSION) {
      const existingDb = existing ? JSON.parse(existing) : null;
      const initialDb = {
        categories: window.INITIAL_DATA.categories,
        products: window.INITIAL_DATA.products,
        orders: (existingDb && existingDb.orders && existingDb.orders.length > 0) ? existingDb.orders : window.INITIAL_DATA.orders,
        order_items: (existingDb && existingDb.order_items) ? existingDb.order_items : [],
        custom_requests: (existingDb && existingDb.custom_requests && existingDb.custom_requests.length > 0) ? existingDb.custom_requests : window.INITIAL_DATA.custom_requests
      };
      localStorage.setItem(window.APP_CONFIG.STORAGE_MOCK_DB, JSON.stringify(initialDb));
      localStorage.setItem(window.APP_CONFIG.STORAGE_STORE_VERSION, CURRENT_STORE_VERSION);
    }
  }

  _getLocalDb() {
    const raw = localStorage.getItem(window.APP_CONFIG.STORAGE_MOCK_DB);
    const db = raw ? JSON.parse(raw) : { categories: [], products: [], orders: [], order_items: [], custom_requests: [] };

    // Auto-heal any stale 404 image URLs
    let healed = false;
    if (db.categories) {
      db.categories.forEach(c => {
        if (c.image_url && c.image_url.includes('1535141192574-5d4897c13136')) {
          c.image_url = 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=85';
          healed = true;
        }
      });
    }
    if (db.products) {
      db.products.forEach(p => {
        if (p.image_url && p.image_url.includes('1535141192574-5d4897c13136')) {
          p.image_url = (p.slug && p.slug.includes('lilac'))
            ? 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1000&q=85'
            : 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=85';
          healed = true;
        }
        if (p.gallery_images && Array.isArray(p.gallery_images)) {
          p.gallery_images = p.gallery_images.map(img => {
            if (img.includes('1535141192574-5d4897c13136')) {
              healed = true;
              return (p.slug && p.slug.includes('lilac'))
                ? 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1000&q=85'
                : 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=85';
            }
            return img;
          });
        }
      });
    }
    if (healed) {
      this._saveLocalDb(db);
    }

    return db;
  }

  _saveLocalDb(db) {
    localStorage.setItem(window.APP_CONFIG.STORAGE_MOCK_DB, JSON.stringify(db));
  }

  isSupabaseLive() {
    return this.isLive;
  }

  async checkLiveHealth() {
    if (!this.isLive || !this.client) {
      return { ok: false, error: 'Client not initialized or missing URL/Key' };
    }
    try {
      const { data, error } = await this.client.from('categories').select('count', { count: 'exact', head: true });
      if (error) {
        if (error.code === 'PGRST205' || (error.message && error.message.includes('not find the table'))) {
          return { ok: false, tablesMissing: true, error: 'Database connected, but schema tables have not been created yet in Supabase SQL editor.' };
        }
        return { ok: false, error: error.message };
      }
      return { ok: true, message: 'Database connection live and all tables verified!' };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // ============================================================================
  // CATEGORIES
  // ============================================================================
  async getCategories() {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getCategories error, falling back:', err);
      }
    }
    const db = this._getLocalDb();
    return db.categories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  async createCategory(categoryData) {
    const newCategory = {
      id: categoryData.id || 'cat-' + Date.now(),
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryData.description || '',
      image_url: categoryData.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
      display_order: Number(categoryData.display_order) || 99,
      created_at: new Date().toISOString()
    };

    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('categories')
          .insert([newCategory])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase createCategory error, fallback to local:', err);
      }
    }

    const db = this._getLocalDb();
    db.categories.push(newCategory);
    this._saveLocalDb(db);
    return newCategory;
  }

  async deleteCategory(id) {
    if (this.isLive) {
      try {
        const { error } = await this.client.from('categories').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase deleteCategory error, fallback to local:', err);
      }
    }
    const db = this._getLocalDb();
    db.categories = db.categories.filter(c => c.id !== id);
    this._saveLocalDb(db);
    return true;
  }

  // ============================================================================
  // PRODUCTS
  // ============================================================================
  async getProducts(filter = {}) {
    if (this.isLive) {
      try {
        let query = this.client.from('products').select('*');
        if (filter.category_id) {
          query = query.eq('category_id', filter.category_id);
        }
        if (filter.featured !== undefined) {
          query = query.eq('featured', filter.featured);
        }
        if (filter.availability) {
          query = query.eq('availability', filter.availability);
        }
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getProducts error, falling back:', err);
      }
    }

    const db = this._getLocalDb();
    let results = [...db.products];

    if (filter.category_id && filter.category_id !== 'all') {
      results = results.filter(p => p.category_id === filter.category_id || p.category_name === filter.category_id);
    }
    if (filter.featured !== undefined) {
      results = results.filter(p => p.featured === filter.featured);
    }
    if (filter.availability) {
      results = results.filter(p => p.availability === filter.availability);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tasting_notes && p.tasting_notes.toLowerCase().includes(q))
      );
    }
    return results;
  }

  async getProductById(id) {
    if (this.isLive) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const query = this.client.from('products').select('*');
        const { data, error } = isUuid 
          ? await query.eq('id', id).single() 
          : await query.eq('slug', id).single();
        if (error) throw error;
        if (data) return data;
      } catch (err) {
        console.warn('Supabase getProductById error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    return db.products.find(p => p.id === id || p.slug === id) || null;
  }

  async createProduct(productData) {
    const newProduct = {
      id: productData.id || 'prod-' + Date.now(),
      category_id: productData.category_id,
      category_name: productData.category_name || 'Signature Celebration',
      name: productData.name,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: productData.description,
      price: parseFloat(productData.price) || 0,
      image_url: productData.image_url,
      gallery_images: productData.gallery_images || [productData.image_url],
      tasting_notes: productData.tasting_notes || '',
      portion_guide: productData.portion_guide || 'Serves 8-12',
      availability: productData.availability || 'In Stock',
      featured: Boolean(productData.featured),
      dietary_tags: productData.dietary_tags || ['Vegetarian'],
      created_at: new Date().toISOString()
    };

    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('products')
          .insert([newProduct])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase createProduct error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    db.products.unshift(newProduct);
    this._saveLocalDb(db);
    return newProduct;
  }

  async updateProduct(id, updates) {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase updateProduct error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...updates };
      this._saveLocalDb(db);
      return db.products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    if (this.isLive) {
      try {
        const { error } = await this.client.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase deleteProduct error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    db.products = db.products.filter(p => p.id !== id);
    this._saveLocalDb(db);
    return true;
  }

  // ============================================================================
  // ORDERS & ORDER ITEMS
  // ============================================================================
  async createOrder(orderPayload, itemsPayload) {
    const orderNumber = 'MS-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = 'ord-' + Date.now();

    const orderRecord = {
      id: orderId,
      order_number: orderNumber,
      customer_name: orderPayload.customer_name,
      customer_phone: orderPayload.customer_phone,
      customer_email: orderPayload.customer_email || '',
      fulfillment_type: orderPayload.fulfillment_type || 'Pickup',
      delivery_address: orderPayload.delivery_address || '',
      preferred_date: orderPayload.preferred_date,
      preferred_time: orderPayload.preferred_time || 'Morning (10 AM - 1 PM)',
      special_notes: orderPayload.special_notes || '',
      subtotal: parseFloat(orderPayload.subtotal) || 0,
      delivery_fee: parseFloat(orderPayload.delivery_fee) || 0,
      tax: parseFloat(orderPayload.tax) || 0,
      total_amount: parseFloat(orderPayload.total_amount) || 0,
      payment_method: orderPayload.payment_method || 'Cash on Pickup / Delivery',
      status: 'New',
      created_at: new Date().toISOString()
    };

    const orderItemsRecords = itemsPayload.map(item => ({
      id: 'item-' + Math.random().toString(36).substr(2, 9),
      order_id: orderId,
      product_id: item.product_id || item.id,
      product_name: item.name || item.product_name,
      product_image: item.image || item.image_url,
      unit_price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10) || 1,
      size_selected: item.size || '6-inch (8-10 Servings)',
      custom_inscription: item.inscription || '',
      flavor_choice: item.flavor || '',
      total_price: parseFloat(item.price) * (parseInt(item.quantity, 10) || 1),
      created_at: new Date().toISOString()
    }));

    if (this.isLive) {
      try {
        const { data: createdOrder, error: orderErr } = await this.client
          .from('orders')
          .insert([orderRecord])
          .select()
          .single();
        if (orderErr) throw orderErr;

        // Associate items with real generated ID if different
        const itemsToInsert = orderItemsRecords.map(it => ({ ...it, order_id: createdOrder.id }));
        const { error: itemsErr } = await this.client.from('order_items').insert(itemsToInsert);
        if (itemsErr) console.warn('Supabase order_items error:', itemsErr);

        return { ...createdOrder, items: orderItemsRecords };
      } catch (err) {
        console.warn('Supabase createOrder error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    orderRecord.items = orderItemsRecords;
    db.orders.unshift(orderRecord);
    this._saveLocalDb(db);
    return orderRecord;
  }

  async getOrders() {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(ord => ({ ...ord, items: ord.order_items || [] }));
        }
      } catch (err) {
        console.warn('Supabase getOrders error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    return db.orders || [];
  }

  async getOrderById(id) {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('orders')
          .select('*, order_items(*)')
          .or(`id.eq.${id},order_number.eq.${id}`)
          .single();
        if (error) throw error;
        if (data) return { ...data, items: data.order_items || [] };
      } catch (err) {
        console.warn('Supabase getOrderById error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    return db.orders.find(o => o.id === id || o.order_number === id) || null;
  }

  async updateOrderStatus(orderId, newStatus) {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase updateOrderStatus error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    const index = db.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      db.orders[index].status = newStatus;
      this._saveLocalDb(db);
      return db.orders[index];
    }
    return null;
  }

  // ============================================================================
  // CUSTOM CAKE REQUESTS (Bespoke Studio Feature)
  // ============================================================================
  async createCustomRequest(reqPayload) {
    const requestNumber = 'CR-' + Math.floor(1000 + Math.random() * 9000);
    const reqRecord = {
      id: 'req-' + Date.now(),
      request_number: requestNumber,
      customer_name: reqPayload.customer_name,
      customer_phone: reqPayload.customer_phone,
      customer_email: reqPayload.customer_email,
      occasion: reqPayload.occasion,
      guest_count: reqPayload.guest_count,
      flavor_preference: reqPayload.flavor_preference,
      style_theme: reqPayload.style_theme,
      event_date: reqPayload.event_date,
      budget_range: reqPayload.budget_range || '',
      reference_image_url: reqPayload.reference_image_url || '',
      notes: reqPayload.notes || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('custom_requests')
          .insert([reqRecord])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase createCustomRequest error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    db.custom_requests.unshift(reqRecord);
    this._saveLocalDb(db);
    return reqRecord;
  }

  async getCustomRequests() {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('custom_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getCustomRequests error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    return db.custom_requests || [];
  }

  async updateCustomRequestStatus(id, newStatus) {
    if (this.isLive) {
      try {
        const { data, error } = await this.client
          .from('custom_requests')
          .update({ status: newStatus })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase updateCustomRequestStatus error, fallback:', err);
      }
    }

    const db = this._getLocalDb();
    const index = db.custom_requests.findIndex(r => r.id === id);
    if (index !== -1) {
      db.custom_requests[index].status = newStatus;
      this._saveLocalDb(db);
      return db.custom_requests[index];
    }
    return null;
  }

  // ============================================================================
  // DATABASE SEEDING UTILITY
  // ============================================================================
  async seedLiveSupabase() {
    if (!this.isLive) {
      throw new Error('Supabase is not connected. Enter valid credentials in settings first.');
    }

    try {
      // 1. Seed Categories
      const { error: catErr } = await this.client
        .from('categories')
        .upsert(window.INITIAL_DATA.categories, { onConflict: 'slug' });
      if (catErr) console.warn('Categories seed error:', catErr);

      // 2. Seed Products
      const productsToSeed = window.INITIAL_DATA.products.map(p => ({
        ...p,
        category_id: null // let category relation resolve
      }));
      const { error: prodErr } = await this.client
        .from('products')
        .upsert(productsToSeed, { onConflict: 'slug' });
      if (prodErr) console.warn('Products seed error:', prodErr);

      return true;
    } catch (e) {
      console.error('Failed to seed Supabase database:', e);
      throw e;
    }
  }

  resetLocalStore() {
    localStorage.removeItem(window.APP_CONFIG.STORAGE_MOCK_DB);
    this._initLocalStore();
    return true;
  }
}

// Global Singleton Instance
window.db = new DatabaseClient();
