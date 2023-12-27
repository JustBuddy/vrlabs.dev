import { addToBasket } from "./packagesDrawer";

let categoriesWithPackages;

document.addEventListener("astro:page-load", async () => {
    if (window.location.pathname !== "/packages") return;

    categoriesWithPackages = await fetchData();
    if (!categoriesWithPackages) { displayError(); return };

    sortCategories();
    drawCategories();
    hideSpinner();
    revealCategoriesAndPackages();
    getAllImages();
    getGithubDownloads();
});

async function fetchData() {
    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout")), 5000)
        );
        const categoriesPromise = await fetch(
            "http://45.79.147.72:8006/categories"
        );

        const response = await Promise.race([categoriesPromise, timeoutPromise]);
        if (!response.ok) throw new Error("Could not fetch categories");

        const { categories } = await categoriesPromise.json();
        if (!categories) throw new Error("Could not fetch categories");

        const packagesPromises = categories.map(async (category) => {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Server timeout")), 5000)
            );
            const packagesPromise = await fetch(
                "http://45.79.147.72:8006/packages/info/category/" + category
            );

            const response = await Promise.race([packagesPromise, timeoutPromise]);
            if (!response.ok) throw new Error("Could not fetch packages");

            const packagesJson = await packagesPromise.json();
            if (!packagesJson) throw new Error("Could not fetch packages");

            const packages = Object.values(packagesJson);
            return {
                category: category.charAt(0).toUpperCase() + category.slice(1),
                packages,
            };
        });

        return await Promise.all(packagesPromises);
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

function displayError() {
    hideSpinner();

    const container = document.querySelector(".packages-container");
    const p = document.createElement("p");
    p.style.textAlign = "center";
    p.innerText = "Error fetching packages";
    container.appendChild(p);
}

function sortCategories() {
    categoriesWithPackages.sort((a, b) => {
        const aIndex = ["Essentials", "Systems", "Components", "Networking"].indexOf(a.category);
        const bIndex = ["Essentials", "Systems", "Components", "Networking"].indexOf(b.category);

        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
    });
}

function drawCategories() {
    const container = document.querySelector(".packages-container");
    const categoryTemplate = document.querySelector(".packages-categoryTemplate");
    const gridTemplate = document.querySelector(".packages-gridTemplate");

    categoriesWithPackages.forEach((categoryWithPackages) => {
        const { category, packages } = categoryWithPackages;
        const categry = categoryTemplate.cloneNode(true);

        categry.classList.remove("packages-categoryTemplate", "hidden");
        categry.classList.add("packages-header", "grid");
        categry.style.opacity = 0;

        const categoryTitle = categry.querySelector(".packages-categoryTemplate-title");
        categoryTitle.innerText = category;

        const categoryButton = categry.querySelector(".packages-categoryTemplate-vccButton");
        categoryButton.addEventListener("click", () => {
            window.open("vcc://vpm/addRepo?url=http://45.79.147.72:8006/listings/category/" + category, "_self");
        });

        const grid = gridTemplate.cloneNode(true);
        grid.classList.remove("packages-gridTemplate", "hidden");
        grid.classList.add("grid");

        const categoryElement = document.createElement("div");
        categoryElement.appendChild(categry);
        categoryElement.appendChild(grid);

        container.appendChild(categoryElement);

        drawPackagesInGrid(grid, packages)
    });
}

function drawPackagesInGrid(grid, packages) {
    const cardTemplate = document.querySelector(".packages-cardTemplate");
    if (!cardTemplate) return;

    // vcc and download buttons need to always be at the bottom of the card
    for (let pack in packages) {
        const packageInfo = packages[pack]?.packageInfo;
        if (!packageInfo) continue;

        const { displayName, description, siteUrl, unityPackageUrl } = packageInfo || undefined;
        const image = packageInfo.media?.previewImage || undefined;
        const gif = packageInfo.media?.previewGif || undefined;
        const card = cardTemplate.cloneNode(true);

        card.setAttribute("githubUrl", siteUrl);
        card.setAttribute("previewImage", image);
        card.setAttribute("previewGif", gif);

        card.onmouseenter = function () {
            getGifForCard(card);
        };

        card.classList.remove("packages-cardTemplate", "hidden");
        card.classList.add("packages-card", "flex");
        card.style.opacity = 0;

        const cardInfo = card.querySelector(".packages-cardTemplate-infoButton");
        isValidUrl(siteUrl) ? cardInfo.classList.remove("disabled") : cardInfo.classList.add("disabled");
        cardInfo.addEventListener("click", () => {
            openMarkdownModal(siteUrl);
        });

        const cardGithub = card.querySelector(".packages-cardTemplate-githubButton");
        isValidUrl(siteUrl) ? cardGithub.classList.remove("disabled") : cardGithub.classList.add("disabled");
        cardGithub.addEventListener("click", () => {
            window.open(siteUrl, "_blank");
        });

        const cardTitle = card.querySelector(".packages-cardTemplate-packageName");
        cardTitle.innerText = displayName;

        const cardDescription = card.querySelector(".packages-cardTemplate-packageDescription");
        cardDescription.innerText = description;

        const vccButton = card.querySelector(".packages-cardTemplate-vccButton");
        vccButton.addEventListener("click", (event) => {
            event.stopPropagation();
            addToBasket(displayName, name);
        });

        const downloadButton = card.querySelector(".packages-cardTemplate-downloadButton");
        isValidUrl(unityPackageUrl) ? downloadButton.classList.remove("disabled") : downloadButton.classList.add("disabled");
        downloadButton.addEventListener("click", () => {
            window.open(unityPackageUrl, "_self");
        });

        grid.appendChild(card);
    }
}

function hideSpinner() {
    const spinner = document.querySelector(".packages-spinner");
    spinner.classList.add("hidden");
}

function revealCategoriesAndPackages() {
    const categories = document.querySelectorAll(".packages-header");
    const cards = document.querySelectorAll(".packages-card");

    const timeoutTime = 100;
    const delayCards = categories.length * timeoutTime;

    for (let key of categories) {
        const category = key;
        setTimeout(() => {
            category.style.opacity = 1;
        }, timeoutTime * Array.from(categories).indexOf(category));
    }

    setTimeout(() => {
        for (let card of cards) {
            setTimeout(() => {
                card.style.opacity = 1;
            }, timeoutTime * Array.from(cards).indexOf(card));
        }
    }, delayCards);
}

function getAllImages() {
    const cards = document.querySelectorAll(".packages-card");

    for (let card of cards) {
        const cardImage = card.querySelector(".packages-cardTemplate-previewImage");

        let img = new Image();

        card.getAttribute("previewImage") !== "undefined" ? img.src = card.getAttribute("previewImage") : img.src = "/images/placeholder.png";

        img.onload = function () {
            cardImage.src = img.src;
            cardImage.classList.remove("animate-skeleton");
        }
    }
}

function getGifForCard(card) {
    const cardGif = card.querySelector(".packages-cardTemplate-previewGif");
    if (!cardGif.src.includes("/images/empty.png")) return;

    let img = new Image();

    card.getAttribute("previewGif") !== "undefined" ? img.src = card.getAttribute("previewGif") : img.src = "/images/placeholder.png";

    img.onload = function () {
        cardGif.src = img.src;
        cardGif.classList.remove("animate-skeleton");
    }
}

async function getGithubDownloads() {
    const cards = document.querySelectorAll(".packages-card");
    const expirationDuration = 1000 * 60 * 60 * 2;

    for (let card of cards) {
        const siteUrl = card.getAttribute("githubUrl");
        const cutUrl = siteUrl.replace("https://github.com/", "");

        let downloads = 0;
        const cachedData = JSON.parse(localStorage.getItem(siteUrl));

        if (cachedData && (Date.now() - cachedData.timestamp < expirationDuration)) {
            downloads = Number(cachedData.downloads);
        }
        else {
            try {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("GitHub timeout")), 5000)
                );
                const githubPromise = await fetch("https://api.github.com/repos/" + cutUrl + "/releases");

                const response = await Promise.race([githubPromise, timeoutPromise]);
                if (!response.ok) throw new Error("Could not fetch GitHub releases");

                const githubJson = await response.json();
                if (!githubJson) throw new Error("Could not fetch GitHub releases");

                for (let release in githubJson) {
                    let assets = githubJson[release].assets;
                    for (let asset in assets) {
                        downloads += assets[asset].download_count;
                    }
                }
            }
            catch (error) {
                console.log(error);
            }

            localStorage.setItem(siteUrl, JSON.stringify({ downloads, timestamp: Date.now() }));
        }

        const formattedDownloads = downloads.toLocaleString('de-DE');
        const cardDownloads = card.querySelector(".packages-cardTemplate-downloadCount");
        cardDownloads.innerText = formattedDownloads;
    }
}

async function openMarkdownModal(githubUrl) {
    let marked = await import("marked");

    const modal = document.querySelector(".packages-modal");
    const container = modal.querySelector(".packages-modal-container");
    const close = modal.querySelector(".packages-modal-close");
    const content = modal.querySelector(".packages-modal-content");
    content.innerHTML = "";
    container.style.opacity = 0;
    modal.style.opacity = 0;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
            close.click();
        }
    });

    modal.focus();
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close.click();
    });

    close.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    });

    modal.style.opacity = 1;
    document.body.classList.add("overflow-hidden");

    try {
        const cutUrl = githubUrl.replace("https://github.com/", "");

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("GitHub timeout")), 5000)
        );
        const githubPromise = await fetch("https://raw.githubusercontent.com/" + cutUrl + "/dev/README.md");

        const response = await Promise.race([githubPromise, timeoutPromise]);
        if (!response.ok) throw new Error("Could not fetch GitHub readme");

        let markdownText = await response.text();
        if (!markdownText) throw new Error("Could not fetch GitHub readme");

        content.innerHTML = marked.parse(markdownText, { gfm: true, breaks: true });
    }
    catch (error) {
        console.log(error);
        content.innerHTML = error;
        container.style.opacity = 1;
        return;
    }

    const firstDiv = content.querySelector("div");
    if (firstDiv) {
        const firstTwoP = Array.from(firstDiv.querySelectorAll("p")).slice(0, 2);
        firstTwoP.forEach((p) => {
            p.style.display = "flex";
            p.style.justifyContent = "center";
        });
    }
    else {
        // Legacy support for old readme structure
        const firstP = content.querySelector("p");
        firstP.style.display = "flex";
        container.style.opacity = 1;
        return;
    }

    const lastDiv = content.querySelector("div:last-child");
    const lastP = lastDiv.querySelector("p");
    lastP.style.display = "flex";
    lastP.style.justifyContent = "center";

    const h2Elements = Array.from(content.querySelectorAll("h2"));
    const h2Target = h2Elements.find(element => element.textContent.trim().toLowerCase() === "install guide");
    const nextElement = h2Target ? h2Target.nextElementSibling : null;
    if (nextElement) {
        const a = nextElement.querySelector("a");
        const link = a.getAttribute("href");
        const video = document.createElement("video");

        video.setAttribute("src", link);
        video.setAttribute("controls", "true");
        video.setAttribute("allowfullscreen", "true");
        video.setAttribute("type", "video/mp4");

        nextElement.appendChild(video);
        a.remove();
    }

    container.style.opacity = 1;
}

function isValidUrl(string) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');

    return !!urlPattern.test(string);
}