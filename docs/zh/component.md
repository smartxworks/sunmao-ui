# Component 开发文档

Component 由两部分构成，一个是 Spec，一个是 Implementation。如果把 Component 想象成一个类的话，Spec 就是类的接口，Implementation 就是类的实现。

- Spec：用来描述 Component 的元信息、参数、状态、行为的一个数据结构
- Implementation：具体负责渲染 HTML 元素的函数。

## Component 开发教程

下面我们通过一个 Input Component 的例子，来学习如何开发一个 Component。这个 Input 组件有下面这些能力：

- 可以配置 placeholder，disabled 等参数
- 可以让外界访问当前值
- 可以发出 onBlur 等事件
- 可以让外界更新自己的值。
- 可以插入子组件，如前后缀等等。

### 编写 Component Spec

Spec 本质上是一个 JSON，它的作用是描述组件的参数、行为等信息。我们上述的所有能力都将会体现在 Spec 中。

首先我们来看一下这个 Input Component Spec 示例：

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

一开始面对这么多字段可能会比较迷茫，下面我们来逐一解释每个字段的含义。

> 详细的每个参数的类型和说明可以参考后面的 API 参考。

#### Component Spec Metadata

`metadata` 是一个 Component 的元信息，包括名称等信息。

首先我们来看一下 Spec 的完整的类型定义：

#### Component Spec Properties

`properties` 描述了 Component 能够接受的参数名称和类型。这里定义了两个参数，`placeholder`和`disabled` ，类型分别是 String 和 Boolean。

````
properties: Type.Object({
  placeholder: Type.String(),
  disabled: Type.Boolean(),
})
````

你可能对这种声明类型的方法感到陌生。前文已经说过，Spec 本质是一个 JSON，但 JSON 不像 Typescript 可以声明类型，所以当我们要在 Spec 中声明类型时，我们使用 [JSONSchema](https://json-schema.org/)。JSONSchema 本身也是 JSON，但是可以用来声明一个 JSON 数据结构的类型。

但手写 JSONSchema 比较困难，所以我们推荐使用 [TypeBox](https://github.com/sinclairzx81/typebox) 库来辅助生成 JSONSchema。示例中的写法就是调用了 TypeBox。

#### Component Spec State

`state`描述了 Component 暴露的状态。Input Component 只会暴露一个 `value`。定义方式和 `properties` 类似。

    state: Type.Object({
      value: Type.String(),
    })

#### Component Spec Method

`methods` 描述了 Component 暴露的方法。我们的 Input 打算暴露 `updateValue` 方法，以便让外界更新自己的值。

在 Spec 中 `updateValue` 这个键所对应的值是 `updateValue`可以接受的参数，同样是用 TypeBox 定义的。

    methods: {
      updateValue: Type.Object({
        value: Type.String(),
      }),
    }

#### Component Spec 的其他属性

`slots `代表 Component 预留的 Slot。每个 Slot 都可以插入子 Component 。其中 `slotProps`代表可以这个插槽会传递给子 Component 的额外的 props，以供子 Component 渲染时使用。

`styleSlots` 代表 Component 预留的可以插入样式的 Slot。一般每个 Component 都需要预留一个 `content` 的 styleSlot。

`events `代表 Component 可以发出的事件，以便外界监听。

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

#### Component Spec 示例解析

现在我们再来看一下一开始的示例，对照着解释一遍。

```javascript
const InputSpec = {
  version: 'arco/v1',
  metadata: {
    name: 'input',
    displayName: 'Input',
    exampleProperties: {
      placeholder: 'Input here',
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
    styleSlots: ['content'],
    events: ['onBlur'],
  },
};
```

这份 Spec 声明了一个 Input Component。它是 arco/v1 组件库的一部分，名字是 input。它的唯一标志符就是 arco/v1/input。

该 Component 的 properties 是用 TypeBox 声明的。它的 properties 包含两个参数，分别是 placeholder 和 disabled。它还会暴露一个状态 value 给外部访问。

在行为方面，它有一个 updateValue 方法，可以允许外部更新自己的 value。同时，作为一个 Input，它还会发出 onBlur 事件。

它还有两个 slot 可以插入子 Component，分别代表前缀和后缀。这两个 slot 没有要额外传递的 property。还有一个 content 的 styleSlot，可以添加自定义样式。

这就是这个 Input 组件的所有逻辑了，下面我们来看一下如何实现这个 Component 的 Implementation。

### Component Implementation

完成了 Component 的 Spec 之后，我们就要开发 Component 的具体实现，我们称之为 Component Implementation。理论上说，一份 Spec 可以对应很多个 Component，就好比一个接口可以对应多个类的实现一样。

Component Implementation 负责具体的渲染工作。它本质上是一个函数。它的参数比较复杂，我们按照 Input Component 的实际需求逐一介绍。

> 目前 Component Implementation 必须是一个 React 函数式组件，但以后不一定是一个 React 组件。以后我们计划让 Sunmao 支持用任何技术栈的组件，只要这个函数返回 DOM 元素就可以。

#### 读取 Component 的参数

首先，Component Implementation 应该要接受 Spec 中定义的 `properties`，也就是 `placeholder` 和 `disabled`。我们可以从参数中直接获取。然后，我们把这个参数传递给一个 input 的 JSX 元素，并返回。

```jsx
const InputImpl = props => {
  const { disabled, placeholder } = props;

  return <input disabled={disabled} placeholder={placeholder} />;
};
```

就这么简单！其实这已经是一个完整的 Component Implementation，但我们还有很多功能没有实现。

#### 暴露 Component 的状态

我们的 Input 将会暴露自己的状态，这就需要用到一个 Sunmao 内置的函数 `mergeState`。这个方法会被自动注入到 Component Implementation 中，可以像读取 `properties` 一样读取，调用方式如下。

```tsx
const InputComponent = props => {
  const { mergeState } = props;
  const [value, setValue] = useState('');

  // 当 value 改变时，调用 mergeState 方法。
  // 每次调用 mergeState 时，最新的 value 值将会合并到 Sunmao 状态树中，以供其他 Component 访问。
  useEffect(() => {
    mergeState({
      value,
    });
  }, [mergeState, value]);

  return <input value={value} onChange={newVal => setValue(newVal)} />;
};
```

#### 暴露 Component 的方法

我们的 Input 还会暴露自己的方法 `updateValue`。这也需要用到一个内置的方法 `subscribeMethods`。

```typescript
const InputComponent = props => {
  const { subscribeMethods } = props;
  const [value, setValue] = useState('');

  // 当dom元素挂载后，调用 subscribeMethods，注册 updateValue 方法。
  // 这样外界的 Component 就可以调用 updateValue，来改变 input 的 value了。
  useEffect(() => {
    subscribeMethods({
      updateValue: ({ value: newValue }) => {
        setValue(newValue);
      },
    });
  }, [subscribeMethods]);

  return <input value={value} />;
};
```

#### 发布 Event

我们的 Input 还会发布 onBlur 事件，来通知其他 Component 自己失焦了。这就需要用到另一个内置参数 `callbackMap`。

```jsx
const InputComponent = props => {
  const { callbackMap } = props;

  // callbackMap 中已经带有了对应事件的回调函数，在对应的时机直接调用即可。
  const onBlur = () => {
    if (callbackMap.onBlur) {
      callbackMap.onBlur();
    }
  };

  return <input onBlur={onBlur} />;
};
```

#### 预留 Slot 和 StyleSlot 的位置

Slot 和 StyleSlot 都是可以插入自定义内容的插槽，它们的位置需要事先预留。它们也同样需要对应的参数，分别是：`slotsElements`和`customStyle`。两个都是 js 对象，通过 slot 和 styleSlot 的名称就可以访问到对应的内容。

`slotsElements` 的内容一个函数，这个函数接受 `slotProps`，返回 JSX 元素。`slotProps` 是可选的，根据 spec 中的定义来传递。

`customStyle`是一个 styleSlot 和 CSS 字符串的 map。因为是 CSS 字符串，所以需要经过一定处理才能使用。我们推荐使用 `emotion` 作为 CSS-in-JS 的处理方案。

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
```

> 其实`customStyle`和`callbackMap`其实都是来自于 Trait 的参数，但目前你并不需要知道这一点，具体可以参考后面的 API 文档。

#### 暴露 DOM 元素给 Sunmao

#### elementRef & getElement

最后还有一步，这一步和 Component 自身的逻辑无关，但是 Sunmao 需要获取到 Componet 运行时的 DOM 元素，才能在 Editor 中获得这个组件。所以这一步需要把 Component 的 DOM 元素传递给 Sunmao。

Sunmao 提供了两个方法来传递 DOM 元素：`elementRef `和` getElement`。两个方法的作用是一样的，只是适合场景不同，只需选择一个实现即可。

如果 Component 是用 React 实现的，那么使用 `elementRef` 比较方便，只需要把 `elementRef` 传给 React 组件的 `ref `属性。如果这个方法不行，则只能用通用的 `getElement` 方法来注册组件的 DOM 元素了。

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

// 或者

const InputComponent = props => {
  const { elementRef } = props;

  return <input ref={elementRef} />;
};
```

#### 完整的 Component Implementation

最后我们把所有功能结合起来，实现一开始的 Input Component Spec 的所有逻辑。

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
```

### 封装 Spec 和 Implementation

写完 Component 的 Spec 和 Implementation 以后，离成功只差最后一步，就是把二者封装成 Sunmao runtime 能接受的格式。这一步很简单，只需要调用 `implementRuntimeComponent` 函数即可。

```javascript
import { implementRuntimeComponent } from '@sunmao-ui/runtime';

const InputComponent = implementRuntimeComponent(InputSpec)(InputImpl);
```

最后，这个组件添加到 lib 中即可，并在 Sunmao 启动时传给 `initSunmaoUI`就大功告成了。

```javascript
const lib: SunmaoLib = {
  components: [InputComponent],
  traits: [],
  modules: [],
  utilMethods: [],
};
```

## Component API 文档

### Component Spec

Spec 的第一层字段比较简单明了。

| 参数名   | 类型          | 说明                                                                                                        |
| -------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| version  | string        | Component 在 Sunmao 中的分类。同一套 Component 的`version`通常是一样的。格式为 "xxx/vx" ，例如"`arco/v1`"。 |
| kind     | `"Component"` | 固定不变，表示这是一个 Component Spec。                                                                     |
| metadata |               | 详见下文                                                                                                    |
| spec     |               | 详见下文                                                                                                    |

#### Component Spec 的 Metadata

Metadata 中包含了 Component 的元信息。

| 参数名            | 类型                 | 备注                                                                                  |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------- |
| name              | string               | Component 的名字。Component 的 `version` 和 `name`共同构成了 Component 的唯一标志符。 |
| description       | string?              |                                                                                       |
| displayName       | string?              | 在 Editor 中的 Component 列表中展示的名字。                                           |
| exampleProperties | Record<string, any>  | Component 在 Editor 中被创建时的初始 `properties`。                                   |
| annotations       | Record<string, any>? | 可以自定义声明一些字段。                                                              |

#### Component Spec 其余字段

 定义 `properties` 和 `state` 时，我们使用 [JSONSchema](https://json-schema.org/)。JSONSchema 本身也是 JSON，但是可以用来声明一个 JSON 数据结构的类型。有了类型的帮助，Sunmao 就可以对参数和表达式进行校验和和输入提示。

| 参数名     | 类型                                    | 备注                                                                        |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------- |
| properties | JSONSchema                              | Component 接受的参数。                                                      |
| state      | JSONSchema                              | Component 对外暴露的 State。                                                |
| methods    | Record<KMethodName, JSONSchema>         | Component 对外暴露的 Method。key 是 Method 的名字，value 是 Method 的参数。 |
| events     | string[]                                | Component 会发出的 Event。数组元素是 Event 的名字。                         |
| slots      | Record<string, {slotProps: JSONSchema}> | Component 预留的可以插入子 Component 的插槽。                               |
| styleSlots | string[]                                | Component 预留的可以添加样式的插槽。                                        |

### Component Implementation 参数

Component Implementation 的参数本质上一个 object，但是其实是由好几个组成部分合并而成的。大致可以分为：

- Component Spec 中声明的 Properties。这部分完全是 Component 自定义的。
- Sunmao Component API。这是 Sunmao 注入到 Component 中的。
- Trait 执行结果。这是 Trait 传递给组件的结果。
- services。这是 Sunmao 运行时的各个服务实例。

| 参数名          | 类型                                                           | 备注                                | 来源     |
| --------------- | -------------------------------------------------------------- | ----------------------------------- | -------- |
| component       | ComponentSchema                                                | Component 的 Schema                 | API      |
| app             | ApplicationSchema                                              | 整个 Application 的 Schema          | API      |
| slotsElements   | Record<string, (slotProps: any) => ReactElement[]>             | 子 Component 列表，详见下文         | API      |
| mergeState      | (partialState: object) => void                                 | 详见下文                            | API      |
| subscribeMethod | (methodsMap: Record<string, (params: object) => void>) => void | 详见下文                            | API      |
| elementRef      | React.Ref                                                      | 详见下文                            | API      |
| getElement      | (ele: HTMLElement) => void                                     | 详见下文                            | API      |
| services        | object                                                         | Sunmao 的各种服务实例，详见下文     | services |
| customStyle     | Record<string, string>                                         | 来自于 Trait 的自定义样式，详见下文 | Trait    |
| callbackMap     | Record<string, Function>                                       | 来自于 Trait 的回调函数，详见下文   | Trait    |

#### Services

Services 是 Sunmao 的各种服务的实例，包括状态管理、事件监听、组件注册等等。这些 Service 都是全局唯一的实例。

| 参数名           | 类型                     | 备注                                                         |
| ---------------- | ------------------------ | ------------------------------------------------------------ |
| registry         | Registry                 | Registry 上注册了 Sunmao 所有的 Component、Trait、Module，您可以在其中找到它们所对应的 Spec 和 Implementation。 |
| stateManager     | StateManager             | StateManager 管理着 Sunmao 的全局状态 Store，而且还具 eval 表达式的功能。 |
| globalHandlerMap | GlobalHandlerMap         | GlobalHandlerMap 管理着所有 Component 的 Method 实例。       |
| apiService       | ApiService               | ApiService 是全局事件总线。                                  |
| eleMap           | Map<string, HTMLElement> | eleMap 存放所有 Component 的 DOM 元素。                      |

> ⚠️ 一般情况下，您不需要使用这些服务。只有在实现一些特殊需求时，才可能会用到它们。

#### Sunmao Component API

##### `mergeState`

Component 可以拥有自己的局部状态，但是如果 Component 把自己的局部状态暴露给 Sunmao 的其他组件，就要通过`mergeState`函数把状态合并到 Sunmao 的全局状态 store 中。

当`mergeState`被调用时，所有引用了该状态的表达式都会立刻更新，其对应的组件也会立即更新。

##### `subscribeMethods`

`subscribeMethods` 的作用就是把组件的行为，以函数的形式注册到 Sunmao 中，以供其他 Component 调用。

Component 注册的 Method 并没有限制，它可以接受自定义参数，参数类型应该已经 Component Spec 中声明过了。参数在调用时会由 Sunmao 负责传递。

#### Trait 执行结果

所有 Trait 的执行结果都会作为参数传递给 Component。这些参数都是按照约定的接口生成的。Trait 和 Component 之间只能通过这个接口进行交互。**Component 必须正确处理下面这些参数**，否则，Component 就不能和别的 Trait 交互。

##### `customStyle`

在 Sunmao 中，样式的表现形式是 CSS。customStyle 是一个 styleSlot 和 CSS 的 map。您需要自己决定如何使用 CSS。Sunmao 使用的是 emotion 作为运行时的 CSS-In-JS 方案，您也可以选择自己喜欢的方案。

**我们约定一个 Component 必须要至少实现一个 `content`的 styleSlot，作为默认的 styleSlot。**

##### `callbackMap`

`callbackMap` 是组件对外暴露事件的方式。它是一个 Event 名称和回调函数的 Map。如果有其他 Component 监听了某个 Component 的 Event，那么事件回调函数就会通过 `callbackMap` 传递给该 Component。您需要在 Event 对应的代码的位置调用这个回调函数，这样其他 Component 才能成功监听该 Component 的 Event。

#### Sunmao Runtime API

Sunmao 不会限制 Component 内部的逻辑和实现方式，但是有一些接口必须要实现，否则 Component 将无法与 Sunmao 交互。这些接口都会以参数的方式传给 Component Implementation，参数如下：

##### slotsElements

slotsElements 是每个 Slot 中的子 Component 的列表。Component 可以声明自己的 Slot，每个 Slot 就是子 Component 插入的位置。

>  如果 Component 只有一个 slot，我们约定这个 slot 名字是 content。

##### elementRef & getElement

这两个 API 的作用是将 Component 渲染的 DOM 元素注册到 Sunmao 中。Sunmao 必须获取到每个 Component 的 DOM 元素才能实现一些功能，比如编辑器中高亮 Component 的功能。别的 Component 和 Trait 也可以利用 Component 的 DOM 元素实现功能。
