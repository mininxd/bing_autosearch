import uiElements from "./modules/uiElements.js";

import "./localStorage.js";
import { cookieHandler } from "./config/cookieHandler.js";
import { timerHandler } from "./modules/timerHandler.js";
import { searchEngine } from "./modules/searchEngine.js";
import { searchHandler, stopSearch } from "./modules/searchHandler.js";
import { eventHandlers } from "./utils/eventHandlers.js";

const BING_AUTOSEARCH = {
  config: {
    limit: 35,
    interval: 10000,
    wakelock: false,
    newRewardsUI: false,
    sequential: false,
    categories: [], // Will be populated dynamically
  },
  isRunning: false,
  wakeLock: null,
  visibilityChangeHandler: null,
  focusHandler: null,
  searchTerms: "",
  searchTermsData: {}, // Store loaded data here

  async acquireWakeLock() {
    try {
      // Release existing wake lock if present to avoid conflicts
      if (this.wakeLock) {
        await this.wakeLock.release();
        this.wakeLock = null;
      }

      this.wakeLock = await navigator.wakeLock.request("screen");

      // Set up rejection handler when the wake lock is released automatically
      this.wakeLock.addEventListener("release", () => {
        console.log("Wake Lock was released");
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
        document.removeEventListener(
          "visibilitychange",
          this.visibilityChangeHandler,
        );
      }
      if (this.focusHandler) {
        window.removeEventListener("focus", this.focusHandler);
      }

      // Create bound event handlers
      this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
      this.focusHandler = this.handleWindowFocus.bind(this);

      // Add event listener to reacquire wake lock when visibility changes
      document.addEventListener(
        "visibilitychange",
        this.visibilityChangeHandler,
      );
      window.addEventListener("focus", this.focusHandler);
    } catch (e) {
      console.log(e);
      this.wakeLock = false;
    }
  },

  async handleVisibilityChange() {
    if (document.visibilityState === "visible" && this.config.wakelock) {
      if (!this.wakeLock) {
        await this.acquireWakeLock();
      }
    }
  },

  async handleWindowFocus() {
    if (document.visibilityState === "visible" && this.config.wakelock) {
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

  async loadSearchTerms() {
    const modules = import.meta.glob("../data/search_*.js", { eager: true });
    const data = {};

    for (const path in modules) {
      // Extract category name from filename: ../data/search_games.js -> games
      const category = path
        .split("/")
        .pop()
        .replace("search_", "")
        .replace(".js", "");
      data[category] = modules[path].default;
    }

    this.searchTermsData = data;
    return data;
  },

  async load() {
    const elements = uiElements.init();

    // Load search terms first to know available categories
    const data = await this.loadSearchTerms();
    const availableCategories = Object.keys(data);

    // Dynamically generate checkboxes for categories
    const categoryForm = document.getElementById("slc-categories");
    categoryForm.innerHTML = ""; // Clear existing content

    availableCategories.forEach((category) => {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "categories";
      input.value = category;
      input.className = "btn btn-sm";
      input.setAttribute(
        "aria-label",
        category.charAt(0).toUpperCase() + category.slice(1),
      );
      categoryForm.appendChild(input);
    });

    const config = cookieHandler.load(BING_AUTOSEARCH.config);
    // Ensure loaded categories are valid (exist in availableCategories)
    if (config.categories) {
      config.categories = config.categories.filter((c) =>
        availableCategories.includes(c),
      );
    }
    BING_AUTOSEARCH.config = config;

    elements.select.interval.value = config.interval;
    elements.select.limit.value = config.limit;
    elements.checkbox.wakelock.checked = config.wakelock;
    elements.checkbox.newRewardsUI.checked = config.newRewardsUI;

    // Set default selected categories if not already set in config
    if (
      config.categories &&
      Array.isArray(config.categories) &&
      config.categories.length > 0
    ) {
      const checkboxes = categoryForm.querySelectorAll(
        'input[name="categories"]',
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = config.categories.includes(checkbox.value);
      });
    } else {
      // Default to all categories selected
      const checkboxes = categoryForm.querySelectorAll(
        'input[name="categories"]',
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
      // Update config to include default categories
      BING_AUTOSEARCH.config.categories = availableCategories;
    }

    // Initialize categories message visibility and add individual checkbox listeners for live detection
    updateCategoryMessage();

    // Add individual event listeners to each checkbox for immediate feedback
    const checkboxes = categoryForm.querySelectorAll(
      'input[name="categories"]',
    );

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateCategoryMessage);
    });

    try {
      // Get selected categories from the UI after options are set
      const selectedCheckboxes = categoryForm.querySelectorAll(
        'input[name="categories"]:checked',
      );
      const selectedCategories = Array.from(selectedCheckboxes).map(
        (checkbox) => checkbox.value,
      );
      searchEngine.terms.lists = selectedCategories.map(
        (category) => data[category] || [],
      );
    } catch (error) {
      console.error("Failed to load search terms:", error);
    }

    eventHandlers.setupEventListeners(
      elements,
      cookieHandler,
      BING_AUTOSEARCH.config,
    );

    // Make searchEngine and BING_AUTOSEARCH available globally
    window.searchEngine = searchEngine;
    window.BING_AUTOSEARCH = BING_AUTOSEARCH;

    elements.button.start.addEventListener("click", async () => {
      await searchHandler.start(
        elements,
        BING_AUTOSEARCH.config,
        searchEngine,
        timerHandler,
        stopSearch,
      );
    });

    elements.button.stop.addEventListener("click", () => {
      searchHandler.stop();
    });

    elements.div.settings.innerHTML = `${searchEngine.settings
      .toString(elements, BING_AUTOSEARCH)
      .replace(/\([^)]*\)/g, "")}`;
  },
};

// Function to check if any categories are selected and update message visibility
function updateCategoryMessage() {
  const categoryForm = document.getElementById("slc-categories");
  const checkboxes = categoryForm.querySelectorAll('input[name="categories"]');
  const selectedCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked,
  );
  const categoriesMsg = document.getElementById("categoriesMsg");

  // Show message if no categories are selected
  if (selectedCheckboxes.length === 0) {
    categoriesMsg.style.display = "block";
  } else {
    categoriesMsg.style.display = "none";
  }
}

window.addEventListener("load", async () => {
  await BING_AUTOSEARCH.load();
});
