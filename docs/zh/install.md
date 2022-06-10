# 安装 Sunmao 教程

Sunmao 是一个低代码框架。您可以使用 Sunmao 的 Cloud 版本，也可以自己部署一个 Sunmao 应用。

### 安装 Sunmao

Sunmao 有 runtime 和 editor 两个包。runtime 是用来运行 Sunmao 应用的包，editor 则是用来运行 Sunmao 编辑器的。开发者根据场景的需求，选择对应的包。如果你是初次体验 Sunmao，建议选择 editor。

不管是选择 runtime 还是 editor，都需要安装 react，因为 Sunmao 是基于 react 运行的。

#### 安装 Sunmao runtime

```
yarn add @sunmao-ui/runtime
yarn add react
yarn add react-dom
```

#### 安装 Sunmao editor

```
yarn add @sunmao-ui/editor
yarn add react
yarn add react-dom
```

### 启动 Sunmao

runtime 和 editor 的启动方式大致一样，只是方法名称和参数不同。

#### 启动 Sunmao runtime

```
import { initSunmaoUI } from "@sunmao-ui/runtime";
import React from "react";
import ReactDOM from "react-dom";

const { App } = initSunmaoUIEditor({});

ReactDOM.render(<App />, document.getElementById("root"));
```

#### 启动 Sunmao editor

```
import { initSunmaoUIEditor } from "@sunmao-ui/editor";
import React from "react";
import ReactDOM from "react-dom";

const { Editor } = initSunmaoUIEditor({});

ReactDOM.render(<Editor />, document.getElementById("root"));
```

### 引入 Sunmao Lib

Sunmao Lib 是自定义的 Sunmao Component、Trait、Module、UtilMethod 组成的数据结构，是开发者导入自定义组件库的接口。

```javascript
const lib = {
  components: [],
  traits: [],
  modules: [],
  utilMethods: [],
};
```

导入时，只需要把 lib 传递给 `initSunmaoUI`。

```javascript
const { App } = initSunmaoUIEditor({ libs: [lib] });
```

关于如何封装自定义 Component 等，可以参考 Component 开发文档。

### API

Sunmao 的初始化函数会接受一些参数。这些参数都是可选的，作用都是为了实现一些自定义逻辑。

#### `initSunmaoUI` 的参数

| 名称         | 类型                                                                                                 | 介绍                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| dependencies | Record<string, any>                                                                                  | 表达式求值时可以使用的依赖，可以是任何 JS 变量。        |
| hooks        | {<br /> didMount?: () => void;<br /> didUpdate?: () => void;<br /> didDomUpdate?: () => void;<br />} | Sunmao 应用的生命周期钩子。                             |
| libs         | SunmaoLib[]                                                                                          | 用来加载自定义的 Component，Trait，Module，UtilMethod。 |

#### `initSunmaoUI` 的返回结果

| 名称     | 类型            | 介绍                            |
| -------- | --------------- | ------------------------------- |
| App      | React Component | 渲染 Sunmao 应用的 React 组件。 |
| Registry | Registry        | 注册自定义的 Component，Trait。 |

#### `initSunmaoUIEditor` 的参数

| 名称               | 类型                                                                                                  | 介绍                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| App                | React Component                                                                                       | 渲染 Sunmao 应用的 React 组件。                            |
| widgets            | ImplementedWidget[]                                                                                   | 自定义的 editor widget。                                   |
| storageHandler     | {<br />onSaveApp?: (app: Application) => void,<br />onSaveModules?: (module: Module[]) => void<br />} | 保存的回调函数，用于编写持久化存储 Application 和 Module。 |
| defaultApplication | Application                                                                                           | 默认的 Application Schema。                                |
| defaultModules     | Module[]                                                                                              | 默认的 Module。                                            |
| runtimeProps       | Sunmao Runtime Props                                                                                  | 同 `initSunmaoUI` 的参数                                   |

#### `initSunmaoUIEditor` 的返回结果

同`initSunmaoUI` 的返回结果。

### App 组件的参数

| 名称    | 类型        | 介绍                               |
| ------- | ----------- | ---------------------------------- |
| options | Application | Sunmao 应用的 Application Schema。 |
