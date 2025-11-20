/**
 * Module for handling timer functionality
 */

export const timerHandler = {
  next: null,
  complete: null,
  currentSearchIndex: 0,
  
  toClockFormat: (milliseconds, showHours = false) => {
    let hrs = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    let min = Math.floor((milliseconds / 1000 / 60) % 60);
    let sec = Math.floor((milliseconds / 1000) % 60);
    return `${showHours ? String(hrs).padStart(2, '0') + ":" : ""}${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },
  
  updateEstimatedTime: (search, searchConfig) => {
    let now = new Date();
    let next = new Date(now.getTime() + searchConfig.interval);
    let complete = new Date(now.getTime() + (searchConfig.interval * (searchConfig.limit - search.index)));
    if (search.index === searchConfig.limit)
      next = now;
    timerHandler.next = next;
    timerHandler.complete = complete;
    timerHandler.currentSearchIndex = search.index;
  },
  
  run: (elements, searchConfig, searchEngine) => {
    let now = new Date();
    let next = (timerHandler.next - now);
    let complete = (timerHandler.complete - now);
    if (searchConfig.interval === 9999) {
      elements.div.timer.innerHTML = `<div class="">
      10~60 seconds (random) auto search interval active.
      </div>`;
    }
    else if (complete >= 0) {
      let nextTerm = '';
      let nextTermTruncated = '';
      let nextTermIsTruncated = false;
      if (timerHandler.searchHandler && timerHandler.searchHandler.getNextTerm) {
        nextTerm = timerHandler.searchHandler.getNextTerm(timerHandler.currentSearchIndex);
        if (nextTerm.length > 16) {
          nextTermIsTruncated = true;
          nextTermTruncated = nextTerm.substring(0, 16) + '...';
        } else {
          nextTermIsTruncated = false;
          nextTermTruncated = nextTerm;
        }
      }

      if (!elements.div.timer.querySelector('.next-search-timer')) {
        elements.div.timer.innerHTML = `
          <div class="next-search-timer-container">
            <div class="next-search-timer flex flex-wrap justify-center gap-1 pb-1">
              <div class="badge pr-0">
                Next auto search in
                <div class="badge badge-success mx-0 translate-x-[2px]">
                  00:00
                </div>
              </div>
            </div>
          </div>
          <div class="complete-timer-container">
            <div class="complete-timer flex flex-wrap justify-center gap-1 pb-1">
              <div class="badge pr-0">
                Auto search ends in
                <div class="badge badge-success mx-0 translate-x-[2px]">
                  00:00:00
                </div>
              </div>
            </div>
          </div>
          <div class="next-terms-container">
            <div class="next-terms flex flex-wrap justify-center gap-1 pb-1">
              <div class="badge pr-0">
                Next search terms
                <div class="badge badge-success mx-0 translate-x-[2px] px-2">
                  <span class="next-term-text">${nextTermTruncated}</span>
                  ${nextTermIsTruncated ? `<div class="tooltip tooltip-left tooltip-neutral" data-tip="${nextTerm}">
                    <i class="fa fa-solid fa-circle-info"></i>
                  </div>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      const nextSearchTimer = elements.div.timer.querySelector('.next-search-timer');
      const completeTimer = elements.div.timer.querySelector('.complete-timer');
      const nextTermElement = elements.div.timer.querySelector('.next-term-text');
      const tooltip = elements.div.timer.querySelector('.tooltip');

      if (next >= 0) {
        nextSearchTimer.innerHTML = `
          <div class="flex flex-wrap justify-center gap-1 pb-1">
            <div class="badge pr-0">
              Next auto search in
              <div class="badge badge-success mx-0 translate-x-[2px]">
                ${timerHandler.toClockFormat(next)}
              </div>
            </div>
          </div>
        `;
      } else {
        nextSearchTimer.innerHTML = "Finishing last auto search";
      }

      completeTimer.innerHTML = `
        <div class="flex flex-wrap justify-center gap-1 pb-1">
          <div class="badge pr-0">
            Auto search ends in
            <div class="badge badge-success mx-0 translate-x-[2px]">
              ${timerHandler.toClockFormat(complete, true)}
            </div>
          </div>
        </div>
      `;

      if (nextTermElement) {
        nextTermElement.textContent = nextTermTruncated;

        const tooltipContainer = elements.div.timer.querySelector('.next-terms .badge');
        const existingTooltip = elements.div.timer.querySelector('.tooltip');

        if (nextTermIsTruncated) {
          if (!existingTooltip) {
            const tooltipHTML = `<div class="tooltip tooltip-left tooltip-neutral" data-tip="${nextTerm}">
              <i class="fa fa-solid fa-circle-info"></i>
            </div>`;
            nextTermElement.insertAdjacentHTML('afterend', tooltipHTML);
          } else {
            existingTooltip.setAttribute('data-tip', nextTerm);
            existingTooltip.style.display = 'inline';
          }
        } else {
          if (existingTooltip) {
            existingTooltip.remove();
          }
        }
      }

      setTimeout(() => {
        timerHandler.run(elements, searchConfig, searchEngine);
      }, 1000);
    }
    else {
      elements.div.timer.innerHTML = `<strong>Stopping the auto search process...</strong>`;
    }
  }
};