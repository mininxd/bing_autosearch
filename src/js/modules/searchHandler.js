/**
 * Module for handling search operations including generation and execution
 */

let isRunning = false;
let generatedSearches = [];

export const searchHandler = {
  generate: (searchConfig, searchEngine) => {
    let searches = new Array();
    let randomDelay = 0;

    do {
      // Use random terms from the selected categories
      let term = searchEngine.terms.random();
      let index = searches.length + 1;
      let url = `https://www.bing.com/search?q=${encodeURIComponent(term.toLowerCase())}&FORM=${searchEngine.form.random()}`;
      let delay = searchConfig.interval * searches.length;
      if (searchConfig.interval === 9999 && searches.length > 0)
        delay = randomDelay = ((Math.floor(Math.random() * 51) + 10) * 1000) + randomDelay;
      searches.push({ term, url, index, delay, interval: searchConfig.interval });
    } while (searches.length < searchConfig.limit)

    generatedSearches = [...searches];
    return searches;
  },

  getNextTerm: (currentIndex) => {
    // Find the next search that hasn't been executed yet
    const nextSearch = generatedSearches.find(search => search.index > currentIndex);
    return nextSearch ? nextSearch.term : '';
  },

  start: async (elements, searchConfig, searchEngine, timerHandler, stopSearch) => {
    isRunning = true;
    if (window.BING_AUTOSEARCH) {
      window.BING_AUTOSEARCH.isRunning = true;
    }

    // Reset term indices to ensure proper cycling
    searchEngine.terms.reset();

    let searches = searchHandler.generate(searchConfig, searchEngine);

    timerHandler.searchHandler = searchHandler;

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
          timerHandler.run(elements, searchConfig, searchEngine);
        if (!searchConfig.multitab)
          searchEngine.iframe.add(search, elements);
        else
          searchEngine.window.open(search);
      }, search.delay);
    });
  },

  stop: async () => {
    isRunning = false;
    if (window.BING_AUTOSEARCH) {
      window.BING_AUTOSEARCH.isRunning = false;
    }

    window.open("https://rewards.bing.com/pointsbreakdown");
    location.reload();
  }
};

export const stopSearch = async () => {
  await searchHandler.stop();
};