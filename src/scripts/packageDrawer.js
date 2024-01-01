let drawer;
let drawerContainer;
let drawerMain;
let drawerToggle;
let drawerPackages;
let drawerPackagesList;
let drawerEmptyMessage;
let packagesCount;
let addToVCCButton;
let copyButton;

let maxHeight;
let minHeight;

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
    drawerEmptyMessage = document.querySelector(".drawer-emptyMessage");
    packagesCount = document.querySelector(".drawer-count");
    addToVCCButton = document.querySelector(".drawer-addToVCCButton");
    copyButton = document.querySelector(".drawer-copyButton");

    drawerContainer.classList.remove("hidden");
    drawerContainer.classList.add("flex");

    minHeight = drawerToggle.offsetHeight + "px";
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

function openDrawer() {
    setMaxHeight();

    const backdrop = document.querySelector(".backdrop");

    backdrop.setAttribute("data-state", "opened");
    backdrop.style.zIndex = 40;
    backdrop.focus();
    backdrop.onclick = function () {
        closeDrawer();
    };
    backdrop.onkeydown = function (event) {
        if (event.key === "Escape") closeDrawer();
    };

    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;
    window.onscroll = function () { window.scrollTo(scrollLeft, scrollTop); };
}

function closeDrawer() {
    drawer.style.height = minHeight;

    const backdrop = document.querySelector(".backdrop");
    backdrop.setAttribute("data-state", "closed");

    window.onscroll = function () { };
}

function setMaxHeight() {
    drawerPackages.style.overflowY = "visible";
    drawerContainer.style.height = "fit-content";

    maxHeight =
        drawerContainer.offsetHeight > window.innerHeight / 1.5
            ? Math.floor(window.innerHeight / 1.5) + "px"
            : Math.floor(drawerContainer.offsetHeight) + "px"; drawer.style.height = maxHeight;

    drawerContainer.style.height = "auto";
    drawerPackages.style.overflowY = "auto";
}

export function addToBasket(packageName, packageID) {
    drawerEmptyMessage.classList.add("hidden");

    const basketItems = drawerPackagesList.children;
    for (let i = 0; i < basketItems.length; i++) {
        if (basketItems[i].getAttribute("basketItemName") === packageName) {
            return;
        }
    }

    const basketItem = document.createElement("li");
    basketItem.setAttribute("basketItemName", packageName);
    basketItem.setAttribute("basketItemID", packageID);
    basketItem.classList = "flex justify-between items-center";

    const itemName = document.createElement("span");
    itemName.textContent = packageName;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded my-1";
    removeButton.onclick = () => {
        removeFromBasket(basketItem);
    };

    basketItem.append(itemName);
    basketItem.append(removeButton);
    drawerPackagesList.append(basketItem);

    packagesCount.textContent = (parseInt(packagesCount.textContent) + 1).toString();
    saveBasket();
}

function removeFromBasket(packageName) {
    packageName.remove();

    packagesCount.textContent = (parseInt(packagesCount.textContent) - 1).toString();
    if (drawerPackagesList.childElementCount < 1) drawerEmptyMessage.classList.remove("hidden");

    setMaxHeight();
    saveBasket();
}

function saveBasket() {
    const basketItems = document.querySelectorAll("[basketItemName]");
    let basket = [];

    for (let i = 0; i < basketItems.length; i++) {
        basket.push({ name: basketItems[i].getAttribute("basketItemName"), id: basketItems[i].getAttribute("basketItemID") });
    }

    localStorage.setItem("basket", JSON.stringify(basket));
}

function loadBasket() {
    const basket = JSON.parse(localStorage.getItem("basket"));

    if (basket) {
        for (let i = 0; i < basket.length; i++) {
            addToBasket(basket[i].name, basket[i].id);
        }
    }
}

export function clearBasket() {
    localStorage.removeItem("basket");
    packagesCount.textContent = "0";
    drawerPackagesList.innerHTML = "";
    drawerEmptyMessage.classList.remove("hidden");

    setMaxHeight();
    saveBasket();
}

async function getVCCLink(copyURL) {
    const basketItems = document.querySelectorAll("[basketItemName]");
    let packageIDs = [];

    for (let i = 0; i < basketItems.length; i++) {
        packageIDs.push(basketItems[i].getAttribute("basketItemID"));
    }

    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout")), 5000)
        );
        const listingPromise = await fetch("http://45.79.147.72:8006/listings/encode", {
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
            navigator.clipboard.writeText("vcc://vpm/addRepo?url=http://45.79.147.72:8006/listings/ids/" + message);
        }
        else {
            window.open("vcc://vpm/addRepo?url=http://45.79.147.72:8006/listings/ids/" + message, "_self");
        }
    }
    catch (error) {
        console.log(error);
    }
}