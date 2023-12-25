let drawer;
let drawerContainer;
let drawerMain;
let drawerToggle;
let drawerPackages;
let drawerPackagesList;
let drawerEmptyMessage;
let maxHeight;
let minHeight;
let drawerButtons;
let packagesCount;
let addToVCCButton;

document.addEventListener("astro:page-load", () => {
    if (window.location.pathname !== "/packages") return;
    prepareDrawer();
});

function prepareDrawer() {
    drawer = document.getElementById("drawer");
    drawerContainer = document.getElementById("drawerContainer");
    drawerMain = document.getElementById("drawerMain");
    drawerToggle = document.getElementById("drawerToggle");
    drawerPackages = document.getElementById("drawerPackages");
    drawerPackagesList = document.getElementById("drawerPackagesList");
    drawerEmptyMessage = document.getElementById("drawerEmptyMessage");
    drawerButtons = document.getElementById("drawerButtons");
    packagesCount = document.getElementById("packagesCount");
    addToVCCButton = document.getElementById("addToVCCButton");

    minHeight = drawerToggle.offsetHeight + "px";
    drawer.style.height = minHeight;
    drawerMain.style.minHeight = minHeight;

    drawerContainer.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    drawerToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        drawer.style.height === minHeight ? openDrawer() : closeDrawer();
    });

    addToVCCButton.addEventListener("click", function () {
        const basketItems = document.querySelectorAll("[basketItemID]");
        let basket = [];

        for (let i = 0; i < basketItems.length; i++) {
            basket.push(basketItems[i].getAttribute("basketItemID"));
        }
        getVCCLink(basket, false);
    });

    document.addEventListener("click", function () {
        closeDrawer();
    });

    loadBasket();

    if (drawerPackagesList.childElementCount < 1) {
        drawerEmptyMessage.classList.remove("hidden");
        drawerPackagesList.classList.add("hidden");
    }
}

function openDrawer() {
    setMaxHeight();
}

function closeDrawer() {
    drawer.style.height = minHeight;
}

function setMaxHeight() {
    drawerPackages.style.overflowY = "visible";
    drawerContainer.style.height = "fit-content";

    maxHeight =
        drawerContainer.offsetHeight >
            window.innerHeight / 1.5
            ? Math.floor(window.innerHeight / 1.5) + "px"
            : Math.floor(
                drawerContainer.offsetHeight
            ) + "px";
    drawer.style.height = maxHeight;

    drawerContainer.style.height = "auto";
    drawerPackages.style.overflowY = "auto";
}

export function addToBasket(packageName, packageID) {
    const basketItems = drawerPackagesList.children;
    for (let i = 0; i < basketItems.length; i++) {
        if (basketItems[i].getAttribute("basketItemName") === packageName) {
            return;
        }
    }

    drawerEmptyMessage.classList.add("hidden");
    drawerPackagesList.classList.remove("hidden");

    const basketItem = document.createElement("li");
    const itemName = document.createElement("span");
    itemName.textContent = packageName;
    basketItem.append(itemName);
    basketItem.setAttribute("basketItemName", packageName);
    basketItem.setAttribute("basketItemID", packageID);
    basketItem.classList = "flex justify-between items-center";
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded my-1";
    removeButton.onclick = () => {
        removeFromBasket(basketItem);
    };
    basketItem.append(removeButton);
    drawerPackagesList.append(basketItem);
    packagesCount.textContent = (parseInt(packagesCount.textContent) + 1).toString();

    drawer.style.height === minHeight ? closeDrawer() : openDrawer();
    saveBasket();
}

function removeFromBasket(packageName) {
    packageName.remove();
    packagesCount.textContent = (parseInt(packagesCount.textContent) - 1).toString();
    if (drawerPackagesList.childElementCount < 1) {
        drawerEmptyMessage.classList.remove("hidden");
        drawerPackagesList.classList.add("hidden");
    }

    setMaxHeight();

    saveBasket();
}

function saveBasket() {
    const basketItems = document.querySelectorAll("[basketItemName], [basketItemID]");
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
    drawerPackagesList.classList.add("hidden");
    setMaxHeight();
}

async function getVCCLink(packageIDs, copyURL = false) {
    try {
        const response = await fetch("http://45.79.147.72:8006/listings/encode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(packageIDs),
        });

        const encodedBasket = await response.json();
        const { message } = encodedBasket;

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