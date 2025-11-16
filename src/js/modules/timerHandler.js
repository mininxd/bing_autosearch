/**
 * Module for handling timer functionality
 */

export const timerHandler = {
  next: null,
  complete: null,
  
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
  },
  
  run: (elements, searchConfig) => {
    let now = new Date();
    let next = (timerHandler.next - now);
    let complete = (timerHandler.complete - now);
    if (searchConfig.interval === 9999) {
      elements.div.timer.innerHTML = `<div class="">
      10~60 seconds (random) auto search interval active.
      </div>`;
    }
    else if (complete >= 0) {
      elements.div.timer.innerHTML = `${next >= 0 ? `<div class="flex flex-wrap justify-center gap-1">
      <div class="badge pr-0">Next auto search in: <div class="badge badge-success mx-0 translate-x-[2px]">
      ${timerHandler.toClockFormat(next)}</div></div>` : "Finishing last auto search"} <br> <div class="badge pr-0">Auto Search ends in: <div class="badge badge-success mx-0 translate-x-[2px]"> ${timerHandler.toClockFormat(complete, true)}</div></div></div>`;
      setTimeout(() => {
        timerHandler.run(elements, searchConfig);
      }, 1000);
    }
    else {
      elements.div.timer.innerHTML = `<strong>Stopping the auto search process...</strong>`;
    }
  }
};