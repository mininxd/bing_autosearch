/**
 * Module for handling search operations including generation and execution
 */

let isRunning = false;

export const searchHandler = {
  generate: (searchConfig, searchEngine) => {
    let searches = new Array();
    let randomDelay = 0;
    do {
      let term = searchEngine.terms.random();
      if (!searches.includes(term)) {
        let index = searches.length + 1;
        let url = `https://www.bing.com/search?q=${encodeURIComponent(term.toLowerCase())}&FORM=${searchEngine.form.random()}`;
        let delay = searchConfig.interval * searches.length;
        if (searchConfig.interval === 9999 && searches.length > 0)
          delay = randomDelay = ((Math.floor(Math.random() * 51) + 10) * 1000) + randomDelay;
        searches.push({ term, url, index, delay, interval: searchConfig.interval });
      }
    } while (searches.length < searchConfig.limit)
    return searches;
  },

  start: (elements, searchConfig, searchEngine, timerHandler, stopSearch) => {
    // Set running flag
    isRunning = true;
    window.BING_AUTOSEARCH.isRunning = true;

    let searches = searchHandler.generate(searchConfig, searchEngine);

    // Attempt to acquire wake lock if enabled
    if (elements.checkbox.wakelock.checked) {
      window.BING_AUTOSEARCH.acquireWakeLock();
    }

    searches.forEach((search) => {
      setTimeout(() => {
        searchEngine.progress.update(search, elements, searchConfig);
        timerHandler.updateEstimatedTime(search, searchConfig);
        if (search.index === searchConfig.limit) {
          setTimeout(() => {
            stopSearch();
          }, (search.interval <= 10000 && searchConfig.interval !== 9999 ? search.interval : 10000));
        }
        if (search.delay === 0)
          timerHandler.run(elements, searchConfig);
        if (!searchConfig.multitab)
          searchEngine.iframe.add(search, elements);
        else
          searchEngine.window.open(search);
      }, search.delay);
    });
  },

  stop: () => {
    // Set running flag
    isRunning = false;
    window.BING_AUTOSEARCH.isRunning = false;

    // Release wake lock if it was acquired
    window.BING_AUTOSEARCH.releaseWakeLock();

    window.open("https://rewards.bing.com/pointsbreakdown");
    location.reload();
  }
};

// Export the stop function separately so it can be called directly
export const stopSearch = () => {
  searchHandler.stop();
};