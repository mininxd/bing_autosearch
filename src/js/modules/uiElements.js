/**
 * Module for managing UI elements and DOM references
 */

const uiElements = {
  init: () => {
    return {
      image: {
        banner: document.getElementById("banner-image"),
      },
      button: {
        start: document.getElementById("btn-start"),
        stop: document.getElementById("btn-stop"),
        settings: document.getElementById("btn-settings"),
        warning: document.getElementById("btn-settings-warning"),
        divSettings: document.getElementById("div-settings"),
      },
      select: {
        limit: document.getElementById("slc-limit"),
        interval: document.getElementById("slc-interval"),
        categories: document.getElementById("slc-categories"),
      },
      checkbox: {
        wakelock: document.getElementById("chk-wakelock"),
        newRewardsUI: document.getElementById("chk-new-rewards-ui"),
      },
      span: {
        progress: document.getElementById("span-progress"),
      },
      div: {
        settings: document.getElementById("div-settings"),
        timer: document.getElementById("div-timer"),
      },
    };
  },
};

export default uiElements;
