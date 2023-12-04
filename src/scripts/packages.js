import { addToBasket } from "./packagesDrawer";

let packages;
let categoriesWithPackages;

document.addEventListener("astro:page-load", async () => {
    if (window.location.pathname !== "/packages") return;

    await fetchData();
    drawCategories();
    drawPackages();
});

async function fetchData() {
    try {
        const packagesResponse = await fetch(
            "http://45.79.147.72:8006/packages/info"
        );
        const packagesJson = await packagesResponse.json();
        packages = Object.values(packagesJson);
    } catch (error) {
        console.error("Error fetching packages: ", error);
    }

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

function drawCategories() {
    const parentElement = document.getElementById("categories");
    if (!parentElement) return;

    categoriesWithPackages.forEach((categoryWithPackages) => {
        const { category, packages } = categoryWithPackages;
        console.log(packages);
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category");
        categoryElement.id = category;

        const categoryTitle = document.createElement("h2");
        categoryTitle.classList.add("categoryTitle");
        categoryTitle.innerText = category;

        const packagesList = document.createElement("ul");
        packagesList.classList.add("packagesList");

        packages.forEach((pack) => {
            const packageElement = document.createElement("li");
            packageElement.classList.add("package");

            const packageTitle = document.createElement("h3");
            packageTitle.classList.add("packageTitle");
            packageTitle.innerText = pack.displayName;

            const packageButton = document.createElement("button");
            packageButton.classList.add("packageButton");
            packageButton.innerText = "Add to basket";
            packageButton.addEventListener("click", (event) => {
                event.stopPropagation();
                addToBasket(pack.displayName, pack.name);
            });

            packageElement.appendChild(packageTitle);
            packageElement.appendChild(packageButton);

            packagesList.appendChild(packageElement);
        });

        categoryElement.appendChild(categoryTitle);
        categoryElement.appendChild(packagesList);

        parentElement.appendChild(categoryElement);
    });
}

function drawPackages() {
    const parentElement = document.getElementById("packages");
    if (!parentElement) return;
}

function openModal() { }

export async function getVCCLink(packageIDs, copyURL = false) {
    const response = await fetch("http://45.79.147.72:8006/listings/encode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(packageIDs),
    });

    if (response.ok) {
        const encodedBasket = await response.json();
        const { message } = encodedBasket;

        if (copyURL) {
            navigator.clipboard.writeText("vcc://vpm/addRepo?url=http://45.79.147.72:8006/listings/ids/" + message);
        }
        else {
            window.open("vcc://vpm/addRepo?url=http://45.79.147.72:8006/listings/ids/" + message, "_self");
        }
    }
    else {
        const error = await response.text();
        alert(error);
        console.log(error);
    }
}