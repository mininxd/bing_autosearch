const btn_warning = document.getElementById("btn-warning");
const btn_warning_close = document.getElementById("btn-warning-close");

btn_warning_close.addEventListener("click", () => {
  localStorage.setItem("hide-warning", "true");
  window.location.reload();
})

if(localStorage.getItem("hide-warning") == "true") {
  btn_warning.classList.add("hidden");
}
