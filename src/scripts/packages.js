import { addToBasket } from "./packagesDrawer";

let categoriesWithPackages;

document.addEventListener("astro:page-load", async () => {
    if (window.location.pathname !== "/packages") return;

    categoriesWithPackages = await fetchData();
    if (!categoriesWithPackages) { displayError(); return };

    sortCategories();
    drawCategories();
    getAllImages();
    hideSpinner();
    revealCategoriesAndPackages();
    getGithubDownloads();
    destroyTemplates();
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
    const categoryTemplate = document.querySelector(".category-template");
    const gridTemplate = document.querySelector(".grid-template");

    categoriesWithPackages.forEach((categoryWithPackages) => {
        const { category, packages } = categoryWithPackages;
        const categry = categoryTemplate.cloneNode(true);

        categry.classList.remove("category-template", "hidden");
        categry.classList.add("packages-header", "flex");
        categry.style.opacity = 0;

        const categoryTitle = categry.querySelector(".category-title");
        categoryTitle.innerText = category;

        const categoryButton = categry.querySelector(".category-vccButton");
        categoryButton.addEventListener("click", () => {
            window.open("vcc://vpm/addRepo?url=http://45.79.147.72:8006/listings/category/" + category, "_self");
        });

        const grid = gridTemplate.cloneNode(true);
        grid.classList.remove("grid-template", "hidden");
        grid.classList.add("grid");

        const categoryElement = document.createElement("div");
        categoryElement.appendChild(categry);
        categoryElement.appendChild(grid);

        container.appendChild(categoryElement);

        drawPackagesInGrid(grid, packages)
    });
}

function drawPackagesInGrid(grid, packages) {
    const cardTemplate = document.querySelector(".card-template");
    if (!cardTemplate) return;

    // vcc and download buttons need to always be at the bottom of the card
    for (let pack in packages) {
        const packageInfo = packages[pack]?.packageInfo;
        if (!packageInfo) continue;

        const { name, displayName, description, siteUrl, unityPackageUrl } = packageInfo || undefined;
        const image = packageInfo.media?.previewImage || undefined;
        const gif = packageInfo.media?.previewGif || undefined;
        const card = cardTemplate.cloneNode(true);

        card.setAttribute("githubUrl", siteUrl);
        card.setAttribute("previewImage", image);
        card.setAttribute("previewGif", gif);

        card.onmouseenter = function () {
            getGifForCard(card);
        };

        card.classList.remove("card-template", "hidden");
        card.classList.add("packages-card", "flex");
        card.style.opacity = 0;

        const cardInfo = card.querySelector(".card-infoButton");
        isValidUrl(siteUrl) ? cardInfo.classList.remove("disabled") : cardInfo.classList.add("disabled");
        cardInfo.addEventListener("click", () => {
            openMarkdownModal(siteUrl);
        });

        const cardGithub = card.querySelector(".card-githubButton");
        isValidUrl(siteUrl) ? cardGithub.classList.remove("disabled") : cardGithub.classList.add("disabled");
        cardGithub.addEventListener("click", () => {
            window.open(siteUrl, "_blank");
        });

        const cardTitle = card.querySelector(".card-packageName");
        cardTitle.innerText = displayName;

        const cardDescription = card.querySelector(".card-packageDescription");
        cardDescription.innerText = description;

        const vccButton = card.querySelector(".card-vccButton");
        vccButton.addEventListener("click", (event) => {
            event.stopPropagation();
            addToBasket(displayName, name);
        });

        const downloadButton = card.querySelector(".card-downloadButton");
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

    const timeoutTime = 25;
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

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            const card = entry.target;
            const cardImage = card.querySelector(".card-previewImage");

            let img = new Image();

            card.getAttribute("previewImage") !== "undefined" ? img.src = card.getAttribute("previewImage") : img.src = "/images/placeholder.png";

            img.onload = function () {
                cardImage.src = img.src;
                cardImage.classList.remove("animate-skeleton");
            }

            observer.unobserve(card);
        });
    }, {
        rootMargin: "100px"
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

function getGifForCard(card) {
    const cardGif = card.querySelector(".card-previewGif");
    if (cardGif.src !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=") return;

    let img = new Image();

    card.getAttribute("previewGif") !== "undefined" ? img.src = card.getAttribute("previewGif") : img.src = "/images/placeholder.png";

    img.onload = function () {
        let opacity = 0;
        cardGif.style.opacity = opacity;

        cardGif.src = img.src;
        cardGif.classList.remove("animate-skeleton");

        let intervalId = setInterval(function () {
            if (opacity < 1) {
                opacity += 0.025;
                cardGif.style.opacity = opacity;
            } else {
                clearInterval(intervalId);
            }
        }, 1);
    }
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
        const cardDownloads = card.querySelector(".card-downloadCount");
        cardDownloads.innerText = formattedDownloads;
    }
}

function destroyTemplates() {
    const categoryTemplate = document.querySelector(".category-template");
    const gridTemplate = document.querySelector(".grid-template");
    const cardTemplate = document.querySelector(".card-template");

    categoryTemplate.remove();
    gridTemplate.remove();
    cardTemplate.remove();
}

async function openMarkdownModal(githubUrl) {
    let marked = await import("marked");

    const modal = document.querySelector(".packages-modal");
    const container = modal.querySelector(".packages-modal-container");
    const close = modal.querySelector(".packages-modal-close");
    const content = modal.querySelector(".packages-modal-content");
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
            p.style.gap = "0.15rem";
        });
    }
    else {
        // Legacy support for old readme structure
        const firstP = content.querySelector("p");
        firstP.style.display = "flex";
        firstP.style.gap = "0.15rem";
        container.style.opacity = 1;
        return;
    }

    const lastDiv = content.querySelector("div:last-child");
    const lastP = lastDiv.querySelector("p");
    lastP.style.display = "flex";
    lastP.style.justifyContent = "center";
    lastP.style.gap = "0.15rem";

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
        video.style.position = "relative"
        video.style.zIndex = -1;

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