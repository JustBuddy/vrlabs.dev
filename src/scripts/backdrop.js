const backdrop = document.querySelector(".backdrop");
const scrollbarWidth = window.innerWidth - document.body.clientWidth;

export function openBackdrop(zIndex, callback) {
    document.body.classList.add("overflow-hidden");
    document.body.style.paddingRight = scrollbarWidth + "px";

    backdrop.setAttribute("data-state", "opened");
    backdrop.style.zIndex = zIndex;
    backdrop.focus();

    backdrop.onclick = function () {
        callback();
        closeBackdrop();
    }

    backdrop.onkeydown = function (event) {
        if (event.key === "Escape") {
            callback();
        }
    }
}

export function closeBackdrop() {
    document.body.classList.remove("overflow-hidden");
    document.body.style.paddingRight = "";

    backdrop.setAttribute("data-state", "closed");
}