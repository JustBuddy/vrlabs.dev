import { openBackdrop, closeBackdrop } from "./backdrop.js";

document.addEventListener("astro:page-load", () => {
    prepareNavbar();
    colorCurrentPage();
});

function prepareNavbar() {
    const openButton = document.querySelector(".nav-buttonOpen");
    const closeButton = document.querySelector(".nav-buttonClose");
    const navMobile = document.querySelector(".nav-mobile");

    openButton.addEventListener("click", () => {
        navMobile.classList.remove("hidden");
        openBackdrop(40, () => { closeButton.click(); });
    });

    closeButton.addEventListener("click", () => {
        navMobile.classList.add("hidden");
        closeBackdrop();
    });
}

function colorCurrentPage() {
    const navLinks = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
        link.classList.remove("text-action");
        if (link.getAttribute("href") === currentPath) link.classList.add("text-action");

        link.onclick = () => {
            link.classList.add("text-action");
        };
    });
}