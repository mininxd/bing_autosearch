import "./localStorage.js";
import search_terms from "../data/search-terms.js";
import { cookieHandler } from "./config/cookieHandler.js";
import { uiElements } from "./modules/uiElements.js";
import { timerHandler } from "./modules/timerHandler.js";
import { searchEngine } from "./modules/searchEngine.js";
import { searchHandler, stopSearch } from "./modules/searchHandler.js";
import { eventHandlers } from "./utils/eventHandlers.js";

const BING_AUTOSEARCH = {
  config: {
    limit: 35,
    interval: 10000,
    multitab: true,
    wakelock: false,
    sequential: false,
    categories: ["games", "cars", "songs", "artists", "characters", "movies"],
  },
  isRunning: false,
  wakeLock: null,
  visibilityChangeHandler: null,
  focusHandler: null,
  searchTerms: "",
  searchTermsFunction: null,

  async acquireWakeLock() {
    try {
      // Release existing wake lock if present to avoid conflicts
      if (this.wakeLock) {
        await this.wakeLock.release();
        this.wakeLock = null;
      }

      this.wakeLock = await navigator.wakeLock.request("screen");

      // Set up rejection handler when the wake lock is released automatically
      this.wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
        this.wakeLock = null;

        // Automatically try to reacquire when released (if wakelock setting is still enabled)
        if (this.config.wakelock) {
          setTimeout(() => {
            this.acquireWakeLock();
          }, 1000);
        }
      });

      // Remove existing event listeners if they exist to avoid duplicates
      if (this.visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      }
      if (this.focusHandler) {
        window.removeEventListener('focus', this.focusHandler);
      }

      // Create bound event handlers
      this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
      this.focusHandler = this.handleWindowFocus.bind(this);

      // Add event listener to reacquire wake lock when visibility changes
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
      window.addEventListener('focus', this.focusHandler);
    } catch (e) {
      console.log(e);
      this.wakeLock = false;
    }
  },

  async handleVisibilityChange() {
    if (document.visibilityState === 'visible' && this.config.wakelock) {
      if (!this.wakeLock) {
        await this.acquireWakeLock();
      }
    }
  },

  async handleWindowFocus() {
    if (document.visibilityState === 'visible' && this.config.wakelock) {
      if (!this.wakeLock) {
        await this.acquireWakeLock();
      }
    }
  },


  getWakelockStatus() {
    // Return true if wake lock is active (not null or false)
    // The wakeLock is set to null in the release event handler when it's released
    return this.wakeLock !== null && this.wakeLock !== false;
  },
  
  async load() {
    const elements = uiElements.init();

    const config = cookieHandler.load(BING_AUTOSEARCH.config);
    BING_AUTOSEARCH.config = config;

    elements.select.interval.value = config.interval;
    elements.select.limit.value = config.limit;
    elements.select.multitab.value = (config.multitab !== undefined ? config.multitab : BING_AUTOSEARCH.config.multitab).toString();
    elements.checkbox.wakelock.checked = config.wakelock;

    // Set default selected categories if not already set in config
    if (config.categories && Array.isArray(config.categories)) {
      const categorySelect = document.getElementById('slc-categories');
      for (let option of categorySelect.options) {
        option.selected = config.categories.includes(option.value);
      }
    } else {
      // Default to all categories selected
      const categorySelect = document.getElementById('slc-categories');
      for (let option of categorySelect.options) {
        option.selected = true;
      }
      // Update config to include default categories
      BING_AUTOSEARCH.config.categories = ["games", "cars", "songs", "artists", "characters", "movies"];
    }

    try {
      const data = search_terms();
      // Store the search_terms function for later use
      BING_AUTOSEARCH.searchTermsFunction = search_terms;
      // Get selected categories from the UI after options are set
      const selectedCategories = Array.from(document.getElementById('slc-categories').selectedOptions).map(option => option.value);
      searchEngine.terms.lists = selectedCategories.map(category => data[category] || []);

    } catch (error) {
      console.error('Failed to load search terms:', error);
    }

    eventHandlers.setupEventListeners(
      elements,
      cookieHandler,
      BING_AUTOSEARCH.config
    );

    // Make searchEngine available globally for dynamic updates
    window.searchEngine = searchEngine;

    elements.button.start.addEventListener("click", async () => {
      await searchHandler.start(
        elements,
        BING_AUTOSEARCH.config,
        searchEngine,
        timerHandler,
        stopSearch
      );
    });

    elements.button.stop.addEventListener("click", () => {
      searchHandler.stop();
    });

    elements.div.settings.innerHTML = `${searchEngine.settings
      .toString(elements, BING_AUTOSEARCH)
      .replace(/\([^)]*\)/g, "")}`;
  }
};

window.addEventListener("load", async () => {
  await BING_AUTOSEARCH.load();
});
