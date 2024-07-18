let backdrop;

document.addEventListener("astro:page-load", () => {
    backdrop = document.querySelector(".backdrop");

    backdrop.onanimationend = () => {
        if (backdrop.getAttribute("data-state") === "closed") { backdrop.classList.add("hidden"); }
    }
});

export function openBackdrop(zIndex, callback) {
    document.body.classList.add("overflow-hidden");

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
}

export function closeBackdrop() {
    const bodyClassList = document.body.classList.remove("overflow-hidden");
    backdrop.setAttribute("data-state", "closed");
}
