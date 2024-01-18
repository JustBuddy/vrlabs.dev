const backdrop = document.querySelector(".backdrop");
const scrollbarWidth = window.innerWidth - document.body.clientWidth;
const scrollbarColor = getComputedStyle(document.body).getPropertyValue("--scrollbar-track");

export function openBackdrop(zIndex, callback) {
    document.body.classList.add("overflow-hidden");
    document.body.style.paddingRight = scrollbarWidth + "px";

    backdrop.setAttribute("data-state", "opened");
    backdrop.classList.remove("hidden");
    backdrop.style.zIndex = zIndex;
    backdrop.focus();

    backdrop.onclick = function () {
        callback();
    }

    backdrop.onkeydown = function (event) {
        if (event.key === "Escape") {
            callback();
        }
    }

    createScrollbarPlaceholder(zIndex);
}

export function closeBackdrop() {
    const scrollbarPlaceholder = document.querySelector(".scrollbar-placeholder");
    if (scrollbarPlaceholder) scrollbarPlaceholder.remove();

    document.body.style.paddingRight = "";
    document.body.classList.remove("overflow-hidden");

    backdrop.setAttribute("data-state", "closed");
}

function createScrollbarPlaceholder(zIndex) {
    const scrollbarPlaceholder = document.createElement("div");

    scrollbarPlaceholder.classList.add("scrollbar-placeholder");
    scrollbarPlaceholder.style.width = scrollbarWidth + "px";
    scrollbarPlaceholder.style.height = "100vh";
    scrollbarPlaceholder.style.position = "fixed";
    scrollbarPlaceholder.style.top = "0";
    scrollbarPlaceholder.style.right = "0";
    scrollbarPlaceholder.style.zIndex = zIndex - 1;
    scrollbarPlaceholder.style.backgroundColor = scrollbarColor;
    scrollbarPlaceholder.style.overflow = "hidden";

    document.body.appendChild(scrollbarPlaceholder);
}