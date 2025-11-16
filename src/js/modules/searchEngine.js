/**
 * Module for search engine functionality including terms, forms, windows, iframes, etc.
 */

export const searchEngine = {
  terms: {
    lists: [],
    random: () => {
      let list = searchEngine.terms.lists[Math.floor(Math.random() * searchEngine.terms.lists.length)];
      let term = list[Math.floor(Math.random() * list.length)];
      return term;
    }
  },
  
  form: {
    params: [
      "QBLH", "QBRE", "HDRSC1", "LGWQS1", "LGWQS2", "LGWQS3", "R5FD", "R5FD1", "R5FD2", "R5FD3", "R5FD4", "R5FD5", "R5FD6", "R5FD7", "QSRE1", "QSRE2", "QSRE3", "QSRE4", "QSRE5", "QSRE6", "QSRE7", "QSRE8"
    ],
    random: () => {
      return searchEngine.form.params[Math.floor(Math.random() * searchEngine.form.params.length)]
    }
  },
  
  window: {
    open: (search) => {
      try {
        let w = window.open(search.url);
        if (w) {
          setTimeout(() => {
            w.close();
          }, (search.interval <= 10000 && search.interval !== 9999 ? search.interval : 10000) - 500);
        }
      }
      catch (e) { 
        console.warn('Error opening window:', e);
      }
    }
  },
  
  iframe: {
    add: (search, elements) => {
      let iframe = document.createElement("iframe");
      iframe.setAttribute("src", search.url);
      iframe.setAttribute("title", search.term);
      iframe.setAttribute("data-index", search.index);
      if (elements.div.bing.firstChild)
        elements.div.bing.removeChild(elements.div.bing.firstChild);
      elements.div.bing.appendChild(iframe);
    }
  },
  
  settings: {
  toString: (elements, BING_AUTOSEARCH) => {
    try {
      if (elements.checkbox.wakelock.checked) {
        BING_AUTOSEARCH.acquireWakeLock();
      }

      let multitabText = "";
      let wakelockText = "";

      const isMultitab =
        elements.select.multitab.options[
          elements.select.multitab.selectedIndex
        ].value;

      const isWakelock = elements.checkbox.wakelock.checked;

      const waitForTooltip = setInterval(() => {
        const wakeLockStatus = document.getElementById("wakeLockStatus");
        if (!wakeLockStatus) return;

        wakeLockStatus.innerHTML =
          `<span class="loading loading-spinner loading-xs"></span>`;

        clearInterval(waitForTooltip);
      }, 50);

      let i = 0;
      const wakeLockInterval = setInterval(() => {
        i++;
        const wakeLockStatus = document.getElementById("wakeLockStatus");
        if (!wakeLockStatus) return;
        const isUp = BING_AUTOSEARCH.getWakelockStatus();

        if (!isUp) {
          wakeLockStatus.innerText = "Wake Lock Deactivated";
        } else {
          wakeLockStatus.innerText = "Wake Lock Active";
        }

        if (i === 5) {
          clearInterval(wakeLockInterval);
        }
      }, 2500);

      if (isWakelock) {
        wakelockText = `
        <div class="px-2 badge">Wake Lock 
          <div class="tooltip">
            <div id="wakeLockStatus" class="tooltip-content"></div>
            <i class="fa fa-solid fa-circle-info"></i>
          </div>
        </div>`;
      }

      if (isMultitab === "true") {
        multitabText = `<div class="px-2 badge">Multi-tab Mode</div>`;
      }

      return `
      <br>
      <div class="gap-1 justify-center flex flex-wrap">
        <div class="px-2 badge">
          ${
            elements.select.limit.options[
              elements.select.limit.selectedIndex
            ].text.replace(/^0+/, "")
          }
        </div>

        <div class="px-2 badge">
          ${
            elements.select.interval.options[
              elements.select.interval.selectedIndex
            ].text.replace(/^0+/, "")
          } interval
        </div>

        ${multitabText}
        ${wakelockText}
      </div>`;
    } catch (e) {
      console.log(e);
      return `Oops! There was an error loading the settings, please clear your browser cookies and reload the page to continue`;
    }
  }
},
  
  progress: {
    update: (search, elements, searchConfig) => {
      let progress = `(${search.index < 10 ? "0" + search.index : search.index}/${searchConfig.limit < 10 ? "0" + searchConfig.limit : searchConfig.limit})`;
      document.title = `${progress} - Bing Auto Search Running`;
      elements.span.progress.innerText = progress;
    }
  }
};