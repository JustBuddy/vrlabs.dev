import { getConfiguredImageService } from "astro:assets";
import { addToBasket } from "./packagesDrawer";
// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

let categoriesWithPackages;

document.addEventListener("astro:page-load", async () => {
    if (window.location.pathname !== "/packages") return;

    await fetchData();
    sortCategories();
    drawCategories();
    hideSpinner();
    revealCategoriesAndPackages();
    getImages();
    getGithubDownloads();
});

async function fetchData() {
    try {
        const categoriesResponse = await fetch(
            "http://45.79.147.72:8006/categories"
        );
        const { categories } = await categoriesResponse.json();

        const packagesPromises = categories.map(async (category) => {
            try {
                const categoryPackagesResponse = await fetch(
                    "http://45.79.147.72:8006/packages/info/category/" + category
                );
                const categoryPackagesJson = await categoryPackagesResponse.json();
                const packages = Object.values(categoryPackagesJson);

                return {
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    packages,
                };
            } catch (error) {
                console.error(
                    `Error fetching packages for category ${category}: `,
                    error
                );
            }
        });

        categoriesWithPackages = await Promise.all(packagesPromises);
    } catch (error) {
        console.error("Error fetching categories: ", error);
    }
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
    for (let key in packages) {
        const packageInfo = packages[key]?.packageInfo;
        if (!packageInfo) continue;
        const gif = packageInfo.media?.gifs[0];
        const image = packageInfo.media?.images[0];
        const { displayName, description, siteUrl, unityPackageUrl } = packageInfo || {};

        const card = cardTemplate.cloneNode(true);

        card.setAttribute("githubUrl", siteUrl);
        card.setAttribute("previewImage", image);
        card.setAttribute("gif", gif);

        card.classList.remove("packages-cardTemplate", "hidden");
        card.classList.add("packages-card", "flex");
        card.style.opacity = 0;

        const cardInfo = card.querySelector(".packages-cardTemplate-infoButton");
        cardInfo.addEventListener("click", () => {
            openMarkdownModal(siteUrl);
        });

        const cardGithub = card.querySelector(".packages-cardTemplate-githubButton");
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

async function revealCategoriesAndPackages() {
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
}

async function getGithubDownloads() {
    const cards = document.querySelectorAll(".packages-card");

    for (let card of cards) {
        const siteUrl = card.getAttribute("githubUrl");
        const cutUrl = siteUrl.replace("https://github.com/", "");

        try {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("GitHub Request Timeout")), 5000)
            );

            const fetchPromise = fetch("https://api.github.com/repos/" + cutUrl + "/releases");

            const githubResponse = await Promise.race([fetchPromise, timeoutPromise]);
            const githubJson = await githubResponse.json();

            let downloads = 0;
            for (let release in githubJson) {
                let assets = githubJson[release].assets;
                for (let asset in assets) {
                    downloads += assets[asset].download_count;
                }
            }
            const formattedDownloads = downloads.toLocaleString('de-DE');

            const cardDownloads = card.querySelector(".packages-cardTemplate-downloadCount");
            cardDownloads.innerText = formattedDownloads;
        }
        catch (error) {
            console.log(error);
        }
    }
}

async function openMarkdownModal(githubUrl) {
    // This would require a lot of work to get working, so I'm leaving it commented out for now
    // The first and last div in the md needs class flex flex-col and items center
    // The entire thing needs to be styled too
    //
    // const test = await fetch("https://raw.githubusercontent.com/VRLabs/Contact-Tracker/dev/README.md");
    // if (test.ok) {
    //     const test2 = await test.text();
    //     const test3 = document.getElementById("markdown");
    //     test3.innerHTML = marked.parse(test2, { gfm: true, breaks: true });
    // }
}

export async function getVCCLink(packageIDs, copyURL = false) {
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

function isValidUrl(string) {
    try {
        new URL(string);
    }
    catch (_) {
        return false;
    }
    return true;
}