/**
 * MAISON SUCRE — ADMIN PANEL CONTROLLER
 * Protected Dashboard, Product CRUD, Categories, Orders & Status Management
 */

class AdminController {
  constructor() {
    this.isAuthenticated = false;
    this.currentTab = 'overview';
    this.editingProductId = null;
    this.init();
  }

  init() {
    this.checkSession();
    this.setupAuthListeners();
    this.setupNavigation();
    this.setupProductForm();
    this.setupCategoryForm();
    this.setupSettings();
  }

  // ============================================================================
  // AUTHENTICATION & ACCESS PROTECTION
  // ============================================================================
  checkSession() {
    const session = sessionStorage.getItem(window.APP_CONFIG.STORAGE_ADMIN_SESSION);
    if (session === 'authenticated') {
      this.isAuthenticated = true;
      this.showDashboard();
    } else {
      this.isAuthenticated = false;
      this.showLogin();
    }
  }

  setupAuthListeners() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passkeyInput = document.getElementById('admin-passkey-input');
        const passkey = passkeyInput?.value.trim();

        if (passkey === window.APP_CONFIG.ADMIN_PASSKEY) {
          sessionStorage.setItem(window.APP_CONFIG.STORAGE_ADMIN_SESSION, 'authenticated');
          this.isAuthenticated = true;
          window.UI.showToast('Welcome to Maison Sucre Admin Studio.', 'success');
          this.showDashboard();
        } else {
          window.UI.showToast('Invalid admin passkey. Please try again.', 'error');
          if (passkeyInput) passkeyInput.value = '';
        }
      });
    }

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(window.APP_CONFIG.STORAGE_ADMIN_SESSION);
        this.isAuthenticated = false;
        window.UI.showToast('Logged out of admin dashboard.');
        this.showLogin();
      });
    }
  }

  showLogin() {
    document.getElementById('admin-login-view')?.style.setProperty('display', 'flex');
    document.getElementById('admin-dashboard-view')?.style.setProperty('display', 'none');
  }

  showDashboard() {
    document.getElementById('admin-login-view')?.style.setProperty('display', 'none');
    document.getElementById('admin-dashboard-view')?.style.setProperty('display', 'flex');
    this.updateConnectionBadge();
    this.checkHealth();
    this.loadAllData();
  }

  updateConnectionBadge() {
    const badge = document.getElementById('admin-db-status-badge');
    if (!badge) return;

    if (window.db.isSupabaseLive()) {
      badge.className = 'connection-badge connected';
      badge.innerHTML = '<span class="dot"></span> Live Supabase Connected';
    } else {
      badge.className = 'connection-badge mock';
      badge.innerHTML = '<span class="dot"></span> Local Studio Mode';
    }
  }

  // ============================================================================
  // TAB NAVIGATION & ROUTING
  // ============================================================================
  setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const tab = item.getAttribute('data-tab');
        this.currentTab = tab;

        document.querySelectorAll('.admin-tab-content').forEach(section => {
          section.style.display = 'none';
        });

        const activeSection = document.getElementById(`tab-${tab}`);
        if (activeSection) activeSection.style.display = 'block';

        // Refresh tab data
        if (tab === 'overview') this.renderMetrics();
        if (tab === 'orders') this.renderOrdersTable();
        if (tab === 'products') this.renderProductsTable();
        if (tab === 'categories') this.renderCategoriesTable();
        if (tab === 'custom-requests') this.renderCustomRequestsTable();
      });
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  async loadAllData() {
    await this.renderMetrics();
    await this.renderOrdersTable();
    await this.renderProductsTable();
    await this.renderCategoriesTable();
    await this.renderCustomRequestsTable();
    this.populateCategorySelects();
  }

  // ============================================================================
  // METRICS & OVERVIEW
  // ============================================================================
  async renderMetrics() {
    try {
      const orders = await window.db.getOrders();
      const products = await window.db.getProducts();
      const customRequests = await window.db.getCustomRequests();

      const totalRevenue = orders.reduce((sum, ord) => sum + (parseFloat(ord.total_amount) || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'Preparing').length;
      const newCustomRequests = customRequests.filter(r => r.status === 'New' || r.status === 'In Review').length;

      document.getElementById('metric-total-revenue').textContent = window.UI.formatCurrency(totalRevenue);
      document.getElementById('metric-total-orders').textContent = orders.length;
      document.getElementById('metric-pending-orders').textContent = pendingOrders;
      document.getElementById('metric-custom-requests').textContent = newCustomRequests;
      document.getElementById('metric-total-products').textContent = products.length;

      // Render recent activity table in overview
      const recentContainer = document.getElementById('admin-recent-orders-list');
      if (recentContainer) {
        recentContainer.innerHTML = orders.slice(0, 5).map(ord => `
          <tr>
            <td><strong>${ord.order_number || ord.id}</strong></td>
            <td>${ord.customer_name}</td>
            <td>${window.UI.formatDate(ord.preferred_date)}</td>
            <td>${window.UI.formatCurrency(ord.total_amount)}</td>
            <td><span class="badge ${this.getStatusBadgeClass(ord.status)}">${ord.status}</span></td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="window.admin.openOrderDetails('${ord.id}')">View</button>
            </td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error('Error rendering metrics:', e);
    }
  }

  getStatusBadgeClass(status) {
    switch (status) {
      case 'New': return 'badge-instock';
      case 'Confirmed': return 'badge-instock';
      case 'Preparing': return 'badge-preorder';
      case 'Ready': return 'badge-gold';
      case 'Delivered': return 'badge-instock';
      case 'Cancelled': return 'badge-soldout';
      default: return 'badge-signature';
    }
  }

  // ============================================================================
  // ORDERS MANAGEMENT
  // ============================================================================
  async renderOrdersTable() {
    const tableBody = document.getElementById('admin-orders-tbody');
    if (!tableBody) return;

    try {
      const orders = await window.db.getOrders();

      if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 40px; color: var(--color-text-muted);">No orders received yet.</td></tr>`;
        return;
      }

      tableBody.innerHTML = orders.map(ord => `
        <tr>
          <td><strong>${ord.order_number || ord.id}</strong></td>
          <td>
            <div style="font-weight: 600;">${ord.customer_name}</div>
            <div style="font-size: 0.75rem; color: var(--color-taupe);">${ord.customer_phone}</div>
          </td>
          <td>
            <span class="badge ${ord.fulfillment_type === 'Delivery' ? 'badge-signature' : 'badge-gold'}">
              ${ord.fulfillment_type}
            </span>
          </td>
          <td>${window.UI.formatDate(ord.preferred_date)}</td>
          <td><strong>${window.UI.formatCurrency(ord.total_amount)}</strong></td>
          <td>
            <select class="status-select" onchange="window.admin.handleOrderStatusChange('${ord.id}', this.value)">
              <option value="New" ${ord.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Confirmed" ${ord.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
              <option value="Ready" ${ord.status === 'Ready' ? 'selected' : ''}>Ready</option>
              <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.admin.openOrderDetails('${ord.id}')">
              Details
            </button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      console.error('Error rendering orders table:', e);
    }
  }

  async handleOrderStatusChange(orderId, newStatus) {
    try {
      await window.db.updateOrderStatus(orderId, newStatus);
      window.UI.showToast(`Order status updated to "${newStatus}".`, 'success');
      this.renderMetrics();
    } catch (e) {
      window.UI.showToast('Failed to update order status.', 'error');
    }
  }

  async openOrderDetails(orderId) {
    try {
      const order = await window.db.getOrderById(orderId);
      if (!order) return;

      document.getElementById('modal-order-number').textContent = order.order_number || order.id;
      document.getElementById('modal-order-status').textContent = order.status;
      document.getElementById('modal-order-status').className = `badge ${this.getStatusBadgeClass(order.status)}`;
      document.getElementById('modal-customer-name').textContent = order.customer_name;
      document.getElementById('modal-customer-phone').textContent = order.customer_phone;
      document.getElementById('modal-customer-email').textContent = order.customer_email || 'N/A';
      document.getElementById('modal-fulfillment').textContent = `${order.fulfillment_type} — ${order.delivery_address || 'Studio Pickup'}`;
      document.getElementById('modal-date').textContent = `${window.UI.formatDate(order.preferred_date)} (${order.preferred_time || 'Standard'})`;
      document.getElementById('modal-notes').textContent = order.special_notes ? `"${order.special_notes}"` : 'None';

      const itemsList = document.getElementById('modal-order-items');
      if (itemsList && order.items) {
        itemsList.innerHTML = order.items.map(it => `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: var(--border-delicate); font-size: var(--font-size-sm);">
            <div>
              <div style="font-weight: 600;">${it.product_name} &times; ${it.quantity}</div>
              <div style="font-size: 0.75rem; color: var(--color-taupe);">${it.size_selected || it.size || 'Standard'}</div>
              ${it.custom_inscription ? `<div style="font-size: 0.75rem; color: var(--color-accent-terracotta); font-style: italic;">Inscription: "${it.custom_inscription}"</div>` : ''}
            </div>
            <div style="font-weight: 600;">${window.UI.formatCurrency(it.total_price || (it.unit_price * it.quantity))}</div>
          </div>
        `).join('');
      }

      document.getElementById('modal-order-total').textContent = window.UI.formatCurrency(order.total_amount);

      window.UI.openModal('admin-order-modal');
    } catch (e) {
      console.error('Error opening order details:', e);
    }
  }

  // ============================================================================
  // PRODUCT MANAGEMENT (CRUD)
  // ============================================================================
  async renderProductsTable() {
    const tableBody = document.getElementById('admin-products-tbody');
    if (!tableBody) return;

    try {
      const products = await window.db.getProducts();

      if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 40px;">No cakes in catalogue. Click "Add New Cake" to add one.</td></tr>`;
        return;
      }

      tableBody.innerHTML = products.map(prod => `
        <tr>
          <td>
            <img src="${prod.image_url}" alt="${prod.name}" class="table-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=100&q=80'">
          </td>
          <td>
            <div style="font-weight: 600; font-family: var(--font-serif-display); font-size: 1.125rem;">${prod.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-taupe);">${prod.category_name || 'Boutique'}</div>
          </td>
          <td><strong>${window.UI.formatCurrency(prod.price)}</strong></td>
          <td>
            <button class="badge ${prod.availability === 'In Stock' ? 'badge-instock' : prod.availability === 'Sold Out' ? 'badge-soldout' : 'badge-preorder'}"
                    onclick="window.admin.toggleAvailability('${prod.id}', '${prod.availability}')"
                    title="Click to toggle status">
              ${prod.availability} ⟳
            </button>
          </td>
          <td>
            <button class="badge ${prod.featured ? 'badge-gold' : 'badge-signature'}"
                    onclick="window.admin.toggleFeatured('${prod.id}', ${prod.featured})">
              ${prod.featured ? '★ Featured' : 'Standard'}
            </button>
          </td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="window.admin.openEditProductModal('${prod.id}')">Edit</button>
              <button class="btn btn-outline btn-sm" style="color: var(--color-status-cancelled); border-color: rgba(225, 29, 72, 0.3);" onclick="window.admin.handleDeleteProduct('${prod.id}', '${prod.name.replace(/'/g, "\\'")}')">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      console.error('Error rendering products table:', e);
    }
  }

  async populateCategorySelects() {
    try {
      const categories = await window.db.getCategories();
      const select = document.getElementById('product-form-category');
      if (select) {
        select.innerHTML = categories.map(c => `
          <option value="${c.id}" data-name="${c.name}">${c.name}</option>
        `).join('');
      }
    } catch (e) {
      console.error('Error populating category dropdown:', e);
    }
  }

  setupProductForm() {
    const addBtn = document.getElementById('btn-add-new-product');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.editingProductId = null;
        document.getElementById('product-modal-title').textContent = 'Add New Boutique Cake';
        document.getElementById('admin-product-form').reset();
        document.getElementById('product-img-preview').src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
        window.UI.openModal('admin-product-modal');
      });
    }

    // Image URL Live Preview
    const imgInput = document.getElementById('product-form-image');
    const preview = document.getElementById('product-img-preview');
    if (imgInput && preview) {
      imgInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
          preview.src = e.target.value.trim();
        }
      });
    }

    // Product Form Submit
    const form = document.getElementById('admin-product-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const categorySelect = document.getElementById('product-form-category');
        const selectedOption = categorySelect?.options[categorySelect.selectedIndex];

        const payload = {
          name: document.getElementById('product-form-name')?.value.trim(),
          category_id: categorySelect?.value,
          category_name: selectedOption?.getAttribute('data-name') || selectedOption?.text,
          price: parseFloat(document.getElementById('product-form-price')?.value) || 0,
          image_url: document.getElementById('product-form-image')?.value.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
          description: document.getElementById('product-form-description')?.value.trim(),
          tasting_notes: document.getElementById('product-form-tasting-notes')?.value.trim(),
          portion_guide: document.getElementById('product-form-portion')?.value.trim() || 'Serves 8-12',
          availability: document.getElementById('product-form-availability')?.value || 'In Stock',
          featured: document.getElementById('product-form-featured')?.checked || false
        };

        try {
          if (this.editingProductId) {
            await window.db.updateProduct(this.editingProductId, payload);
            window.UI.showToast('Product updated successfully.', 'success');
          } else {
            await window.db.createProduct(payload);
            window.UI.showToast('New cake added to catalogue.', 'success');
          }

          window.UI.closeModal('admin-product-modal');
          this.renderProductsTable();
          this.renderMetrics();
        } catch (err) {
          window.UI.showToast('Error saving product.', 'error');
        }
      });
    }
  }

  async openEditProductModal(productId) {
    try {
      const prod = await window.db.getProductById(productId);
      if (!prod) return;

      this.editingProductId = productId;
      document.getElementById('product-modal-title').textContent = `Edit Cake: ${prod.name}`;
      document.getElementById('product-form-name').value = prod.name;
      document.getElementById('product-form-category').value = prod.category_id || '';
      document.getElementById('product-form-price').value = prod.price;
      document.getElementById('product-form-image').value = prod.image_url;
      document.getElementById('product-img-preview').src = prod.image_url;
      document.getElementById('product-form-description').value = prod.description;
      document.getElementById('product-form-tasting-notes').value = prod.tasting_notes || '';
      document.getElementById('product-form-portion').value = prod.portion_guide || 'Serves 8-12';
      document.getElementById('product-form-availability').value = prod.availability;
      document.getElementById('product-form-featured').checked = Boolean(prod.featured);

      window.UI.openModal('admin-product-modal');
    } catch (e) {
      console.error('Error opening edit product modal:', e);
    }
  }

  async toggleAvailability(productId, current) {
    const next = current === 'In Stock' ? 'Sold Out' : current === 'Sold Out' ? 'Pre-Order Only' : 'In Stock';
    await window.db.updateProduct(productId, { availability: next });
    window.UI.showToast(`Availability changed to "${next}".`, 'success');
    this.renderProductsTable();
  }

  async toggleFeatured(productId, currentFeatured) {
    await window.db.updateProduct(productId, { featured: !currentFeatured });
    window.UI.showToast(`Product featured status updated.`, 'success');
    this.renderProductsTable();
  }

  async handleDeleteProduct(productId, productName) {
    if (confirm(`Are you sure you wish to delete "${productName}" from the catalogue?`)) {
      await window.db.deleteProduct(productId);
      window.UI.showToast(`"${productName}" has been removed.`, 'success');
      this.renderProductsTable();
      this.renderMetrics();
    }
  }

  // ============================================================================
  // CATEGORIES MANAGEMENT
  // ============================================================================
  async renderCategoriesTable() {
    const tableBody = document.getElementById('admin-categories-tbody');
    if (!tableBody) return;

    try {
      const categories = await window.db.getCategories();
      tableBody.innerHTML = categories.map(cat => `
        <tr>
          <td><img src="${cat.image_url}" class="table-thumbnail"></td>
          <td><strong>${cat.name}</strong></td>
          <td><code style="font-family: var(--font-mono); font-size: 0.75rem;">${cat.slug}</code></td>
          <td style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${cat.description || '—'}</td>
          <td>
            <button class="btn btn-outline btn-sm" style="color: var(--color-status-cancelled);" onclick="window.admin.handleDeleteCategory('${cat.id}', '${cat.name}')">Delete</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      console.error('Error rendering categories table:', e);
    }
  }

  setupCategoryForm() {
    const addCatBtn = document.getElementById('btn-add-new-category');
    if (addCatBtn) {
      addCatBtn.addEventListener('click', () => {
        document.getElementById('admin-category-form').reset();
        window.UI.openModal('admin-category-modal');
      });
    }

    const form = document.getElementById('admin-category-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('cat-form-name')?.value.trim(),
          description: document.getElementById('cat-form-description')?.value.trim(),
          image_url: document.getElementById('cat-form-image')?.value.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
          display_order: parseInt(document.getElementById('cat-form-order')?.value, 10) || 1
        };

        await window.db.createCategory(payload);
        window.UI.showToast('Category created successfully.', 'success');
        window.UI.closeModal('admin-category-modal');
        this.renderCategoriesTable();
        this.populateCategorySelects();
      });
    }
  }

  async handleDeleteCategory(id, name) {
    if (confirm(`Delete category "${name}"?`)) {
      await window.db.deleteCategory(id);
      window.UI.showToast(`Category "${name}" deleted.`, 'success');
      this.renderCategoriesTable();
      this.populateCategorySelects();
    }
  }

  // ============================================================================
  // CUSTOM CAKE REQUESTS (BESPOKE STUDIO INQUIRIES)
  // ============================================================================
  async renderCustomRequestsTable() {
    const tableBody = document.getElementById('admin-custom-requests-tbody');
    if (!tableBody) return;

    try {
      const requests = await window.db.getCustomRequests();

      if (requests.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 40px;">No custom bespoke inquiries yet.</td></tr>`;
        return;
      }

      tableBody.innerHTML = requests.map(req => `
        <tr>
          <td><strong>${req.request_number || req.id}</strong></td>
          <td>
            <div style="font-weight: 600;">${req.customer_name}</div>
            <div style="font-size: 0.75rem; color: var(--color-taupe);">${req.customer_phone} • ${req.customer_email}</div>
          </td>
          <td>
            <span class="badge badge-signature">${req.occasion}</span>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 2px;">${req.guest_count}</div>
          </td>
          <td>
            <div style="font-size: 0.75rem; font-weight: 600;">${req.style_theme}</div>
            <div style="font-size: 0.75rem; color: var(--color-taupe);">${req.flavor_preference}</div>
          </td>
          <td>${window.UI.formatDate(req.event_date)}</td>
          <td>
            <select class="status-select" onchange="window.admin.handleCustomRequestStatusChange('${req.id}', this.value)">
              <option value="New" ${req.status === 'New' ? 'selected' : ''}>New</option>
              <option value="In Review" ${req.status === 'In Review' ? 'selected' : ''}>In Review</option>
              <option value="Quoted" ${req.status === 'Quoted' ? 'selected' : ''}>Quoted</option>
              <option value="Approved" ${req.status === 'Approved' ? 'selected' : ''}>Approved</option>
              <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Archived" ${req.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.admin.openCustomRequestDetails('${req.id}')">Review</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      console.error('Error rendering custom requests:', e);
    }
  }

  async handleCustomRequestStatusChange(id, status) {
    await window.db.updateCustomRequestStatus(id, status);
    window.UI.showToast(`Custom request status updated to "${status}".`, 'success');
  }

  async openCustomRequestDetails(id) {
    const requests = await window.db.getCustomRequests();
    const req = requests.find(r => r.id === id);
    if (!req) return;

    alert(`
=== BESPOKE CAKE INQUIRY ===
Inquiry Ref: ${req.request_number || req.id}
Client: ${req.customer_name} (${req.customer_phone}, ${req.customer_email})
Occasion: ${req.occasion}
Guests: ${req.guest_count}
Target Event Date: ${req.event_date}
Style/Theme: ${req.style_theme}
Flavor Journey: ${req.flavor_preference}
Budget Range: ${req.budget_range || 'Standard'}
Reference Image: ${req.reference_image_url || 'None provided'}
Special Notes: ${req.notes || 'None'}
Status: ${req.status}
    `);
  }

  // ============================================================================
  // SETTINGS & SUPABASE CONFIG
  // ============================================================================
  setupSettings() {
    const urlInput = document.getElementById('settings-supabase-url');
    const keyInput = document.getElementById('settings-supabase-key');
    const saveBtn = document.getElementById('btn-save-supabase-settings');
    const seedBtn = document.getElementById('btn-seed-database');
    const resetStoreBtn = document.getElementById('btn-reset-mock-store');
    const checkHealthBtn = document.getElementById('btn-check-db-health');
    const copySqlBtn = document.getElementById('btn-copy-sql-schema');

    // Pre-fill with current config or saved keys
    if (urlInput) {
      urlInput.value = localStorage.getItem('MS_SUPABASE_URL') || window.APP_CONFIG.SUPABASE_URL || '';
    }
    if (keyInput) {
      keyInput.value = localStorage.getItem('MS_SUPABASE_ANON_KEY') || window.APP_CONFIG.SUPABASE_ANON_KEY || '';
    }

    if (checkHealthBtn) {
      checkHealthBtn.addEventListener('click', () => {
        this.checkHealth();
        window.UI.showToast('Testing Supabase connectivity...', 'info');
      });
    }

    if (copySqlBtn) {
      copySqlBtn.addEventListener('click', () => {
        this.copySqlSchema();
      });
    }

    this.loadSchemaPreview();

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        const key = keyInput.value.trim();

        if (url && key) {
          localStorage.setItem('MS_SUPABASE_URL', url);
          localStorage.setItem('MS_SUPABASE_ANON_KEY', key);
          window.APP_CONFIG.SUPABASE_URL = url;
          window.APP_CONFIG.SUPABASE_ANON_KEY = key;
          window.db.init();
          this.updateConnectionBadge();
          this.checkHealth();
          window.UI.showToast('Supabase configuration saved & initialized.', 'success');
        } else {
          localStorage.removeItem('MS_SUPABASE_URL');
          localStorage.removeItem('MS_SUPABASE_ANON_KEY');
          window.APP_CONFIG.SUPABASE_URL = '';
          window.APP_CONFIG.SUPABASE_ANON_KEY = '';
          window.db.init();
          this.updateConnectionBadge();
          this.checkHealth();
          window.UI.showToast('Switched to Local Studio Mode.');
        }
      });
    }

    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        try {
          seedBtn.disabled = true;
          seedBtn.textContent = 'Seeding Database...';
          await window.db.seedLiveSupabase();
          window.UI.showToast('Live Supabase database successfully seeded with boutique cakes & categories!', 'success');
          this.checkHealth();
        } catch (e) {
          window.UI.showToast(e.message || 'Seeding failed.', 'error');
        } finally {
          seedBtn.disabled = false;
          seedBtn.textContent = 'Seed Live Supabase with Initial Cakes';
        }
      });
    }

    if (resetStoreBtn) {
      resetStoreBtn.addEventListener('click', () => {
        if (confirm('Reset local studio catalogue and demo orders to defaults?')) {
          window.db.resetLocalStore();
          window.UI.showToast('Local studio store reset to default seed data.', 'success');
          this.loadAllData();
        }
      });
    }
  }

  async checkHealth() {
    const badge = document.getElementById('admin-health-badge');
    const schemaStatus = document.getElementById('diag-schema-status');
    const msgBox = document.getElementById('health-message-box');
    const urlDisplay = document.getElementById('diag-project-url');
    const refDisplay = document.getElementById('diag-project-ref');

    if (urlDisplay) urlDisplay.textContent = window.APP_CONFIG.SUPABASE_URL || 'Not Configured';
    if (refDisplay) refDisplay.textContent = window.APP_CONFIG.SUPABASE_PROJECT_REF || 'jnovjohpgyhcfjewimpy';

    if (!badge) return;

    badge.className = 'health-badge checking';
    badge.innerHTML = '<span>●</span> Checking Status...';
    if (schemaStatus) schemaStatus.textContent = 'Querying Supabase...';
    if (msgBox) msgBox.textContent = 'Testing connectivity to your Supabase tables...';

    const result = await window.db.checkLiveHealth();
    if (result.ok) {
      badge.className = 'health-badge ok';
      badge.innerHTML = '<span>●</span> Live Supabase Connected &amp; Ready';
      if (schemaStatus) {
        schemaStatus.textContent = 'All Tables Active ✓';
        schemaStatus.style.color = 'var(--color-status-confirmed)';
      }
      if (msgBox) {
        msgBox.innerHTML = '<strong style="color: var(--color-status-confirmed);">Connection Healthy:</strong> Supabase database tables (categories, products, orders, order_items, custom_requests) are live and synchronized.';
      }
    } else if (result.tablesMissing) {
      badge.className = 'health-badge warning';
      badge.innerHTML = '<span>●</span> Connected — Tables Pending';
      if (schemaStatus) {
        schemaStatus.textContent = 'Tables Missing (PGRST205)';
        schemaStatus.style.color = 'var(--color-status-preparing)';
      }
      if (msgBox) {
        msgBox.innerHTML = '<strong style="color: var(--color-status-preparing);">Supabase Connected:</strong> Authentication is valid, but the database tables have not been created yet in your Supabase SQL editor. Click <strong>"Copy SQL Schema"</strong> above, then click <strong>"Open SQL Editor ↗"</strong> and run it.';
      }
    } else {
      badge.className = 'health-badge warning';
      badge.innerHTML = '<span>●</span> Local Studio Fallback';
      if (schemaStatus) schemaStatus.textContent = 'Using Local Storage';
      if (msgBox) {
        msgBox.textContent = result.error || 'Running in resilient local fallback store.';
      }
    }
  }

  async copySqlSchema() {
    let sql = '';
    try {
      const resp = await fetch('sql/schema.sql');
      if (resp.ok) {
        sql = await resp.text();
      }
    } catch (e) {
      console.warn('Could not fetch sql/schema.sql dynamically:', e);
    }

    if (!sql) {
      const el = document.getElementById('sql-schema-preview-container');
      sql = el ? el.textContent.trim() : '';
    }

    if (sql) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(sql);
        } else {
          const ta = document.createElement('textarea');
          ta.value = sql;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        window.UI.showToast('PostgreSQL schema copied to clipboard! Paste it into your Supabase SQL Editor.', 'success');
      } catch (err) {
        window.UI.showToast('Copied to clipboard!', 'success');
      }
    }
  }

  async loadSchemaPreview() {
    const previewEl = document.getElementById('sql-schema-preview-container');
    if (!previewEl) return;
    try {
      const resp = await fetch('sql/schema.sql');
      if (resp.ok) {
        const text = await resp.text();
        previewEl.textContent = text;
      }
    } catch (e) {
      console.warn('Failed to load schema preview:', e);
    }
  }
}

window.admin = new AdminController();
