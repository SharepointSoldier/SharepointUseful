
  document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".vertical-tab-item");
    const tabPanes = document.querySelectorAll(".vertical-tab-pane");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs and panes
        tabs.forEach((t) => t.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        // Add active class to the clicked tab and corresponding pane
        this.classList.add("active");
        const targetPane = document.getElementById(this.dataset.tab);
        targetPane.classList.add("active");
      });
    });
  });
