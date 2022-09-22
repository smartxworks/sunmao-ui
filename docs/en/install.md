# Install Sunmao Tutorial

Sunmao is a low-code framework. You can use Sunmao's Cloud version, or you can deploy a Sunmao application yourself.

### Install Sunmao

Sunmao has two packages, runtime and editor. The runtime is the package used to run Sunmao applications, and the editor is used to run the Sunmao editor. The developer selects the corresponding package according to the needs of the scenario. If you are experiencing Sunmao for the first time, it is recommended to choose the editor.

No matter whether you choose runtime or editor, you need to install react, because Sunmao runs based on react.

#### Install Sunmao runtime

````
yarn add @sunmao-ui/runtime
yarn add react
yarn add react-dom
````

#### Install Sunmao editor

````
yarn add @sunmao-ui/editor
yarn add react
yarn add react-dom
````

### Start Sunmao

The runtime and editor are started in roughly the same way, but with different method names and parameters.

#### Start Sunmao runtime

````
import { initSunmaoUI } from "@sunmao-ui/runtime";
import React from "react";
import ReactDOM from "react-dom";

const { App } = initSunmaoUIEditor({});

ReactDOM.render(<App />, document.getElementById("root"));
````

#### Start Sunmao editor

````
import { initSunmaoUIEditor } from "@sunmao-ui/editor";
import React from "react";
import ReactDOM from "react-dom";

const { Editor } = initSunmaoUIEditor({});

ReactDOM.render(<Editor />, document.getElementById("root"));
````

### Import Sunmao Lib

Sunmao Lib is a data structure composed of customized Sunmao Component, Trait, Module, and UtilMethod, and is an interface for developers to import custom component libraries.

````javascript
const lib = {
  components: [],
  traits: [],
  modules: [],
  utilMethods: [],
};
````

When importing, just pass lib to `initSunmaoUI`.

````javascript
const { App } = initSunmaoUIEditor({ libs: [lib] });
````

For how to encapsulate custom Component, etc., you can refer to the Component development documentation.

### API

Sunmao's initialization function accepts some parameters. These parameters are optional and are used to implement some custom logic.

#### Parameters of `initSunmaoUI`

| Name         | Type                                                                                                 | Introduction                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| dependencies | Record<string, any>                                                                                  | Dependencies that can be used when the expression is evaluated, can be any JS variable. |
| hooks        | {<br /> didMount?: () => void;<br /> didUpdate?: () => void;<br /> didDomUpdate?: () => void;<br />} | Sunmao Application lifecycle hooks.                                                     |
| libs         | SunmaoLib[]                                                                                          | Used to load custom Component, Trait, Module, UtilMethod.                               |

#### The return result of `initSunmaoUI`

| Name     | Type            | Introduction                                     |
| -------- | --------------- | ------------------------------------------------ |
| App      | React Component | The React component that renders the Sunmao app. |
| Registry | Registry        | Register custom Component, Trait.                |

#### Parameters of `initSunmaoUIEditor`

| Name               | Type                                                                                                  | Introduction                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| App                | React Component                                                                                       | The React component that renders the Sunmao app.                    |
| widgets            | ImplementedWidget[]                                                                                   | Custom editor widget.                                               |
| storageHandler     | {<br />onSaveApp?: (app: Application) => void,<br />onSaveModules?: (module: Module[]) => void<br />} | callback function for persistent storage of Application and Module. |
| defaultApplication | Application                                                                                           | Default Application Schema.                                         |
| defaultModules     | Module[]                                                                                              | Default Module.                                                     |
| runtimeProps       | Sunmao Runtime Props                                                                                  | Same as `initSunmaoUI` parameter                                    |

#### Return result of `initSunmaoUIEditor`

Same as the return result of `initSunmaoUI`.

### Parameters of App component

| Name    | Type        | Introduction                                |
| ------- | ----------- | ------------------------------------------- |
| options | Application | Application Schema for Sunmao applications. |
