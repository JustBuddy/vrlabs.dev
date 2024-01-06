document.addEventListener("astro:page-load", () => {
    prepareNavbar();
    colorCurrentPage();
});

function prepareNavbar() {
    const openButton = document.querySelector(".nav-buttonOpen");
    const closeButton = document.querySelector(".nav-buttonClose");
    const navMobile = document.querySelector(".nav-mobile");
    const backdrop = document.querySelector(".backdrop");

    openButton.addEventListener("click", () => {
        navMobile.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");

        backdrop.setAttribute("data-state", "opened");
        backdrop.style.zIndex = 40;
        backdrop.onclick = function () {
            closeButton.click();
        };
    });

    closeButton.addEventListener("click", () => {
        navMobile.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");

        backdrop.setAttribute("data-state", "closed");
    });
}

function colorCurrentPage() {
    const navLinks = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPath) link.classList.add("text-action");
    });
}