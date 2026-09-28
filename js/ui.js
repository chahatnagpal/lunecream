/**
 * MAISON SUCRE — UI HELPERS & GLOBAL INTERACTIONS
 */

const UI = {
  // Format price into elegant currency string ($125.00)
  formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return `${window.APP_CONFIG.CURRENCY}${num.toFixed(2)}`;
  },

  // Format ISO date into human editorial string (e.g. Oct 14, 2026)
  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  },

  // Calculate minimum allowable date for delivery/pickup (48h lead time)
  getMinDeliveryDateString() {
    const minLead = new Date();
    minLead.setDate(minLead.getDate() + 2); // 48h minimum
    const year = minLead.getFullYear();
    const month = String(minLead.getMonth() + 1).padStart(2, '0');
    const day = String(minLead.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Show luxury Toast Notification
  showToast(message, type = 'default', duration = 3600) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;
    
    let icon = '✦';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span style="font-weight: 700; color: var(--color-accent-gold); font-size: 1rem;">${icon}</span>
      <div style="flex-grow: 1; line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Modal Dialog Controllers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // Initialize Global Header, Mobile Drawer & Global Listeners
  init() {
    // 1. Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // 2. Mobile Nav Drawer
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileCloseBtn = document.querySelector('.mobile-nav-close');

    if (menuToggle && mobileDrawer && mobileBackdrop) {
      const openDrawer = () => {
        mobileBackdrop.classList.add('open');
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        mobileBackdrop.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      };

      menuToggle.addEventListener('click', openDrawer);
      if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeDrawer);
      mobileBackdrop.addEventListener('click', closeDrawer);
    }

    // 3. Close Modals on backdrop click or close button
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // 4. Global Resilient Image Error Fallback Handler
    window.addEventListener('error', (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        const fallback = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85';
        if (e.target.src !== fallback) {
          e.target.onerror = null;
          e.target.src = fallback;
        }
      }
    }, true);
  }
};

window.UI = UI;

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
