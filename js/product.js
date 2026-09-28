/**
 * MAISON SUCRE — PRODUCT DETAILS CONTROLLER
 */

class ProductDetailsController {
  constructor() {
    this.product = null;
    this.selectedSize = '6-inch (8-10 Servings)';
    this.sizePriceDelta = 0;
    this.selectedFlavor = 'Signature Studio Recipe';
    this.quantity = 1;
    this.inscription = '';
    this.init();
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || params.get('slug');

    if (!productId) {
      window.location.href = 'shop.html';
      return;
    }

    try {
      this.product = await window.db.getProductById(productId);
      if (!this.product) {
        // Fallback to first product if not found
        const all = await window.db.getProducts();
        this.product = all[0];
      }
      this.renderProduct();
      this.setupEventListeners();
      this.loadRelatedProducts();
    } catch (e) {
      console.error('Error loading product:', e);
    }
  }

  renderProduct() {
    const p = this.product;
    if (!p) return;

    // Document Title
    document.title = `${p.name} — Maison Sucre Haute Cake Studio`;

    // Breadcrumbs
    const crumbTitle = document.getElementById('breadcrumb-product-title');
    if (crumbTitle) crumbTitle.textContent = p.name;
    const crumbCategory = document.getElementById('breadcrumb-category');
    if (crumbCategory) crumbCategory.textContent = p.category_name || 'The Collection';

    // Gallery
    const mainImg = document.getElementById('product-main-img');
    if (mainImg) {
      mainImg.src = p.image_url;
      mainImg.alt = p.name;
    }

    const thumbsContainer = document.getElementById('product-thumbnails-container');
    const mainVideo = document.getElementById('product-main-video');
    
    if (thumbsContainer) {
      const gallery = p.gallery_images && p.gallery_images.length > 0 ? p.gallery_images : [p.image_url];
      
      let thumbsHtml = gallery.map((imgUrl, idx) => `
        <button class="thumbnail-btn ${idx === 0 ? 'active' : ''}" data-type="image" data-img-url="${imgUrl}">
          <img src="${imgUrl}" alt="${p.name} view ${idx + 1}">
        </button>
      `).join('');

      // Add Video Thumbnail
      thumbsHtml += `
        <button class="thumbnail-btn" data-type="video" title="Watch 360° Cake Motion Film" style="position: relative; background: #161311; display: flex; align-items: center; justify-content: center;">
          <img src="${p.image_url}" alt="Video preview" style="opacity: 0.45; filter: blur(0.5px);">
          <span style="position: absolute; color: #fff; background: var(--color-accent-gold); width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; padding-left: 2px;">▶</span>
        </button>
      `;

      thumbsContainer.innerHTML = thumbsHtml;

      thumbsContainer.querySelectorAll('.thumbnail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          thumbsContainer.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const type = btn.getAttribute('data-type');
          if (type === 'video') {
            if (mainImg) mainImg.style.display = 'none';
            if (mainVideo) {
              mainVideo.style.display = 'block';
              mainVideo.currentTime = 0;
              mainVideo.play().catch(e => console.log(e));
            }
          } else {
            if (mainVideo) {
              mainVideo.style.display = 'none';
              mainVideo.pause();
            }
            if (mainImg) {
              mainImg.style.display = 'block';
              mainImg.src = btn.getAttribute('data-img-url');
            }
          }
        });
      });
    }

    // Titles & Pricing
    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = p.name;

    const categoryTagEl = document.getElementById('product-category-tag');
    if (categoryTagEl) categoryTagEl.textContent = p.category_name || 'Signature Cake';

    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = p.description;

    const availabilityBadge = document.getElementById('product-availability-badge');
    if (availabilityBadge) {
      availabilityBadge.textContent = p.availability;
      availabilityBadge.className = `badge ${p.availability === 'In Stock' ? 'badge-signature' : p.availability === 'Sold Out' ? 'badge-soldout' : 'badge-preorder'}`;
    }

    // Dietary Tags
    const dietaryWrap = document.getElementById('product-dietary-wrap');
    if (dietaryWrap && p.dietary_tags) {
      dietaryWrap.innerHTML = p.dietary_tags.map(tag => `
        <span class="product-dietary-pill">${tag}</span>
      `).join('');
    }

    // Accordions content
    const tastingNotesBody = document.getElementById('acc-tasting-notes');
    if (tastingNotesBody) {
      tastingNotesBody.textContent = p.tasting_notes || 'Handcrafted using single-origin Valrhona chocolate, organic Tahitian vanilla beans, pure French Normandy butter, and fresh seasonal fruit coulis.';
    }

    const portionGuideBody = document.getElementById('acc-portion-guide');
    if (portionGuideBody) {
      portionGuideBody.textContent = `${p.portion_guide || 'Serves 8-12'}. Each cake stands approximately 6-7 inches tall with 4 generous layers of moist sponge and delicate fillings.`;
    }

    this.updatePriceDisplay();
  }

  updatePriceDisplay() {
    if (!this.product) return;
    const basePrice = parseFloat(this.product.price);
    const finalUnitPrice = basePrice + this.sizePriceDelta;
    const priceEl = document.getElementById('product-price-display');
    if (priceEl) {
      priceEl.textContent = window.UI.formatCurrency(finalUnitPrice);
    }
  }

  setupEventListeners() {
    // Sizing chips
    document.querySelectorAll('.size-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedSize = chip.getAttribute('data-size');
        this.sizePriceDelta = parseFloat(chip.getAttribute('data-delta') || 0);
        this.updatePriceDisplay();
      });
    });

    // Inscription Input
    const inscriptionInput = document.getElementById('cake-inscription-input');
    const charCounter = document.getElementById('inscription-char-counter');
    if (inscriptionInput) {
      inscriptionInput.addEventListener('input', (e) => {
        this.inscription = e.target.value;
        if (charCounter) {
          charCounter.textContent = `${e.target.value.length}/35`;
        }
      });
    }

    // Quantity selector
    const qtyInput = document.getElementById('product-qty-val');
    const qtyMinus = document.getElementById('product-qty-minus');
    const qtyPlus = document.getElementById('product-qty-plus');

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          qtyInput.value = this.quantity;
        }
      });

      qtyPlus.addEventListener('click', () => {
        if (this.quantity < 10) {
          this.quantity++;
          qtyInput.value = this.quantity;
        }
      });
    }

    // Add to Cart Button
    const addToCartBtn = document.getElementById('btn-add-cart-detail');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const basePrice = parseFloat(this.product.price);
        const finalUnitPrice = basePrice + this.sizePriceDelta;

        window.cart.addItem(this.product, {
          size: this.selectedSize,
          flavor: this.selectedFlavor,
          inscription: this.inscription,
          quantity: this.quantity,
          price: finalUnitPrice
        });
      });
    }

    // Direct Buy / Order Now Button
    const buyNowBtn = document.getElementById('btn-buy-now');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        const basePrice = parseFloat(this.product.price);
        const finalUnitPrice = basePrice + this.sizePriceDelta;

        window.cart.addItem(this.product, {
          size: this.selectedSize,
          flavor: this.selectedFlavor,
          inscription: this.inscription,
          quantity: this.quantity,
          price: finalUnitPrice
        });
        window.location.href = 'checkout.html';
      });
    }

    // Accordion trigger handlers
    document.querySelectorAll('.product-acc-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.product-acc-item');
        item.classList.toggle('active');
      });
    });
  }

  async loadRelatedProducts() {
    const relatedGrid = document.getElementById('related-products-grid');
    if (!relatedGrid || !this.product) return;

    try {
      const all = await window.db.getProducts();
      const related = all.filter(p => p.id !== this.product.id).slice(0, 3);

      relatedGrid.innerHTML = related.map(prod => `
        <div class="product-card">
          <div class="product-image-wrap">
            <img src="${prod.image_url}" alt="${prod.name}" loading="lazy">
            <a href="product.html?id=${prod.id}" class="product-quick-view-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </a>
          </div>
          <div class="product-card-body">
            <span class="product-category-tag">${prod.category_name}</span>
            <h3 class="product-title"><a href="product.html?id=${prod.id}">${prod.name}</a></h3>
            <div class="product-card-footer">
              <div class="product-price">${window.UI.formatCurrency(prod.price)}</div>
              <a href="product.html?id=${prod.id}" class="btn btn-outline btn-sm">View Details</a>
            </div>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error('Error loading related products:', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-main-img')) {
    new ProductDetailsController();
  }
});
