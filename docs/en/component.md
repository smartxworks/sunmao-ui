# Component Development Documentation

A *Component* consists of two parts, a *Spec* and an *Implementation*; if you think of a *Component* as a class, a *Spec* is the interface of the class and an *Implementation* is the implementation of the class.

- Spec: a data structure used to describe the meta information, parameters, state, and behavior of a Component
- Implementation: The function that is specifically responsible for rendering HTML elements.

## Component Development Tutorial

Let's learn how to develop a *Component* by using an example of an Input Component. This Input Component has the following capabilities.

- Configurable parameters such as placeholder, disabled, etc.
- Allow external access to the current value
- Can emit events such as `onBlur`
- Allow updating its values from outside.
- Allow insert child components, such as prefixes and suffixes, etc.

### Writing a Component Spec

A *Spec* is essentially a JSON that describes the parameters, behavior, and other information of a *Component*. All of our above information will be reflected in the *Spec*.

First, let's look at this Input Component *Spec* example.

```javascript
{
  version: "arco/v1",
  metadata: {
    name: "input",
    displayName: "Input",
    exampleProperties: {
      placeholder: "Input here",
      disabled: fasle,
    },
  },
  spec: {
    properties: Type.Object({
      placeholder: Type.String(),
      disabled: Type.Boolean(),
    }),
    state: Type.Object({
      value: Type.String(),
    }),
    methods: {
      updateValue: Type.Object({
        value: Type.String(),
      }),
    },
    slots: {
      prefix: {
        slotProps: Type.Object({}),
      },
      suffix: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: ["content"],
    events: ["onBlur"],
  },
};
```
It may be confusing to face so many fields at first, let's explain the meaning of each field one by one.

> For the detailed type and description of each parameter, please refer to the API reference below.

#### Component Spec Metadata

`metadata` is the meta-information of a *Component*, including information such as name and etc.

First, let's take a look at the complete type definition of *Spec*:

#### Component Spec Properties

`properties` describe the parameter names and types that the Component can accept. Two parameters are defined here, `placeholder` and `disabled`, of type *String* and *Boolean* respectively.

````
properties: Type.Object({
  placeholder: Type.String(),
  disabled: Type.Boolean(),
})
````

You may be unfamiliar with this way of declaring types. As mentioned earlier, *Spec* is essentially a JSON, but JSON can not declare types like Typescript, so when we want to declare types in *Spec*, we use [JSONSchema](https://json-schema.org/). JSONSchema itself is JSON but can be used to declare the type of a JSON data structure.

But handwritten JSONSchema is very difficult, so we recommend using libraries, like [TypeBox](https://github.com/sinclairzx81/typebox) to assist in generating JSONSchema. 

#### Component Spec State

`state` describes the state exposed by the *Component*. The input Component will only expose a `value`. The definition is similar to `properties`.

```
state: Type.Object({
  value: Type.String(),
})
```

#### Component Spec Method

`methods` describe the methods exposed by the Component. Our Input is going to expose the `updateValue` method so that the outside world can update its value.

The value corresponding to the key of `updateValue` in *Spec* is the acceptable parameter of `updateValue`, which is also defined by TypeBox.

```
methods: {
  updateValue: Type.Object({
    value: Type.String(),
  }),
}
```

#### Other properties of Component Spec

`slots` represent the *Slots* reserved by the *Component*. Each *Slot* can insert child Components. `slotProps` represents additional props that this slot will pass to the child Component when the child Component renders.

`styleSlots` represent the slots reserved by Component to insert styles. Generally, each Component needs to reserve a `content` *styleSlot*.

`events` represent events that the Component can emit for the outside world to listen to.

```
slots: {
  prefix: {
    slotProps: Type.Object({}),
  },
  suffix: {
    slotProps: Type.Object({}),
  },
},
styleSlots: ["content"],
events: ["onBlur"],
```

#### Component Spec example explanation

Now let's look at the example at the beginning and explain it again.

````javascript
const InputSpec = {
  version: 'arco/v1',
  metadata: {
    name: 'input',
    displayName: 'Input',
    exampleProperties: {
      placeholder: 'Input here',
      disabled: fade,
    },
  },
  spec: {
    properties: Type.Object({
      placeholder: Type.String(),
      disabled: Type.Boolean(),
    }),
    state: Type.Object({
      value: Type.String(),
    }),
    methods: {
      updateValue: Type.Object({
        value: Type.String(),
      }),
    },
    slots: {
      prefix: {
        slotProps: Type.Object({}),
      },
      suffix: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: ['content'],
    events: ['onBlur'],
  },
};
````

This *Spec* declares an Input Component. It is part of the *arco/v1* component library and named input. Its only identifier is *arco/v1/input*.

The properties of this *Component* are declared with TypeBox. Its properties contain two parameters, `placeholder` and `disabled`. It also exposes a state `value` to external access.

In terms of behavior, it has an `updateValue` method that can allow externals to update their own value. As an Input, it also emits the `onBlur` event.

It also has two slots for inserting child Components, representing `prefix` and `suffix` respectively. These two slots have no additional properties to pass. There is also a *styleSlot* for content where custom styles can be added.

This is all the logic of this Input component. Let's take a look at how to implement the *Implementation* of this *Component*.

### Component Implementation

After completing the *Spec* of *Component*, we will develop the specific implementation of *Component*, which we call *Component Implementation*. In theory, a *Spec* can correspond to many components, just as an interface can correspond to the implementation of multiple classes.

Component Implementation is responsible for the specific rendering work. It is essentially a function. Its parameters are more complicated, and we will introduce them one by one according to the actual needs of the Input Component.

> Currently, Component Implementation must be a React functional component. In the future, we plan to let Sunmao support components using any technology stack, as long as the function returns a DOM element.

#### Read parameters of Component

First, the Component Implementation should accept the `properties` defined in the Spec, that is, `placeholder` and `disabled`. We can get it directly from the parameters. Then, we pass this parameter to an input JSX element and return it.

```jsx
const InputImpl = props => {
  const { disabled, placeholder } = props;

  return <input disabled={disabled} placeholder={placeholder} />;
};
````

It's that simple! In fact, this is already a complete Component Implementation, but we still have many features to implement.

#### Expose the state of the Component

Our Input will expose its own state, which requires a Sunmao built-in function `mergeState`. This function will be automatically injected into the Component Implementation and can be read like `properties`, called as follows.

```tsx
const InputComponent = props => {
  const { mergeState } = props;
  const [value, setValue] = useState('');

  // When the value changes, call the mergeState method.
  // Each time mergeState is called, the latest value will be merged into the Sunmao state tree for other components to access.
  useEffect(() => {
    mergeState({
      value,
    });
  }, [mergeState, value]);

  return <input value={value} onChange={newVal => setValue(newVal)} />;
};
````

#### Expose Component's methods

Our Input also exposes its own method `updateValue`. This also requires the use of a built-in function `subscribeMethods`.

```typescript
const InputComponent = props => {
  const { subscribeMethods } = props;
  const [value, setValue] = useState('');

  // When the dom element is mounted, call subscribeMethods to register the updateValue method.
  // This way, the external Component can call updateValue to change the value of the input.
  useEffect(() => {
    subscribeMethods({
      updateValue: ({ value: newValue }) => {
        setValue(newValue);
      },
    });
  }, [subscribeMethods]);

  return <input value={value} />;
};
````

#### Emit Event

Our Input will also publish an `onBlur` event to notify other Components that it has lost focus. This requires another built-in parameter `callbackMap`.

```jsx
const InputComponent = props => {
  const { callbackMap } = props;

  // callbackMap already has the callback functions of the corresponding event, which can be called directly at the corresponding time.
  const onBlur = () => {
    if (callbackMap.onBlur) {
      callbackMap.onBlur();
    }
  };

  return <input onBlur={onBlur} />;
};
````

#### Reserve the position of Slot and StyleSlot

*Slot* and *StyleSlot* are slots that can insert custom content, and their positions need to be reserved in advance. They also need corresponding parameters, namely: `slotsElements` and `customStyle`. Both are js objects, and the corresponding content can be accessed through the names of slot and styleSlot.

The content of `slotsElements` is a function that takes `slotProps` and returns JSX elements. `slotProps` is optional and defined in the Spec.

`customStyle` is a map of styleSlot and CSS strings. Because it is a CSS string, it needs to be processed before it can be used. We recommend using `emotion` as a CSS-in-JS solution.

```tsx
const InputImpl = props => {
  const { slotsElements, customStyle } = props;

  return (
    <div>
      {slotsElements.prefix()}
      <input className={css(customStyle.content)} />
      {slotsElements.suffix()}
    </div>
  );
};
````

> In fact, `customStyle` and `callbackMap` are actually parameters from Trait, but you don't need to know this for now. For details, please refer to the API documentation below.

#### Expose DOM elements to Sunmao

#### elementRef & getElement

Here is one last step, which has nothing to do with the logic of the Component itself, but Sunmao needs to get the DOM element of the Component runtime to get this component in the Editor. So this step needs to pass the DOM element of the Component to Sunmao.

Sunmao provides two methods to pass DOM elements: `elementRef` and `getElement`. The functions of the two methods are the same, but they are suitable for different scenarios. Just choose one implementation.

If the Component is implemented by React, it is more convenient to use `elementRef`, just pass `elementRef` to the `ref` property of the React component. If this method does not work, you can only use the generic `getElement` method to register the DOM element of the component.

```typescript
const InputComponent = props => {
  const { getElement } = props;
  const ref = useRef(null);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return <input ref={ref} />;
};

// or

const InputComponent = props => {
  const { elementRef } = props;

  return <input ref={elementRef} />;
};
````

#### Complete Component Implementation

Finally, we combine all the functions to implement all the logic of the Input Component Spec at the beginning.

```tsx
const InputImpl = props => {
  const {
    disabled,
    placeholder,
    elementRef,
    slotsElements,
    customStyle,
    callbackMap,
    mergeState,
    subscribeMethods,
  } = props;

  const [value, setValue] = useState('');

  useEffect(() => {
    mergeState({
      value,
    });
  }, [mergeState, value]);

  useEffect(() => {
    subscribeMethods({
      updateValue: newValue => {
        setValue(newValue);
      },
    });
  }, [subscribeMethods]);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    if (callbackMap.onBlur) {
      callbackMap.onBlur();
    }
  };

  return (
    <div>
      {slotsElements.prefix()}
      <input
        ref={elementRef}
        className={css(customStyle.content)}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {slotsElements.suffix()}
    </div>
  );
};
````

### Combine Spec and Implementation

After writing the *Spec* and *Implementation* of *Component*, the only step away from success is to encapsulate the two into a format acceptable to Sunmao runtime. This step is very simple, just call the `implementRuntimeComponent` function.

````javascript
import { implementRuntimeComponent } from '@sunmao-ui/runtime';

const InputComponent = implementRuntimeComponent(InputSpec)(InputImpl);
````

Finally, add this component to lib and pass it to `initSunmaoUI` when Sunmao starts up and you're done.

````javascript
const lib: SunmaoLib = {
  components: [InputComponent],
  traits: [],
  modules: [],
  utilMethods: [],
};
````

## Component API Documentation

### Component Spec

The first-level fields of Spec are relatively straightforward.

| parameter name | type          | description                                                  |
| -------------- | ------------- | ------------------------------------------------------------ |
| version        | string        | Component classification in Sunmao. The `version` of the same set of Components is usually the same. The format is "xxx/vx" , eg "`arco/v1`". |
| kind           | `"Component"` | Fixed, indicating that this is a Component Spec.             |
| metadata       |               | See below for details                                        |
| spec           |               | See below for details                                        |

#### Metadata of Component Spec

Metadata contains the meta information of the Component.

| parameter name    | type                 | remarks                                                      |
| ----------------- | -------------------- | ------------------------------------------------------------ |
| name              | string               | The name of the Component. The `version` and `name` of a Component together constitute the unique identifier of the Component. |
| description       | string?              |                                                              |
| displayName       | string?              | The name to display in the Component list in the Editor.     |
| exampleProperties | Record<string, any>  | The initial `properties` for the Component when it was created in the Editor. |
| annotations       | Record<string, any>? | Some fields can be custom declared.                          |

#### Component Spec remaining fields

When defining `properties` and `state`, we use [JSONSchema](https://json-schema.org/). JSONSchema itself is JSON but can be used to declare the type of a JSON data structure. With type help, Sunmao can checksum and autocomplete for parameters and expressions.

| parameter name | type                                    | remarks                                                      |
| -------------- | --------------------------------------- | ------------------------------------------------------------ |
| properties     | JSONSchema                              | Parameters accepted by Component.                            |
| state          | JSONSchema                              | State exposed by Component.                                  |
| methods        | Record<KMethodName, JSONSchema>         | Method exposed by Component. The key is the name of the Method, and the value is the parameter of the Method. |
| events         | string[]                                | Events that the Component will emit. The array element is the name of the Event. |
| slots          | Record<string, {slotProps: JSONSchema}> | Component reserved slots that can be inserted into child Component. |
| styleSlots     | string[]                                | Component Reserved slots for adding styles.                  |

### Component Implementation Parameters

The parameter of Component Implementation is essentially an object, but it is actually a combination of several components. It can be roughly divided into:

- Properties declared in the Component Spec. This part is completely Component custom.
- Sunmao Component API. This is what Sunmao injects into the Component.
- Trait execution result. This is the result of the Trait passed to the component.
- services. These are the individual service instances of the Sunmao runtime.

| Parameter Name  | Type                                                         | Remarks                                                    | Source   |
| --------------- | ------------------------------------------------------------ | ---------------------------------------------------------- | -------- |
| component       | ComponentSchema                                              | Component's Schema                                         | API      |
| app             | ApplicationSchema                                            | Schema of the entire Application                           | API      |
| slotsElements   | Record<string, (slotProps: any) => ReactElement[]>           | List of child Component, see below for details             | API      |
| mergeState      | (partialState: object) => void                               | See below for details                                      | API      |
| subscribeMethod | (methodsMap: Record<string, (params: object) => void>) => void | See below for details                                      | API      |
| elementRef      | React.Ref                                                    | see below                                                  | API      |
| getElement      | (ele: HTMLElement) => void                                   | See below for details                                      | API      |
| services        | object                                                       | Various service instances of Sunmao, see below for details | services |
| customStyle     | Record<string, string>                                       | Custom style from Trait, see below                         | Trait    |
| callbackMap     | Record<string, Function>                                     | Callback function from Trait, see below for details        | Trait    |

#### Services

Services are instances of Sunmao's various services, including state management, event monitoring, component registration, and more. These Services are globally unique instances.

| parameter name | type | remarks |
| ---------------- | ------------------------ | ------------------------------------------------------------ |
| registry | Registry | All Sunmao Components, Traits, and Modules are registered on the Registry, where you can find their corresponding Spec and Implementation. |
| stateManager | StateManager | StateManager manages Sunmao's global state store and also has the function of eval expression. |
| globalHandlerMap | GlobalHandlerMap | GlobalHandlerMap manages all Component Method instances. |
| apiService | ApiService | ApiService is the global event bus. |
| eleMap | Map<string, HTMLElement> | eleMap stores all Component's DOM elements. |

> ⚠️ In general, you do not need to use these services. They may only be used when implementing some special requirements.

#### Sunmao Component API

##### `mergeState`

A Component can have its own local state, but if a Component exposes its own local state to other Sunmao components, the state must be merged into Sunmao's global state store through the `mergeState` function.

When `mergeState` is called, all expressions referencing the state are updated immediately, as are their corresponding components.

##### `subscribeMethods`

The function of `subscribeMethods` is to register the behavior of components in Sunmao in the form of functions for other components to call.

There is no limit to the Method registered by Component, it can accept custom parameters, and the parameter type should have been declared in Component Spec. Parameters will be passed by Sunmao when calling.

#### Trait execution result

All Trait execution results will be passed to Component as parameters. These parameters are generated according to the agreed interface. Trait and Component can only interact through this interface. **Components must handle the following parameters correctly**, otherwise, Components cannot interact with other Traits.

##### `customStyle`

In Sunmao, styles are expressed in CSS. customStyle is a map of styleSlot and CSS. You need to decide for yourself how to use CSS. Sunmao uses *emotion* as the runtime CSS-In-JS scheme, you can also choose your preferred library.

**We agree that a Component must implement at least one `content` styleSlot as the default styleSlot. **

##### `callbackMap`

`callbackMap` is how components expose events to the outside world. It is a Map of Event names and callback functions. If another Component listens to a Component's Event, the event callback function will be passed to the Component through `callbackMap`. You need to call this callback function in the code corresponding to the Event, so that other Component can successfully listen to the Component's Event.

#### Sunmao Runtime API

Sunmao does not limit the internal logic and implementation of Component, but there are some interfaces that must be implemented, otherwise Component will not be able to interact with Sunmao. These interfaces will be passed to Component Implementation as parameters, the parameters are as follows:

##### slotsElements

`slotsElements` is a list of child Components in each slot. A Component can declare its own Slot, and each Slot is where the child Component is inserted.

> If the Component has only one slot, we agree that the slot name is `content`.

##### elementRef & getElement

The role of these two APIs is to register the DOM elements rendered by the Component with Sunmao. Sunmao must obtain the DOM elements of each Component to implement some functions, such as the ability to highlight Components in the editor. Other Components and Traits can also use the Component's DOM elements to achieve functions.