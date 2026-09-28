/**
 * MAISON SUCRE — HOMEPAGE CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load Categories Showcase
  const categoriesGrid = document.getElementById('home-categories-grid');
  if (categoriesGrid) {
    try {
      const categories = await window.db.getCategories();
      categoriesGrid.innerHTML = categories.slice(0, 4).map(cat => `
        <a href="shop.html?category=${encodeURIComponent(cat.id)}" class="category-card">
          <img src="${cat.image_url}" alt="${cat.name}" loading="lazy">
          <div class="category-card-overlay"></div>
          <div class="category-card-content">
            <h3 class="category-card-title">${cat.name}</h3>
            <span class="category-card-count">Explore Collection &rarr;</span>
          </div>
        </a>
      `).join('');
    } catch (e) {
      console.error('Error loading home categories:', e);
    }
  }

  // 2. Load Featured Cakes
  const featuredGrid = document.getElementById('home-featured-grid');
  if (featuredGrid) {
    try {
      const products = await window.db.getProducts({ featured: true });
      const displayProducts = products.length > 0 ? products.slice(0, 4) : (await window.db.getProducts()).slice(0, 4);

      featuredGrid.innerHTML = displayProducts.map(prod => `
        <div class="product-card">
          <div class="product-image-wrap">
            <img src="${prod.image_url}" alt="${prod.name}" loading="lazy">
            <div class="product-badge-overlay">
              <span class="badge ${prod.availability === 'In Stock' ? 'badge-signature' : 'badge-preorder'}">
                ${prod.availability}
              </span>
            </div>
            <a href="product.html?id=${prod.id}" class="product-quick-view-btn" title="View Details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </a>
          </div>
          <div class="product-card-body">
            <span class="product-category-tag">${prod.category_name || 'Boutique Cake'}</span>
            <h3 class="product-title">
              <a href="product.html?id=${prod.id}">${prod.name}</a>
            </h3>
            <div class="product-tasting-notes">${prod.tasting_notes || prod.description}</div>
            <div class="product-card-footer">
              <div class="product-price">${window.UI.formatCurrency(prod.price)}</div>
              <button class="btn btn-outline btn-sm" onclick="window.cart.addItem(${JSON.stringify(prod).replace(/"/g, '&quot;')})">
                Add to Order
              </button>
            </div>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error('Error loading featured cakes:', e);
    }
  }

  // 3. Setup FAQ Accordions
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close other FAQ items
      document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Hero Media Switcher (Photo vs Live Film)
  const btnHeroPhoto = document.getElementById('btn-hero-photo');
  const btnHeroVideo = document.getElementById('btn-hero-video');
  const heroImg = document.getElementById('hero-img-element');
  const heroVid = document.getElementById('hero-video-element');

  if (btnHeroPhoto && btnHeroVideo && heroImg && heroVid) {
    btnHeroPhoto.addEventListener('click', () => {
      btnHeroPhoto.classList.add('active');
      btnHeroVideo.classList.remove('active');
      heroImg.style.display = 'block';
      heroVid.style.display = 'none';
      heroVid.pause();
    });

    btnHeroVideo.addEventListener('click', () => {
      btnHeroVideo.classList.add('active');
      btnHeroPhoto.classList.remove('active');
      heroImg.style.display = 'none';
      heroVid.style.display = 'block';
      heroVid.play().catch(err => console.log('Video autoplay handled:', err));
    });
  }

  // 5. Hero "Watch Film" CTA Modal Lightbox
  const btnWatchFilm = document.getElementById('btn-hero-watch-film');
  const modalVideo = document.getElementById('modal-cinema-video');
  if (btnWatchFilm) {
    btnWatchFilm.addEventListener('click', () => {
      window.UI.openModal('atelier-film-modal');
      if (modalVideo) {
        modalVideo.currentTime = 0;
        modalVideo.play().catch(e => console.log(e));
      }
    });
  }

  // Stop modal video when closing modal
  const filmModal = document.getElementById('atelier-film-modal');
  if (filmModal && modalVideo) {
    filmModal.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => modalVideo.pause());
    });
    filmModal.addEventListener('click', (e) => {
      if (e.target === filmModal) modalVideo.pause();
    });
  }

  // 6. Editorial Brand Film Sound Toggle
  const editorialVideo = document.getElementById('editorial-film-video');
  const editorialSoundBtn = document.getElementById('btn-editorial-sound-toggle');
  const editorialSoundIcon = document.getElementById('editorial-sound-icon');
  const editorialSoundText = document.getElementById('editorial-sound-text');

  if (editorialVideo && editorialSoundBtn) {
    editorialSoundBtn.addEventListener('click', () => {
      if (editorialVideo.muted) {
        editorialVideo.muted = false;
        if (editorialSoundIcon) editorialSoundIcon.textContent = '🔊';
        if (editorialSoundText) editorialSoundText.textContent = 'Sound On';
        editorialSoundBtn.style.background = 'rgba(204, 164, 89, 0.35)';
        editorialSoundBtn.style.borderColor = 'var(--color-accent-gold)';
      } else {
        editorialVideo.muted = true;
        if (editorialSoundIcon) editorialSoundIcon.textContent = '🔇';
        if (editorialSoundText) editorialSoundText.textContent = 'Sound Off';
        editorialSoundBtn.style.background = '';
        editorialSoundBtn.style.borderColor = '';
      }
    });
  }

  // 7. Atelier Cinema Feature Section Video Controls & Chapter Navigation
  const cinemaVideo = document.getElementById('atelier-cinema-video');
  const cinemaPlayBtn = document.getElementById('cinema-play-toggle');
  const cinemaPlayIcon = document.getElementById('cinema-play-icon');
  const cinemaPlayText = document.getElementById('cinema-play-text');
  const cinemaSoundBtn = document.getElementById('cinema-sound-toggle');
  const cinemaSoundIcon = document.getElementById('cinema-sound-icon');
  const cinemaSoundText = document.getElementById('cinema-sound-text');
  const chapterButtons = document.querySelectorAll('.cinema-chapter-btn');

  // Chapter selector tabs
  if (cinemaVideo && chapterButtons.length > 0) {
    chapterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        chapterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const videoSrc = btn.getAttribute('data-video');
        const posterSrc = btn.getAttribute('data-poster');

        if (videoSrc) {
          const wasPlaying = !cinemaVideo.paused;
          cinemaVideo.src = videoSrc;
          if (posterSrc) cinemaVideo.poster = posterSrc;
          cinemaVideo.load();
          cinemaVideo.play().catch(e => console.log('Chapter playback error:', e));
          if (cinemaPlayIcon) cinemaPlayIcon.textContent = '⏸';
          if (cinemaPlayText) cinemaPlayText.textContent = 'Pause';
        }
      });
    });
  }

  if (cinemaVideo && cinemaPlayBtn) {
    cinemaPlayBtn.addEventListener('click', () => {
      if (cinemaVideo.paused) {
        cinemaVideo.play();
        if (cinemaPlayIcon) cinemaPlayIcon.textContent = '⏸';
        if (cinemaPlayText) cinemaPlayText.textContent = 'Pause';
      } else {
        cinemaVideo.pause();
        if (cinemaPlayIcon) cinemaPlayIcon.textContent = '▶';
        if (cinemaPlayText) cinemaPlayText.textContent = 'Play';
      }
    });
  }

  if (cinemaVideo && cinemaSoundBtn) {
    cinemaSoundBtn.addEventListener('click', () => {
      if (cinemaVideo.muted) {
        cinemaVideo.muted = false;
        if (cinemaSoundIcon) cinemaSoundIcon.textContent = '🔊';
        if (cinemaSoundText) cinemaSoundText.textContent = 'Mute';
      } else {
        cinemaVideo.muted = true;
        if (cinemaSoundIcon) cinemaSoundIcon.textContent = '🔇';
        if (cinemaSoundText) cinemaSoundText.textContent = 'Unmute';
      }
    });
  }

  // 8. Newsletter Subscription Form Handler
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        window.UI.showToast('Thank you for subscribing to Maison Sucre letters.', 'success');
        input.value = '';
      }
    });
  }
});
