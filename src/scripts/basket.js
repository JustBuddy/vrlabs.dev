let drawer;
let drawerContainer;
let drawerToggle;
let drawerPackages;
let drawerPackagesList;
let drawerEmptyMessage;
let maxHeight;
let minHeight;
let drawerButtons;
let packagesCount;

export function prepareDrawer() {
    drawer = document.getElementById("drawer");
    drawerContainer = document.getElementById("drawerContainer");
    drawerToggle = document.getElementById("drawerToggle");
    drawerPackages = document.getElementById("drawerPackages");
    drawerPackagesList = document.getElementById("drawerPackagesList");
    drawerEmptyMessage = document.getElementById("drawerEmptyMessage");
    drawerButtons = document.getElementById("drawerButtons");
    packagesCount = document.getElementById("packagesCount");

    minHeight = drawerToggle.offsetHeight + "px";
    drawer.style.height = minHeight;

    drawerContainer.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    drawerToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        drawer.style.height === minHeight ? openDrawer() : closeDrawer();
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
    drawer.style.marginBottom = "2rem";
}

function closeDrawer() {
    drawer.style.height = minHeight;
    drawer.style.marginBottom = "0rem";
}

function setMaxHeight() {
    drawerPackages.style.overflowY = "visible";
    maxHeight =
        drawerPackages.offsetHeight +
            drawerToggle.offsetHeight +
            drawerButtons.offsetHeight >
            window.innerHeight / 1.5
            ? Math.floor(window.innerHeight / 1.5) + "px"
            : Math.floor(
                drawerPackages.offsetHeight +
                drawerToggle.offsetHeight +
                drawerButtons.offsetHeight
            ) + "px";

    drawer.style.height = maxHeight;
    drawerPackages.style.overflowY = "auto";
}

export function addToBasket(packageName) {
    drawerEmptyMessage.classList.add("hidden");
    drawerPackagesList.classList.remove("hidden");

    const basketItem = document.createElement("li");
    const itemName = document.createElement("span");
    itemName.textContent = packageName;
    basketItem.append(itemName);
    basketItem.setAttribute("basketItem", packageName);
    basketItem.classList = "flex justify-between items-center";
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded my-1";
    removeButton.onclick = () => {
        removeFromBasket(basketItem);
    };
    basketItem.append(removeButton);
    drawerPackagesList.prepend(basketItem);
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
    const basketItems = document.querySelectorAll("[basketItem]");
    let basket = [];

    for (let i = 0; i < basketItems.length; i++) {
        basket.push(basketItems[i].getAttribute("basketItem"));
    }

    localStorage.setItem("basket", JSON.stringify(basket));
}

function loadBasket() {
    const basket = JSON.parse(localStorage.getItem("basket"));

    if (basket) {
        for (let i = 0; i < basket.length; i++) {
            addToBasket(basket[i]);
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

function getVCCLink() { }