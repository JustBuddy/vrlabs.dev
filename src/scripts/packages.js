import { addToBasket } from "../scripts/basket";

let packages;
let categoriesWithPackages;

export async function fetchData() {
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

export function drawCategories() {
    const parentElement = document.getElementById("categories");
    if (!parentElement) return;
}

export function drawPackages() {
    const parentElement = document.getElementById("packages");
    if (!parentElement) return;
}

function openModal() { }