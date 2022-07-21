# Trait 开发文档

在本章节你可以通过一个 Timer Trait 的实例学习到如何实现自定义的 Trait 。

Trait 的开发和 Component 有诸多相似之处。

|                                 | Trait | Component |
| ------------------------------- | ----- | --------- |
| 拥有 Sepc                       | ✅    | ✅        |
| 拥有 properties, state, methods | ✅    | ✅        |
| 拥有 Implementation             | ✅    | ✅        |
| Implementation 是一个函数       | ✅    | ✅        |

Trait 本质上是一个函数。Trait 的作用是为了增加 Component 的能力。如果还是用面向对象来打比方，Trait 是 Component 的装饰器。比如说，给 Component 添加样式、添加状态等等。

Trait 的主要思路是，接受一系列参数，执行一些逻辑，返回 TraitResult，从而增强 Component 的能力。显然，这是一个纯函数的逻辑。因此，我们推荐把 Trait 实现为纯函数。即便不是纯函数，实现时也需要考虑到 Trait 被反复执行时的结果，尽量避免意料之外的副作用。

> ⚠️ 由于 Trait 是个纯函数，所以不能在 Trait 中使用 React hooks。

由于 Trait 没有自己的 id，所以 Trait 和 Component 共享 id。也就是说，**Trait 暴露的所有 State 和 Method 都会被添加到 Component 上**，访问和调用它们是和 Component 自己实现的无异。

## Trait 开发教程

接下来，让我们通过一个例子来学习如何开发一个 Trait。我们要实现一个 Timer Trait，它具有下面的能力：

- 指定一段时长的定时器，在定时器结束后弹出 alert
- 提供清除定时器的功能
- 可选择是否在 Component 挂载后立即开启一个定时器
- 可获取定时器的状态（`waiting`, `finished`, `stopped`）

### Trait Spec

#### Trait Spec 示例

首先我们来编写一个 Trait Spec，给 Trait 定义一些基本信息，比如版本和名称等：

```jsx
{
  version: 'custom/v1',
  metadata: {
    name: 'timer',
    description: 'Create a timer to alert, and could be clear.',
  },
  spec: {
    properties: PropsSpec, // 详见下文
    state: StateSpec, // 详见下文
    methods, // 详见下文
  },
}
```

#### Trait Properties Spec

接下来就可以开始思考要如何设计我们的 Timer Trait，首先来设计下需要传入 Timer Trait 的参数，也就是 Properties 的 Spec。

首先需要一个 `time` 参数来控制定时器的时间，和 `content` 参数来展示 alert 的内容。

另外还需要控制是否要在 Component 挂载后立刻触发，因此还要一个 `immediate` 参数。

于是就可以得到我们的 Props Spec：

```jsx
const PropsSpec = Type.Object({
  time: Type.Number(),
  content: Type.String(),
  immediate: Type.Boolean(),
});
```

> Trait 的 Props Spec 也是通过 TypeBox 定义的。

#### Trait State Spec

由于 Timer Trait 还需要暴露状态，所以我们还需要添加 State Spec ，来定义 Timer Trait 暴露的 State 以及其类型。

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
```

#### Trait Methods Spec

我们还需要提供 Method 给外部进行调用，来开启或者清除定时器，所以还需要对 Method 进行定义。这里我们提供 `start` 和 `stop` 两个 Method。

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
```

### Trait Factory & Implementation

在定义完成完整的 Trait Spec 之后，我们就可以开始着手实现 Timer Trait 的逻辑了。首先要实现一个 Trait 的工厂函数，其返回真正 Trait 的 Implementation。

在工厂函数中我们可以声明一些变量来存储数据，比如 Timer Trait 这里就需要创建一个 Map 来记录每个 Component 对应的 Timer ，以便用来清除计时器。

> 由于 Trait 本质是一个纯函数，无法拥有状态，所以 Trait 需要工厂函数。工厂函数提供了一个闭包，用来给 Trait 存储状态。要注意的是，对于同一种 Trait，所有的 Trait Implementation 实例，共用的是同一个闭包。

下面我们来看一下完整的实现代码：

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
    // 实现 clear method
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
    // 实现 start method
    const start = () => {
      clear();

      const timer = setTimeout(() => {
        // 计时器结束后，弹出 alert
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

    // 注册 Method 到组件中
    subscribeMethods({
      start,
      clear,
    });

    // 返回 Trait Result
    // 使用 componentDidMount 和 componentDidUnmount 生命周期来开启和清除计时器
    return {
      props: {
        // 在 Component 挂在后启动计时器
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
```

### Create Trait

最后，通过 `runtime` 提供的 `implementRuntimeTrait` 来生成最终的 Trait 。至此，完整的 Timer Trait 的实现就到这里完成啦。

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
```

## Trait API 文档

Trait Spec 和 Component 基本上是一样的，仅有些许不同。

| 参数名   | 类型      | 说明                                   |
| -------- | --------- | -------------------------------------- |
| version  | string    |                                        |
| kind     | `"Trait"` | 固定不变，表示这是一个 Trait 的 Spec。 |
| metadata |           | 详见下文                               |
| spec     |           | 详见下文                               |

### Trait Spec 的 Metadata

Trait Spec 的 metadata 内容比 Component 少一些。

| 参数名      | 类型                | 备注         |
| ----------- | ------------------- | ------------ |
| name        | string              | Trait 的名称 |
| annotations | Record<string, any> |              |

### Trait Spec 的 Spec 字段

| 参数名     | 类型                            | 备注 |
| ---------- | ------------------------------- | ---- |
| properties | JSONSchema                      |      |
| state      | JSONSchema                      |      |
| methods    | Record<KMethodName, JSONSchema> |      |

### Trait Implementation 的参数

Trait Implementation 接受的参数和 Component 几乎完全相同，可以参考 Component 的相关章节。

### TraitResult

TraitResult 是 Trait 最重要的部分，它是 Trait 函数的返回结果，将会被直接传给 Component 作为参数。更多具体内容，可以参考 Component Implementation 的参数的相关章节。

TraitResult 是一个 object，属性如下：

| 参数名              | 类型              | 是否必须 | 说明        |
| ------------------- | ------------------------ | -------- | ----- |
| customStyle         | Record<string, string>   | 否       | 传递给 Component 的样式 Map。object 的 value 应该是 CSS 字符串。 |
| callbackMap         | Record<string, Function> | 否       | Component 的回调函数 Map。主要用于 Event Trait。                 |
| componentDidUnmount | Function[]               | 否       | 生命周期钩子。将会在 Component 卸载后执行。                      |
| componentDidMount   | Function[]               | 否       | 生命周期钩子。将会在 Component 挂载后执行。                      |
| componentDidUpdate  | Function[]               | 否       | 生命周期钩子。将会在 Component 更新后执行。                      |
