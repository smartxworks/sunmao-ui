# Meta UI

## 版本

当前 Meta UI **规范**版本为 **v0.1.0**。

## 目标

Meta UI 的目标是通过提供一种元数据格式用于描述 UI，将开发过程抽象为一个通用平台，从而以更高效的方式开发更高质量的 UI。

为此衍生出两种角色：

- 平台搭建者。
- 平台使用者。

平台搭建者为平台增添更多的能力，因此他们关心平台的**扩展性**；平台使用者基于平台提供的能力开发 UI，因此他们关心平台的**易用性**。

Meta UI 的规范则是平台搭建者与使用者之间沟通的桥梁。

## 概述与术语

当前版本规范中定义了以下内容

- 组件（component）代表了一个 UI 单元，包含其运行时实现与接口。
- 特征（trait）代表了一个 component 所能拥有的能力，一个 component 可以应用多个 trait。
- 域（scope）代表了一组 component 的边界，不同 scope 内的 component 无法互相访问，一个 component 可以属于多个 scope。
- 应用（application）包含了一组 component、trait、scope 的元数据与配置参数。

![](/Users/yanzhen/workspace/meta-ui/assets/overview.png)

## Component

Component 的模型定义了自身对外提供的配置项与可接受的 trait。

### Top-Level Attributes

| Attribute | Type                            | Required | Default Value | Description                               |
| --------- | ------------------------------- | -------- | ------------- | ----------------------------------------- |
| version   | String                          | Y        |               | Component 版本，格式为 `category/version` |
| kind      | String                          | Y        |               | 需为 Component                            |
| metadata  | [Metadata](#Metadata)           | Y        |               | 元数据                                    |
| spec      | [ComponentSpec](#ComponentSpec) | Y        |               | Component 规范定义                        |

### Metadata

| Attribute   | Type   | Required | Default Value | Description |
| ----------- | ------ | -------- | ------------- | ----------- |
| name        | String | Y        |               | 名称        |
| description | String | N        |               | 描述        |

### ComponentSpec

| Attribute    | Type           | Required | Default Value | Description                 |
| ------------ | -------------- | -------- | ------------- | --------------------------- |
| properties   | JSONSchema[]   | Y        | {}            | Component 配置项定义        |
| acceptTraits | TraitSchema[]  | Y        | []            | Component 可适配的 Trait    |
| state        | JSONSchema     | Y        | {}            | 外部可访问的 Component 状态 |
| methods      | MethodSchema[] | Y        | []            | 外部可调用的 Component 方法 |

### TraitSchema

| Attribute | Type   | Required | Default Value | Description |
| --------- | ------ | -------- | ------------- | ----------- |
| name      | String | Y        |               | Trait 名称  |


### MethodSchema

| Attribute  | Type       | Required | Default Value | Description |
| ---------- | ---------- | -------- | ------------- | ----------- |
| name       | String     | Y        |               | 方法名称    |
| parameters | JSONSchema | N        |               | 方法参数    |

### Example

以下是一个输入框 Component 的模型示例

```json
{
  "version": "core/v1",
  "kind": "Component",
  "metadata": {
    "name": "Input"
  },
  "spec": {
    "properties": [
      {
        "name": "type",
        "type": "string"
      }
    ],
    "acceptTraits": [
      {
        "name": "layout"
      }
    ],
    "state": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        }
      }
    },
    "methods": [
      {
        "name": "reset"
      }
    ]
  }
}
```

将上述 Component 模型载入 meta-ui 平台后，平台使用者就可以定义以下的 Application 使用该 Component。

```json
{
  "version": "core/v1",
  "kind": "Application",
  "metadata": {
    "name": "input-demo-app"
  },
  "spec": {
    "components": [
      {
        "id": "input1",
        "type": "core/v1/Input",
        "properties": {
          "type": "text"
        }
      }
    ]
  }
}
```

## Trait

Trait 定义了自身提供的 runtime 能力以及与 Component 交互的方式。

### Top-Level Attributes

| Attribute | Type                    | Required | Default Value | Description                           |
| --------- | ----------------------- | -------- | ------------- | ------------------------------------- |
| version   | String                  | Y        |               | Trait 版本，格式为 `category/version` |
| kind      | String                  | Y        |               | 需为 Trait                            |
| metadata  | [Metadata](#Metadata)   | Y        |               | 元数据                                |
| spec      | [TraitSpec](#TraitSpec) | Y        |               | Trait 规范定义                        |

### TraitSpec

| Attribute  | Type           | Required | Default Value | Description                   |
| ---------- | -------------- | -------- | ------------- | ----------------------------- |
| properties | JSONSchema[]   | Y        | {}            | Trait 配置项定义              |
| state      | JSONSchema     | Y        | {}            | Trait 为 Component 添加的状态 |
| methods    | MethodSchema[] | Y        | []            | Trait 为 Component 添加的方法 |

### Example

以下是一个布局 trait 的定义示例

```json
{
  "version": "core/v1",
  "kind": "Trait",
  "metadata": {
    "name": "layout"
  },
  "spec": {
    "properties": [
      {
        "name": "width",
        "type": "number"
      },
      {
        "name": "height",
        "type": "number"
      },
      {
        "name": "left",
        "type": "number"
      },
      {
        "name": "top",
        "type": "number"
      }
    ],
    "state": {},
    "methods": []
  }
}
```

将上述 Trait 定义载入 meta-ui 平台后，平台使用者就可以定义以下的 Application 使用该 Trait。

```json
{
  "version": "core/v1",
  "kind": "Application",
  "metadata": {
    "name": "input-demo-app"
  },
  "spec": {
    "components": [
      {
        "id": "input1",
        "type": "core/v1/Input",
        "properties": {
          "type": "text"
        },
        "traits": [
          {
            "type": "core/v1/layout",
            "properties": {
              "width": 2,
              "height": 1,
              "left": 2,
              "top": 0
            }
          }
        ]
      }
    ]
  }
}
```

## Scope

Scope 定义了自身提供的 runtime 隔离能力。

### Top-Level Attributes

| Attribute | Type                  | Required | Default Value | Description                           |
| --------- | --------------------- | -------- | ------------- | ------------------------------------- |
| version   | String                | Y        |               | Scope 版本，格式为 `category/version` |
| kind      | String                | Y        |               | 需为 Scope                            |
| metadata  | [Metadata](#Metadata) | Y        |               | 元数据                                |

## Application

Application 由平台使用者定义，描述了哪些 Component、Trait、Scope 组成了该应用。

### Top-Level Attributes

| Attribute | Type                                | Required | Default Value | Description                                 |
| --------- | ----------------------------------- | -------- | ------------- | ------------------------------------------- |
| version   | String                              | Y        |               | Application 版本，格式为 `category/version` |
| kind      | String                              | Y        |               | 需为 Application                            |
| metadata  | [Metadata](#Metadata)               | Y        |               | 元数据                                      |
| spec      | [ApplicationSpec](#ApplicationSpec) | Y        |               | Application 规范定义                        |

### ApplicationSpec

| Attribute  | Type                   | Required | Default Value | Description                     |
| ---------- | ---------------------- | -------- | ------------- | ------------------------------- |
| components | ApplicationComponent[] | Y        |               | Application 中的 Component 配置 |
### ApplicationComponent

| Attribute  | Type                                | Required | Default Value | Description                                      |
| ---------- | ----------------------------------- | -------- | ------------- | ------------------------------------------------ |
| id         | String                              | Y        |               | Component 在应用中的唯一标识                     |
| type       | String                              | Y        |               | 对应 Component `metadata` 中的 `name`            |
| properties | JSON                                | Y        |               | 对应 Component `spec` 中 `properties` 定义的模型 |
| traits     | [ComponentTrait](#ComponentTrait)[] | Y        |               | Component 使用的 Trait 定义                      |
| scopes     |                                     | N        |               | TO_BE_DETERMINED                                 |

### ComponentTrait

| Attribute  | Type   | Required | Default Value | Description                                  |
| ---------- | ------ | -------- | ------------- | -------------------------------------------- |
| type       | String | Y        |               | 对应 Trait `metadata` 中的 `name`            |
| properties | JSON   | Y        |               | 对应 Trait `spec` 中 `properties` 定义的模型 |

### Example

一个 Application 示例如下：

```json
{
  "version": "core/v1",
  "kind": "Application",
  "metadata": {
    "name": "input-demo-app"
  },
  "spec": {
    "components": [
      {
        "id": "page1",
        "type": "core/v1/Container",
        "properties": {},
        "traits": [
          {
            "type": "core/v1/route",
            "properties": {
              "path": "/app"
            }
          },
          {
            "type": "core/v1/children",
            "properties": {
              "ids": ["input1"]
            }
          }
        ]
      },
      {
        "id": "input1",
        "type": "core/v1/Input",
        "properties": {
          "type": "text"
        },
        "traits": [
          {
            "type": "core/v1/layout",
            "properties": {
              "width": 2,
              "height": 1,
              "left": 2,
              "top": 0
            }
          }
        ]
      }
    ]
  }
}
```

