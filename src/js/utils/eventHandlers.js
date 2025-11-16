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

    elements.button.stop.addEventListener("click", () => {
      // The stop function will be called from searchHandler
    });

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
  }
};