import { Application } from '@sunmao-ui/core';

const basicUsage: Application = {
  "version": "sunmao/v1",
  "kind": "Application",
  "metadata": {
    "name": "some App"
  },
  "spec": {
    "components": [
      {
        "id": "stack21",
        "type": "core/v1/stack",
        "properties": {
          "spacing": 12,
          "direction": "vertical",
          "align": "start",
          "wrap": "",
          "justify": ""
        },
        "traits": []
      },
      {
        "id": "text25",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "**Vertical**",
            "format": "md"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack21",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "stack22",
        "type": "core/v1/stack",
        "properties": {
          "spacing": 0,
          "direction": "horizontal",
          "align": "center",
          "wrap": "",
          "justify": "flex-start"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack21",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/style",
            "properties": {
              "styles": [
                {
                  "styleSlot": "content",
                  "style": "border:1px solid #ddd;\npadding:10px;"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "text23",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "item 1",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack22",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "divider24",
        "type": "arco/v1/divider",
        "properties": {
          "type": "vertical",
          "orientation": "center"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack22",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text23_copy5",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "item 2",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack22",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "divider24_copy7",
        "type": "arco/v1/divider",
        "properties": {
          "type": "vertical",
          "orientation": "center"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack22",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text23_copy6",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "item 3",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack22",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text25_copy8",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "**horizontal**",
            "format": "md"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack21",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "stack18",
        "type": "core/v1/stack",
        "properties": {
          "spacing": 0,
          "direction": "vertical",
          "align": "start",
          "wrap": "",
          "justify": ""
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack21",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/style",
            "properties": {
              "styles": [
                {
                  "styleSlot": "content",
                  "style": "border:1px solid #ddd;\npadding:10px;"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "text19",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "A design is a plan or specification for the construction of an object.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "divider20",
        "type": "arco/v1/divider",
        "properties": {
          "type": "horizontal",
          "orientation": "center"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text19_copy0",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "A design is a plan or specification for the construction of an object.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "divider20_copy3",
        "type": "arco/v1/divider",
        "properties": {
          "type": "horizontal",
          "orientation": "center"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text19_copy1",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "A design is a plan or specification for the construction of an object.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "divider20_copy4",
        "type": "arco/v1/divider",
        "properties": {
          "type": "horizontal",
          "orientation": "center"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text19_copy2",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "A design is a plan or specification for the construction of an object.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack18",
                "slot": "content"
              }
            }
          }
        ]
      }
    ]
  }
};

export default basicUsage;
