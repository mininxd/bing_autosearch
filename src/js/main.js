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
    wakelock: false
  },
  isRunning: false,
  wakeLock: null,

  async acquireWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock released');
        });
        console.log('Screen Wake Lock acquired');
        return true;
      } else {
        console.warn('Wake Lock API not supported by this browser');
        return false;
      }
    } catch (err) {
      console.error(`Failed to acquire Wake Lock: ${err.message}`);
      return false;
    }
  },

  async releaseWakeLock() {
    if (this.wakeLock !== null) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        console.log('Screen Wake Lock released');
      } catch (err) {
        console.error(`Failed to release Wake Lock: ${err.message}`);
      }
    }
  },

  async load() {
    // Initialize UI elements
    const elements = uiElements.init();

    // Load configuration from cookies
    const config = cookieHandler.load(BING_AUTOSEARCH.config);
    BING_AUTOSEARCH.config = config;

    // Update select values to match loaded config
    elements.select.interval.value = config.interval;
    elements.select.limit.value = config.limit;
    elements.select.multitab.value = config.multitab.toString();
    elements.checkbox.wakelock.checked = config.wakelock;

    try {
      const data = search_terms();
      searchEngine.terms.lists = Object.values(data);
    } catch (error) {
      console.error('Failed to load search terms:', error);
    }

    // Setup event handlers
    eventHandlers.setupEventListeners(elements, cookieHandler, BING_AUTOSEARCH.config);

    // Add specific start button handler
    elements.button.start.addEventListener("click", () => {
      searchHandler.start(elements, BING_AUTOSEARCH.config, searchEngine, timerHandler, stopSearch);
    });

    // Add stop button handler
    elements.button.stop.addEventListener("click", () => {
      searchHandler.stop();
    });

    // Set up settings display
    elements.div.settings.innerHTML = `${searchEngine.settings.toString(elements).replace(/\([^)]*\)/g, "")}`;
  }
};

window.addEventListener("load", async () => {
  await BING_AUTOSEARCH.load();
});
