/**
 * MAISON SUCRE — BESPOKE CUSTOM CAKE STUDIO CONTROLLER
 * Handles Custom Cake Commission Requests & Supabase Submissions
 */

class BespokeStudioController {
  constructor() {
    this.occasion = 'Wedding';
    this.guestCount = '25-40 guests';
    this.styleTheme = 'Pastel Blush & Lilac Atelier';
    this.init();
  }

  init() {
    // 1. Min allowable date for bespoke cake (at least 7 days ahead for custom artistry)
    const dateInput = document.getElementById('bespoke-event-date');
    if (dateInput) {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 5);
      dateInput.min = minDate.toISOString().split('T')[0];
    }

    // 2. Interactive Selection Cards
    this.setupVisualCards('.occasion-card', 'data-occasion', (val) => this.occasion = val);
    this.setupVisualCards('.guest-card', 'data-guests', (val) => this.guestCount = val);
    this.setupVisualCards('.style-card', 'data-style', (val) => this.styleTheme = val);

    // 3. Form Submission
    const form = document.getElementById('bespoke-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  setupVisualCards(selector, dataAttr, callback) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const val = card.getAttribute(dataAttr);
        callback(val);
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('bespoke-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Custom Commission...';
    }

    const form = document.getElementById('bespoke-form');
    const formData = new FormData(form);

    const customerName = formData.get('customer_name')?.toString().trim();
    const customerPhone = formData.get('customer_phone')?.toString().trim();
    const customerEmail = formData.get('customer_email')?.toString().trim();
    const eventDate = formData.get('event_date')?.toString();
    const flavorPreference = formData.get('flavor_preference')?.toString().trim();
    const budgetRange = formData.get('budget_range')?.toString();
    const referenceUrl = formData.get('reference_image_url')?.toString().trim();
    const notes = formData.get('notes')?.toString().trim();

    if (!customerName || !customerPhone || !customerEmail || !eventDate || !flavorPreference) {
      window.UI.showToast('Please fill in all required contact and date fields.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Custom Cake Request';
      }
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      occasion: this.occasion,
      guest_count: this.guestCount,
      style_theme: this.styleTheme,
      flavor_preference: flavorPreference,
      event_date: eventDate,
      budget_range: budgetRange || '$300 - $600',
      reference_image_url: referenceUrl,
      notes: notes
    };

    try {
      const createdRequest = await window.db.createCustomRequest(payload);

      // Show Confirmation Dialog
      const modalRefNum = document.getElementById('bespoke-conf-ref');
      if (modalRefNum) modalRefNum.textContent = createdRequest.request_number || createdRequest.id;

      window.UI.openModal('bespoke-success-modal');
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Custom Cake Request';
      }
    } catch (err) {
      console.error('Bespoke request failed:', err);
      window.UI.showToast('Could not submit inquiry. Please try again.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Custom Cake Request';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bespoke-form')) {
    new BespokeStudioController();
  }
});
