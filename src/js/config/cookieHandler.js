/**
 * Module for handling cookies
 */

export const cookieHandler = {
  set: (name, value, expires) => {
    try {
      // If value is an array, serialize it as JSON
      let serializedValue = Array.isArray(value)
        ? JSON.stringify(value)
        : value;
      let d = new Date();
      d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
      let cookie = `${name}=${serializedValue};expires=${d.toUTCString()};path=/`;
      document.cookie = cookie;
    } catch (e) {
      console.warn("Error setting cookie:", e);
    }
  },

  get: (name) => {
    let value = null;
    try {
      let cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        if ((cookie + "=").trim().indexOf(name) == 0) {
          value = cookie.substring(name.length + 2, cookie.length);

          // Try to parse as JSON if it looks like an array
          try {
            if (value && value.startsWith("[") && value.endsWith("]")) {
              value = JSON.parse(value);
            }
          } catch (e) {
            // If parsing fails, leave value as string
          }
        }
      });
    } catch (e) {
      console.warn("Error getting cookie:", e);
    }
    return { name, value };
  },

  load: (defaultConfig) => {
    const _need_help = cookieHandler.get("_need_help");
    const _search_interval = cookieHandler.get("_search_interval");
    const _search_limit = cookieHandler.get("_search_limit");
    const _wakelock_enabled = cookieHandler.get("_wakelock_enabled");
    const _new_rewards_ui = cookieHandler.get("_new_rewards_ui");
    const _sequential_enabled = cookieHandler.get("_sequential_enabled");
    const _search_categories = cookieHandler.get("_search_categories");

    let config = { ...defaultConfig };

    if (!_need_help.value) {
      cookieHandler.set("_need_help", "true", 365);
    }

    if (!_search_interval.value) {
      cookieHandler.set(
        "_search_interval",
        (config.interval !== undefined
          ? config.interval
          : defaultConfig.interval
        ).toString(),
        365,
      );
    } else {
      config.interval = parseInt(_search_interval.value || config.interval);
    }

    if (!_search_limit.value) {
      cookieHandler.set(
        "_search_limit",
        (config.limit !== undefined
          ? config.limit
          : defaultConfig.limit
        ).toString(),
        365,
      );
    } else {
      config.limit = parseInt(_search_limit.value || config.limit);
    }

    if (!_wakelock_enabled.value) {
      cookieHandler.set(
        "_wakelock_enabled",
        (config.wakelock !== undefined
          ? config.wakelock
          : defaultConfig.wakelock
        ).toString(),
        365,
      );
    } else {
      config.wakelock = _wakelock_enabled.value === "true";
    }

    if (!_new_rewards_ui.value) {
      cookieHandler.set(
        "_new_rewards_ui",
        (config.newRewardsUI !== undefined
          ? config.newRewardsUI
          : defaultConfig.newRewardsUI
        ).toString(),
        365,
      );
    } else {
      config.newRewardsUI = _new_rewards_ui.value === "true";
    }

    if (!_sequential_enabled.value) {
      cookieHandler.set(
        "_sequential_enabled",
        (config.sequential !== undefined
          ? config.sequential
          : defaultConfig.sequential
        ).toString(),
        365,
      );
    } else {
      config.sequential = _sequential_enabled.value === "true";
    }

    // Handle categories
    if (!_search_categories.value) {
      cookieHandler.set(
        "_search_categories",
        config.categories || [
          "games",
          "cars",
          "songs",
          "artists",
          "characters",
          "movies",
        ],
        365,
      );
    } else if (Array.isArray(_search_categories.value)) {
      config.categories = _search_categories.value;
    }

    return config;
  },
};
