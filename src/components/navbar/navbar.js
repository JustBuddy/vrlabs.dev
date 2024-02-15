import { openBackdrop, closeBackdrop } from "../common/backdrop/backdrop.js";

document.addEventListener("astro:page-load", () => {
    prepareNavbar();
    colorCurrentPage();
});

function prepareNavbar() {
    const openButton = document.querySelector(".nav-buttonOpen");
    const closeButton = document.querySelector(".nav-buttonClose");
    const navMobile = document.querySelector(".nav-mobile");

    openButton.onclick = () => {
        navMobile.classList.remove("hidden");
        openBackdrop(40, () => { closeButton.click(); });
    }

    closeButton.onclick = () => {
        navMobile.classList.add("hidden");
        closeBackdrop();
    }
}

function colorCurrentPage() {
    const navLinks = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
        link.classList.remove("text-actionBright");
        if (link.getAttribute("href") === currentPath) link.classList.add("text-actionBright");

        link.onclick = () => {
            link.classList.add("text-actionBright");
        };
    });
}