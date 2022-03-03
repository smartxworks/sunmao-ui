import { Application } from "@sunmao-ui/core";

const tabBasicUsage: Application = {
  "version": "sunmao/v1",
  "kind": "Application",
  "metadata": {
    "name": "some App"
  },
  "spec": {
    "components": [
      {
        "id": "formControl8",
        "type": "arco/v1/formControl",
        "properties": {
          "label": {
            "format": "md",
            "raw": "Tab Position"
          },
          "layout": "horizontal",
          "required": false,
          "hidden": false,
          "extra": "",
          "errorMsg": "",
          "labelAlign": "left",
          "colon": false,
          "labelCol": {
            "span": 5,
            "offset": 0
          },
          "wrapperCol": {
            "span": 19,
            "offset": 0
          },
          "help": ""
        },
        "traits": [
          {
            "type": "core/v1/style",
            "properties": {
              "styles": [
                {
                  "styleSlot": "content",
                  "style": "width: 400px !important;"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "select7",
        "type": "arco/v1/select",
        "properties": {
          "allowClear": false,
          "multiple": false,
          "allowCreate": false,
          "bordered": true,
          "defaultValue": "top",
          "disabled": false,
          "labelInValue": false,
          "loading": false,
          "options": [
            {
              "value": "left",
              "text": "left"
            },
            {
              "value": "right",
              "text": "right"
            },
            {
              "value": "bottom",
              "text": "bottom"
            },
            {
              "value": "top",
              "text": "top"
            }
          ],
          "placeholder": "Please select",
          "size": "default"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "formControl8",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "divider6",
        "type": "arco/v1/divider",
        "properties": {
          "type": "horizontal",
          "orientation": "center"
        },
        "traits": []
      },
      {
        "id": "tabs7",
        "type": "arco/v1/tabs",
        "properties": {
          "type": "line",
          "defaultActiveTab": "0",
          "tabPosition": "{{select7.value}}",
          "size": "default",
          "tabNames": [
            "Dashboard",
            "Users",
            "Settings"
          ]
        },
        "traits": []
      },
      {
        "id": "text7",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "I am dashboard.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "tabs7",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text8",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "I am Users.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "tabs7",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "text9",
        "type": "core/v1/text",
        "properties": {
          "value": {
            "raw": "I am Settings.",
            "format": "plain"
          }
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "tabs7",
                "slot": "content"
              }
            }
          }
        ]
      }
    ]
  }
}

export default tabBasicUsage;
