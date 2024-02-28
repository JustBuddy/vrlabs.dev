import { openBackdrop, closeBackdrop } from "../../common/backdrop/backdrop.js";

let drawer;
let drawerContainer;
let drawerMain;
let drawerToggle;
let drawerPackages;
let drawerPackagesList;
let emptyPackagesMessage;
let packagesCount;
let addToVCCButton;
let copyButton;
let itemTemplate;

let maxHeight;
let minHeight;

export const siteUrl = "https://api.vrlabs.dev";

document.addEventListener("astro:page-load", () => {
    if (window.location.pathname !== "/packages") return;
    prepareDrawer();
});

function prepareDrawer() {
    drawer = document.querySelector(".drawer");
    drawerContainer = document.querySelector(".drawer-container");
    drawerMain = document.querySelector(".drawer-main");
    drawerToggle = document.querySelector(".drawer-toggle");
    drawerPackages = document.querySelector(".drawer-packages");
    drawerPackagesList = document.querySelector(".drawer-packagesList");
    emptyPackagesMessage = document.querySelector(".drawer-emptyPackagesMessage");
    packagesCount = document.querySelector(".drawer-count");
    addToVCCButton = document.querySelector(".drawer-addToVCCButton");
    copyButton = document.querySelector(".drawer-copyButton");
    itemTemplate = document.querySelector(".item-template");

    drawerContainer.classList.remove("hidden");
    drawerContainer.classList.add("flex", "backdrop-blur-2xl");

    minHeight =
        drawerToggle.offsetHeight
        + Math.floor(parseFloat(window.getComputedStyle(drawerContainer).getPropertyValue("border-width").replace("px", "")) * 2)
        + "px";

    drawer.style.height = minHeight;
    drawerMain.style.minHeight = minHeight;

    drawerToggle.addEventListener("click", function () {
        drawer.style.height === minHeight ? openDrawer() : closeDrawer();
    });

    addToVCCButton.addEventListener("click", function () {
        getVCCLink(false);
    });

    copyButton.addEventListener("click", function () {
        getVCCLink(true);
    });

    loadBasket();
}

export function openDrawer() {
    setMaxHeight();
    openBackdrop(39, closeDrawer);
}

function closeDrawer() {
    drawer.style.height = minHeight;
    closeBackdrop();
}

function setMaxHeight() {
    drawerPackages.style.overflowY = "visible";
    drawerContainer.style.height = "fit-content";

    maxHeight =
        drawerContainer.offsetHeight > window.innerHeight / 1.5
            ? Math.floor(window.innerHeight / 1.5) + "px"
            : Math.floor(drawerContainer.offsetHeight) + "px";

    drawer.style.height = maxHeight;
    drawerContainer.style.height = "auto";
    drawerPackages.style.overflowY = "auto";
}

export function addToBasket(packageName, packageID, dependencies) {
    emptyPackagesMessage.classList.add("hidden");
    drawerPackagesList.classList.remove("hidden");
    drawerPackagesList.classList.add("flex");

    const basketItems = drawerPackagesList.children;
    for (let i = 0; i < basketItems.length; i++) {
        if (basketItems[i].getAttribute("basketItemName") === packageName) {
            return;
        }
    }

    const basketItem = itemTemplate.cloneNode(true);
    basketItem.classList.remove("item-template", "hidden");
    basketItem.classList.add("flex");
    basketItem.setAttribute("basketItemName", packageName);
    basketItem.setAttribute("basketItemID", packageID);
    basketItem.setAttribute("basketItemDependencies", JSON.stringify(dependencies));

    const itemName = basketItem.querySelector(".item-name");
    itemName.textContent = packageName;

    const removeButton = basketItem.querySelector(".item-remove");
    removeButton.onclick = () => {
        removeFromBasket(basketItem);
    };

    drawerPackagesList.append(basketItem);

    packagesCount.textContent = (parseInt(packagesCount.textContent) + 1).toString();
    saveBasket();

    drawerContainer.classList.remove("bg-elementsDark/80");
    drawerContainer.classList.add("bg-elements/80", "scale-105");
    drawerContainer.ontransitionend = () => {
        if (!drawerContainer.classList.contains("scale-105")) return;
        setTimeout(() => {
            drawerContainer.classList.remove("bg-elements/80", "scale-105");
            drawerContainer.classList.add("bg-elementsDark/80");
        }, 100);
    };
}

function removeFromBasket(packageName) {
    packageName.remove();
    packagesCount.textContent = (parseInt(packagesCount.textContent) - 1).toString();

    if (drawerPackagesList.childElementCount < 1) {
        emptyPackagesMessage.classList.remove("hidden");
        drawerPackagesList.classList.add("hidden");
        drawerPackagesList.classList.remove("flex");
    }

    setMaxHeight();
    saveBasket();
}

function saveBasket() {
    const basketItems = document.querySelectorAll("[basketItemName]");
    let basket = [];

    for (let item of basketItems) {
        basket.push({
            name: item.getAttribute("basketItemName"),
            id: item.getAttribute("basketItemID"),
            dependencies: JSON.parse(item.getAttribute("basketItemDependencies"))
        })
    }

    localStorage.setItem("basket", JSON.stringify(basket));
}

function loadBasket() {
    const basket = JSON.parse(localStorage.getItem("basket"));
    if (!basket) return;

    for (let item of basket) {
        addToBasket(item.name, item.id, item.dependencies);
    }
}

export function clearBasket() {
    localStorage.removeItem("basket");
    packagesCount.textContent = "0";
    drawerPackagesList.innerHTML = "";
    emptyPackagesMessage.classList.remove("hidden");

    setMaxHeight();
    saveBasket();
}

async function getVCCLink(copyURL) {
    const basketItems = document.querySelectorAll("[basketItemName]");
    let packageIDs = [];

    for (let item of basketItems) {
        const dependencies = JSON.parse(item.getAttribute("basketItemDependencies"));
        for (let dependency in dependencies) {
            if (packageIDs.includes(dependency)) continue;
            packageIDs.push(dependency);
        }

        packageIDs.push(item.getAttribute("basketItemID"));
    }

    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout")), 5000)
        );
        const listingPromise = await fetch(`${siteUrl}/listings/encode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(packageIDs),
        });

        const response = await Promise.race([listingPromise, timeoutPromise]);
        if (!response.ok) throw new Error("Could not fetch listing");

        const listing = await listingPromise.json();
        if (!listing) throw new Error("Could not fetch listing");

        const { message } = listing;
        if (copyURL) {
            navigator.clipboard.writeText(`vcc://vpm/addRepo?url=${siteUrl}/listings/ids/` + message);
        }
        else {
            window.open(`vcc://vpm/addRepo?url=${siteUrl}/listings/ids/` + message, "_self");
        }
    }
    catch (error) {
        console.log(error);
    }
}