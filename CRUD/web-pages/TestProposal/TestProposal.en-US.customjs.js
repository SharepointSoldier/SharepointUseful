// scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const downloadButtons = document.querySelectorAll(".download-btn");
  const openButtons = document.querySelectorAll(".open-btn");

  downloadButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log("Download button clicked!");
    });
  });

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log("Open button clicked!");
    });
  });
});
