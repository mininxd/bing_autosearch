/**
 * Module for handling event listeners and UI interactions
 */

export const eventHandlers = {
  setupEventListeners: (elements, cookieHandler, searchConfig) => {
    // Track if any settings have changed
    let settingsChanged = false;

    // Store original values to compare against
    const originalValues = {
      multitab: elements.select.multitab.value,
      limit: elements.select.limit.value,
      interval: elements.select.interval.value,
      wakelock: elements.checkbox.wakelock.checked,
      categories: Array.from(document.querySelectorAll('#slc-categories input[name="categories"]:checked')).map(checkbox => checkbox.value)
    };

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
      if (elements.select.multitab.value !== originalValues.multitab) {
        settingsChanged = true;
      }
    });

    elements.select.limit.addEventListener("change", () => {
      cookieHandler.set("_search_limit", elements.select.limit.value, 365);
      if (elements.select.limit.value !== originalValues.limit) {
        settingsChanged = true;
      }
    });

    elements.select.interval.addEventListener("change", () => {
      cookieHandler.set("_search_interval", elements.select.interval.value, 365);
      if (elements.select.interval.value !== originalValues.interval) {
        settingsChanged = true;
      }
    });

    elements.checkbox.wakelock.addEventListener("change", async () => {
      cookieHandler.set("_wakelock_enabled", elements.checkbox.wakelock.checked, 365);
      if (elements.checkbox.wakelock.checked !== originalValues.wakelock) {
        settingsChanged = true;
      }
    });

    // Handle form change for categories checkboxes
    const categoryForm = document.getElementById('slc-categories');
    if (categoryForm) {
      categoryForm.addEventListener("change", () => {
        const selectedCheckboxes = categoryForm.querySelectorAll('input[name="categories"]:checked');
        const selectedCategories = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

        // Only save to cookie if at least one category is selected
        if (selectedCategories.length > 0) {
          cookieHandler.set("_search_categories", selectedCategories, 365);
        }

        // Check if categories have changed
        const currentCategories = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
        const originalCategoriesSet = new Set(originalValues.categories);
        const currentCategoriesSet = new Set(currentCategories);
        const categoriesChanged = originalCategoriesSet.size !== currentCategoriesSet.size ||
          ![...originalCategoriesSet].every(cat => currentCategoriesSet.has(cat)) ||
          ![...currentCategoriesSet].every(cat => originalCategoriesSet.has(cat));

        if (categoriesChanged) {
          settingsChanged = true;
        }

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

        // Update the category message display
        if (typeof updateCategoryMessage === 'function') {
          updateCategoryMessage();
        }
      });
    }

    // Modal closing functionality - click outside to close
    const settingsModal = document.getElementById('modal-settings');
    const warningModal = document.getElementById('modal-warning');

    // Close settings modal when clicking outside
    if (settingsModal) {
      settingsModal.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
          // Check if any categories are selected
          const categoryForm = document.getElementById('slc-categories');
          const checkboxes = categoryForm.querySelectorAll('input[name="categories"]');
          const selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

          // Prevent closing if no categories are selected
          if (selectedCheckboxes.length === 0) {
            // Show the categories message if hidden
            if (typeof updateCategoryMessage === 'function') {
              updateCategoryMessage();
            }

            // Prevent closing the modal
            return;
          }

          settingsModal.classList.remove('modal-open');
          // Reload page if settings have changed
          if (settingsChanged) {
            location.reload();
          }
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
        if (modal && modal.id === 'modal-settings') {
          // Check if any categories are selected
          const categoryForm = document.getElementById('slc-categories');
          const checkboxes = categoryForm.querySelectorAll('input[name="categories"]');
          const selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

          // Prevent closing if no categories are selected
          if (selectedCheckboxes.length === 0) {
            // Show the categories message if hidden
            if (typeof updateCategoryMessage === 'function') {
              updateCategoryMessage();
            }

            // Prevent closing the modal
            return;
          }

          // Reload page if settings have changed
          if (settingsChanged) {
            location.reload();
          }
        }
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

          // If this is the settings modal, update the category message visibility
          if (targetModalId === 'modal-settings') {
            if (typeof updateCategoryMessage === 'function') {
              updateCategoryMessage();
            }
          }
        }
      });
    });

  }
};