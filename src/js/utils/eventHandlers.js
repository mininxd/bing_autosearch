/**
 * Module for handling event listeners and UI interactions
 */

export const eventHandlers = {
  setupEventListeners: (elements, cookieHandler, searchConfig) => {
    elements.button.start.addEventListener("click", () => {
      elements.button.start.style.display = "none";
      elements.button.settings.style.display = "none";
      elements.button.warning.style.display = "none";
      elements.button.divSettings.style.display = "none";
      elements.button.stop.style.display = "inline-block";
      elements.div.timer.style.display = "block";
    });

    elements.button.stop.addEventListener("click", () => {});

    elements.select.multitab.addEventListener("change", () => {
      cookieHandler.set("_multitab_mode", elements.select.multitab.value, 365);
      location.reload();
    });

    elements.select.limit.addEventListener("change", () => {
      cookieHandler.set("_search_limit", elements.select.limit.value, 365);
      location.reload();
    });

    elements.select.interval.addEventListener("change", () => {
      cookieHandler.set("_search_interval", elements.select.interval.value, 365);
      location.reload();
    });

    elements.checkbox.wakelock.addEventListener("change", async () => {
      cookieHandler.set("_wakelock_enabled", elements.checkbox.wakelock.checked, 365);
      location.reload();
    });

    elements.select.categories.addEventListener("change", () => {
      const selectedCategories = Array.from(elements.select.categories.selectedOptions).map(option => option.value);
      cookieHandler.set("_search_categories", selectedCategories, 365);

      // Update search terms dynamically using the stored function
      try {
        if (window.BING_AUTOSEARCH && window.BING_AUTOSEARCH.searchTermsFunction) {
          const data = window.BING_AUTOSEARCH.searchTermsFunction();
          const newSearchTerms = selectedCategories.map(category => data[category] || []);
          window.BING_AUTOSEARCH.searchTerms = newSearchTerms;

          // Update the searchEngine terms lists
          window.searchEngine.terms.lists = newSearchTerms;
        }
      } catch (error) {
        console.error('Failed to update search terms:', error);
      }

      location.reload();
    });

    // Modal closing functionality - click outside to close
    const settingsModal = document.getElementById('modal-settings');
    const warningModal = document.getElementById('modal-warning');

    // Close settings modal when clicking outside
    if (settingsModal) {
      settingsModal.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
          settingsModal.classList.remove('modal-open');
        }
      });
    }

    // Close warning modal when clicking outside
    if (warningModal) {
      warningModal.addEventListener('click', function(event) {
        if (event.target === warningModal) {
          warningModal.classList.remove('modal-open');
        }
      });
    }

    // Handle modal close buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
    modalCloseButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Find the closest modal and close it
        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('modal-open');
        }
      });
    });

    // Handle modal open buttons
    const modalOpenButtons = document.querySelectorAll('.modal-open-btn');
    modalOpenButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetModalId = this.getAttribute('data-modal');
        const targetModal = document.getElementById(targetModalId);
        if (targetModal) {
          targetModal.classList.add('modal-open');
        }
      });
    });

  }
};