import { openBackdrop, closeBackdrop } from "../../common/backdrop/backdrop.js";

export async function openMarkdownModal(githubUrl) {
    const container = document.querySelector(".modal-container");
    const close = container.querySelector(".modal-close");
    const content = container.querySelector(".modal-content");
    const spinner = container.querySelector(".modal-spinner");
    const markdown = container.querySelector(".markdown-body");

    let cancelOpen = false;

    openBackdrop(40, () => { close.click(); });

    container.classList.remove("hidden");
    container.classList.add("flex");

    spinner.classList.remove("hidden");
    spinner.setAttribute("data-state", "opened");

    markdown.classList.add("hidden");
    markdown.setAttribute("data-state", "closed");

    markdown.onanimationend = () => {
        if (markdown.getAttribute("data-state") === "opened") return;

        container.classList.remove("flex");
        container.classList.add("hidden");
    };

    close.onclick = () => {
        markdown.setAttribute("data-state", "closed");
        cancelOpen = true;
        closeBackdrop();
    }

    const animationPromise = new Promise((resolve) => {
        spinner.onanimationend = () => { resolve(); }
    });

    let marked = await import("marked");
    try {
        const cutUrl = githubUrl.replace("https://github.com/", "");

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("GitHub timeout")), 5000)
        );
        const githubPromise = await fetch("https://raw.githubusercontent.com/" + cutUrl + "/main/README.md");

        const response = await Promise.race([githubPromise, timeoutPromise]);
        if (!response.ok) throw new Error("Could not fetch GitHub readme");

        let markdownText = await response.text();
        if (!markdownText) throw new Error("Could not fetch GitHub readme");

        content.innerHTML = marked.parse(markdownText, { gfm: true, breaks: true });

        await animationPromise;
        spinner.setAttribute("data-state", "closed");
    }
    catch (error) {
        console.log(error);
        content.innerHTML = error;

        await animationPromise;
        spinner.setAttribute("data-state", "closed");
    }

    spinner.onanimationend = () => {
        if (spinner.getAttribute("data-state") === "opened") return;
        if (cancelOpen) return;

        spinner.classList.add("hidden");
        markdown.classList.remove("hidden");
        markdown.setAttribute("data-state", "opened");
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

        nextElement.appendChild(video);
        a.remove();
    }
}