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

  acquireWakeLock() {
    try {
      this.wakeLock = navigator.wakeLock.request("screen");
    } catch (e) {
      console.log(e);
    }
  },

  getWakelockStatus() {
    return this.wakeLock !== null;
  },
  
  async load() {
    const elements = uiElements.init();

    const config = cookieHandler.load(BING_AUTOSEARCH.config);
    BING_AUTOSEARCH.config = config;

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

    eventHandlers.setupEventListeners(
      elements,
      cookieHandler,
      BING_AUTOSEARCH.config
    );

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
