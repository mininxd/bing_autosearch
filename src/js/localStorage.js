const warningState = {
  init: () => {
    const btn_warning = document.getElementById("btn-settings-warning");
    const btn_warning_close = document.getElementById("btn-settings-warning-close");
    btn_warning_close.addEventListener("click", () => {
      localStorage.setItem("hide-warning", "true");
      btn_warning.classList.add("hidden");
    })

    if(localStorage.getItem("hide-warning") == "true") {
      btn_warning.classList.add("hidden");
    }
  }
};
const wakeLockHandler = {
  init: () => {
  const checkbox = document.getElementById("chk-wakelock");
  
  checkbox.addEventListener("input", () => {
    localStorage.setItem("wakelock-check", "true");
  });
  
  if(localStorage.getItem("wakelock-check") == "true") {
    checkbox.checked = true;
    }
}
};


warningState.init();
wakeLockHandler.init();