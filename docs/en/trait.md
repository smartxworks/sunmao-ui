# Trait development documentation

In this chapter you can learn how to implement a custom *Trait* through an example of a Timer Trait.

*Trait* development and *Component* have many similarities.

| | Trait | Component |
| ------------------------------- | ----- | --------- |
| Owned Sepc | ✅ | ✅ |
| Has properties, state, methods | ✅ | ✅ |
| Has Implementation | ✅ | ✅ |
| Implementation is a function | ✅ | ✅ |

*Trait* is essentially a function. The role of Trait is to increase the capabilities of the Component. If the object-oriented analogy is still used, Trait is a decorator of Component. For example, adding styles, adding state, etc.

The main idea of ​​Trait is to accept a series of parameters, run some logic, and return *TraitResult*, thereby enhancing the capabilities of the Component. Obviously, this is the logic of a pure function. Therefore, we recommend implementing Trait as a pure function. Even if it is not a pure function, the implementation needs to consider the result when the Trait is repeatedly executed, and try to avoid unexpected side effects.

> ⚠️ Since Trait is a pure function, React hooks cannot be used in Trait.

Since Trait doesn't have its own id, Trait and Component share id. That is to say, all the States and Methods exposed by the Trait will be added to the Component, and accessing and calling them is no different from what the Component implements itself.

## Trait development tutorial

Next, let's learn how to develop a Trait with an example. We want to implement a Timer Trait that has the following capabilities:

- Specify a timer for a period of time, and an alert will pop up after the timer expires
- Provides the function of clearing the timer
- You can choose whether to start a timer immediately after the Component is mounted
- Get timer status (`waiting`, `finished`, `stopped`)

### Trait Spec

#### Trait Spec Example

First, let's write a Trait Spec and define some basic information for the Trait, such as version and name:

```jsx
{
  version: 'custom/v1',
  metadata: {
    name: 'timer',
    description: 'Create a timer to alert, and could be clear.',
  },
  spec: {
    properties: PropsSpec, // see below for details
    state: StateSpec, // see below for details
    methods, // see below
  },
}
````

#### Trait Properties Spec

Next, we can start thinking about how to design our Timer Trait. First, we need to design the parameters that need to be passed into the Timer Trait, that is, the Spec of Properties.

First you need a `time` parameter to control the time of the timer, and a `content` parameter to display the content of the alert.

In addition, you need to control whether to trigger immediately after the Component is mounted, so there is also an `immediate` parameter.

So we can get our Props Spec:

```jsx
const PropsSpec = Type.Object({
  time: Type.Number(),
  content: Type.String(),
  immediate: Type.Boolean(),
});
````

> Trait's Props Spec is also defined by TypeBox.

#### Trait State Spec

Since Timer Trait also needs to expose state, we also need to add State Spec to define the State exposed by Timer Trait and its type.

```jsx
const StateSpec = Type.Object({
  status: Type.KeyOf(
    Type.Object({
      waiting: Type.Boolean(),
      finished: Type.Boolean(),
      stopped: Type.Boolean(),
    })
  ),
});
````

#### Trait Methods Spec

We also need to provide Method to call externally to start or clear the timer, so we also need to define Method. Here we provide `start` and `stop` two methods.

```jsx
const methods = [
  {
    name: 'start',
    parameters: Type.Object({}),
  },
  {
    name: 'clear',
    parameters: Type.Object({}),
  },
];
````

### Trait Factory & Implementation

After defining the complete Trait Spec, we can start implementing the logic of Timer Trait. The first thing to do is to implement a factory function of a Trait, which returns the Implementation of the real Trait.

In the factory function, we can declare some variables to store data, such as Timer Trait Here we need to create a Map to record the Timer corresponding to each Component so that it can be used to clear the timer.

> Since Trait is essentially a pure function and cannot have state, Trait needs a factory function. The factory function provides a closure to store state for the trait. It should be noted that for the same Trait, all Trait Implementation instances share the same js closure.

Let's take a look at the complete implementation code:

```jsx
const TimerTraitFactory = () => {
  const map = new Map();

  return props => {
    const {
      time,
      content,
      immediate,
      services,
      componentId,
      subscribeMethods,
      mergeState,
    } = props;
    // implement clear method
    const clear = () => {
      const timer = map.get(componentId);

      if (timer) {
        clearTimeout(timer);
        mergeState({
          status: 'stopped',
        });
        map.delete(componentId);
      }
    };
    // implement start method
    const start = () => {
      clear();

      const timer = setTimeout(() => {
        // When the timer expires, an alert pops up
        alert(content);
        mergeState({
          status: 'finished',
        });
      }, time || 0);

      mergeState({
        status: 'waiting',
      });
      map.set(componentId, timer);
    };

    // register the method to the component
    subscribeMethods({
      start,
      clear,
    });

    // return Trait Result
    // Use the componentDidMount and componentDidUnmount lifecycles to start and clear timers
    return {
      props: {
        // start the timer after the Component hangs
        componentDidMount: [
          () => {
            if (immediate) {
              start();
            }
          },
        ],
        componentDidUnmount: [
          () => {
            clear();
          },
        ],
      },
    };
  };
};
````

### Create Trait

Finally, generate the final Trait through the `implementRuntimeTrait` provided by `runtime`. So far, the complete implementation of Timer Trait is completed here.

```jsx
export default implementRuntimeTrait({
  version: 'custom/v1',
  metadata: {
    name: 'timer',
    description: 'Create a timer to alert, and could be clear.',
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods,
  },
})(TimerTraitFactory);
````

## Trait API Documentation

Trait Spec and Component are basically the same, with only a few differences.

| parameter name | type | description |
| -------- | --------- | ------------------------------ -------- |
| version | string | |
| kind | `"Trait"` | Fixed, indicating that this is a Trait Spec. |
| metadata | | See below for details |
| spec | | See below for details |

### Metadata of Trait Spec

The metadata content of Trait Spec is less than that of Component.

| parameter name | type | remarks |
| ----------- | ------------------- | ------------ |
| name | string | Trait's name |
| annotations | Record<string, any> | |

### Spec field of Trait Spec

| parameter name | type | remarks |
| ---------- | ------------------------------- | ---- |
| properties | JSONSchema | |
| state | JSONSchema | |
| methods | Record<KMethodName, JSONSchema> | |

### Parameters of Trait Implementation

The parameters accepted by Trait Implementation are almost the same as Component, you can refer to the relevant chapter of Component.

### TraitResult

TraitResult is the most important part of Trait. It is the return result of the Trait function and will be passed directly to the Component as a parameter. For more details, please refer to the relevant chapters of the parameters of Component Implementation.

TraitResult is an object with the following properties:

| Parameter name | Type | Required | Description |
| ------------------- | ------------------------ | ------- | ---------- |
| customStyle | Record<string, string> | No | Style map passed to the Component. The value of the object should be a CSS string. |
| callbackMap | Record<string, Function> | No | Map of callback functions for Component. Mainly used for Event Trait. |
| componentDidUnmount | Function[] | No | Lifecycle hook. Will be executed after the Component is unloaded. |
| componentDidMount | Function[] | No | Lifecycle hook. Will be executed after the Component is mounted. |
| componentDidUpdate | Function[] | No | Lifecycle hook. Will be executed after the Component is updated. |