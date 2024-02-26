import { openBackdrop, closeBackdrop } from "../common/backdrop/backdrop.js";

document.addEventListener("astro:page-load", () => {
    prepareNavbar();
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