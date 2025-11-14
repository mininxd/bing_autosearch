const btn_warning = document.getElementById("btn-settings-warning");
const btn_warning_close = document.getElementById("btn-settings-warning-close");

btn_warning_close.addEventListener("click", () => {
  localStorage.setItem("hide-warning", "true");
  btn_warning.classList.add("hidden");
})

if(localStorage.getItem("hide-warning") == "true") {
  btn_warning.classList.add("hidden");
}
