<div align="center">
  <a href='https://sunmao-ui.com' target='_blank'>
    <img src="./docs/images/logo.png" alt="logo" width="200"  />
  </a>
</div>
<div align="center">
  <h1>Sunmao</h1>
</div>

<p align="center">
  <img alt="Apache-2.0" src="https://img.shields.io/github/license/smartxworks/sunmao-ui"/>
  <a href="https://github.com/smartxworks/sunmao-ui/issues">
    <img src="https://img.shields.io/github/issues/smartxworks/sunmao-ui" alt="GitHub issues">
  </a>
  <img alt="Github Stars" src="https://badgen.net/github/stars/smartxworks/sunmao-ui" />
  <a href="https://join.slack.com/t/sunmao/shared_invite/zt-1cgk81ebm-DyG9p2D5GNFS6vtbQwWj7A">
    <img src="https://img.shields.io/badge/slack-@sunmao-purple.svg?logo=slack" alt="Join the chat at Slack">
  </a>
</p>

Sunmao(榫卯 /suən mɑʊ/) is a front-end low-code framework. Through Sunmao, you can easily encapsulate any front-end UI components into low-code component libraries to build your own low-code UI development platform, making front-end development as tight as Sunmao("mortise and tenon" in Chinese).

[中文](./docs/zh/README.md)

## DEMO

The offcial website of Sunmao is developed by Sunmao, try it from here: [Sunmao website editor](https://sunmao-ui.com/dev.html)

We also provide an open-to-use template: [Sunmao Starter Kit](https://github.com/webzard-io/sunmao-start)

## Why Sunmao?

### Responsive low-code framework

Sunmao chooses a responsive solution that is easy to understand and has excellent performance, making Sunmao intuitive and quick to start.

### Powerful low-code GUI editor

Sunmao has a built-in GUI editor, which almost includes all the capabilities that a complete low-code editor should have.

### Extremely Extensible

Both the UI component library itself and the low-code editor support custom extensions. Developers can register various components to meet the needs of application and continue to use the existing visual design system.

### Type Safety

You are in type safety both when developing Sunmao components and when using the Sunmao editor. Sunmao heavily uses Typescript and JSON schema for a great type system.

For more details, read [Sunmao: A truly extensible low-code UI framework](./docs/en/what-is-sunmao.md).

## Tutorial

Sunmao users are divided into two roles, one is developer and the other is user.

The responsibilities of developers are similar to those of common front-end developers. They are responsible for developing UI components and encapsulating common UI components to Sunmao components. Developers need to write code to implement the logic of components.

The user's responsibility is to use the Sunmao components encapsulated by developers to build front-end applications in the Sunmao low-code editor. Users do not need front-end knowledge and programming skills. They can finish building the application through UI interaction only.

We have prepared two tutorials for user and developer. The user only needs to read the user's tutorial, while the developer must read both.

- [User's Tutorial](./docs/en/user.md)
- [Developer's Tutorial](./docs/en/developer.md)

## local development

### Start

```sh
yarn
cd packages/editor
yarn dev
```

### Test

```shell
yarn test:ci
```

### Build

```shell
yarn
```

> When you run the runtime or editor locally, if you modify the code of other packages, you must rebuild the modified package, otherwise, the runtime and editor will still run the old code.

## License

Apache-2.0
