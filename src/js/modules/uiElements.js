/**
 * Module for managing UI elements and DOM references
 */

export const uiElements = {
  init: () => {
    return {
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
        multitab: document.getElementById("slc-multitab"),
        categories: document.getElementById("slc-categories"),
      },
      checkbox: {
        wakelock: document.getElementById("chk-wakelock")
      },
      span: {
        progress: document.getElementById("span-progress"),
      },
      div: {
        settings: document.getElementById("div-settings"),
        timer: document.getElementById("div-timer"),
        bing: document.getElementById("div-bing")
      }
    };
  }
};