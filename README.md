<div align="center">
  <h1>🪵 Sunmao-UI 🪚</h1>
</div>


<p align="center">
  <img alt="MIT License" src="https://img.shields.io/github/license/webzard-io/sunmao-ui"/>
  <a href="https://github.com/webzard-io/sunmao-ui/issues">
    <img src="https://img.shields.io/github/issues/webzard-io/sunmao-ui" alt="GitHub issues">
  </a>
  <img alt="Github Stars" src="https://badgen.net/github/stars/webzard-io/sunmao-ui" />
</p>

> 🚧 **Sunmao-UI  is heavily under construction!** 🚧 As excited as you may be, we don't recommend this early alpha for production use. Still, give it a try if you want to have some fun and don't mind [logging bugs](https://github.com/webzard-io/sunmao-ui/issues) along the way :)

Sunmao-UI is a low code front end framework, by which you can easily build you front end app with any UI libray you like! Try online demo [here](https://deploy-preview-179--mystifying-kirch-d00a2f.netlify.app/).

## 📖 Features

* Encapsulate any kind of ui components and reuse them in low code editor
* Easily extend component abilities

##  📁 Directory

Sunmao-UI is a monorepo, includes: 

* Core: the type definition of Sunmao-UI.
* Runtime: a runtime to render Sunmao-UI application.
* Editor: a gui-editor of Sunmao-UI.

## 🖥️ Local development

```sh
yarn global add lerna
yarn
cd packages/editor
yarn dev
```

### 🧪 Test

```shell
yarn test:ci
```

### 🔧Build

```shell
yarn prepublish 
```

After modifying `runtime` or `core` files, must rebuild them. Otherwise, the place where these two packages are called in the `editor` will not change.
## ⚖️ LICENSE

MIT © [Open Sauced](LICENSE)