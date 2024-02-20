<div align="center">

# vrlabs.dev

[![Generic badge](https://img.shields.io/discord/706913824607043605?color=%237289da&label=DISCORD&logo=Discord&style=for-the-badge)](https://discord.vrlabs.dev/)
[![Generic badge](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dvrlabs%26type%3Dpatrons&style=for-the-badge)](https://patreon.vrlabs.dev/)

https://github.com/VRLabs/vrlabs.dev/assets/101019309/dd0f62f1-c7c8-4675-acb9-9c1db255e12a

</div>

---

## Tech Stack

### Frontend

* Astro
* Tailwind
* Vanilla JS

### Backend

* .NET
* Postgres
* FastEndpoints

### Other

* Icons from [Glyphs](https://glyphs.fyi)
* Markdown parser from [Marked](https://marked.js.org)
* Markdown stylesheet from [Sindresorhus](https://github.com/sindresorhus/github-markdown-css)

## Running locally

If you dont already have NVM installed, download the latest ``nvm-setup.zip`` from [here](https://github.com/coreybutler/nvm-windows/releases), then extract the zip and run the installer.

If you are on a Unix based machine like Linux or MacOS, run the following command to install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

You can verify that NVM is installed by running:

```bash
nvm --version
```

After installing NVM run the following commands in the directory of the project:

* ``nvm use`` to switch to the required Node version.
  * If the required version is not installed, you will be prompted to run the ``nvm install`` command.
  * After installing the required version, run ``nvm use`` again
* ``npm install`` to install the dependencies

To start testing locally you can use the following commands:

* ``npm run dev`` to start a local dev server at ``localhost:4321``
* ``npm run build`` to create a build of the website
* ``npm run preview`` to preview the build at ``localhost:4321``

If you are using VSCode you may be prompted to install some extensions which are recommended to be used when working on this project. If you are not using VSCode, please check if the most important extensions are available for your editor:

* [Astro](https://docs.astro.build/en/editor-setup/)
* [Tailwind](https://tailwindcss.com/docs/editor-setup)
* [Prettier](https://prettier.io/docs/en/editors.html)

This step is optional but HIGHLY recommended.

## Project Structure

The project is built on a vertical slice architecture, meaning every component is grouped with its related files.

```c
root
├── public
├── src
│   ├── components
│   │   └── component
│   │       ├── file.astro
│   │       ├── file.css
│   │       └── file.js
│   ├── layouts
│   ├── pages
│   └── styles
└── package.json
```

The sub-directory ``pages`` is mandatory. Every  ``astro`` ``html`` ``md`` and ``mdx`` file in this folder will be turned into an endpoint on the site corresponding to the file name.

Static assets like images or fonts can be placed in the ``public`` directory, as well as special files such as ``robots.txt`` and ``manifest.webmanifest``. Do not place CSS or JS files here, as they will be excluded from the bundle and optimization processes.

The ``package.json`` file contains all ``dependencies`` and ``devDependencies`` of the project. Try not to install packages as ``devDependencies`` unless there is a specific reason to do so, as Astro only runs throgh all ``dependencies`` at build time and will not include packages from ``devDependencies`` in the final build.

​

<div align="center">

[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/VRLabs.png" width="50" height="50">](https://vrlabs.dev "VRLabs")
<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Empty.png" width="10">
[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Discord.png" width="50" height="50">](https://discord.vrlabs.dev/ "VRLabs")
<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Empty.png" width="10">
[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Patreon.png" width="50" height="50">](https://patreon.vrlabs.dev/ "VRLabs")
<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Empty.png" width="10">
[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Twitter.png" width="50" height="50">](https://twitter.com/vrlabsdev "VRLabs")

</div>
