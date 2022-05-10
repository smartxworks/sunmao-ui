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
        "id": "api0",
        "type": "core/v1/dummy",
        "properties": {},
        "traits": [
          {
            "type": "core/v1/fetch",
            "properties": {
              "url": "/test",
              "method": "post",
              "lazy": true,
              "headers": {
                "Content-Type": "application/json"
              },
              "body": "{{\ntrans({value:input4.value})\n}}",
              "bodyType": "json",
              "onComplete": [],
              "onError": []
            }
          }
        ]
      },
      {
        "id": "stack9",
        "type": "core/v1/stack",
        "properties": {
          "spacing": 20,
          "direction": "horizontal",
          "align": "start",
          "wrap": "",
          "justify": ""
        },
        "traits": []
      },
      {
        "id": "dropdown6",
        "type": "arco/v1/dropdown",
        "properties": {
          "dropdownType": "default",
          "trigger": "hover",
          "position": "bl",
          "disabled": false,
          "defaultPopupVisible": false,
          "list": [
            {
              "key": "1",
              "label": "smartx"
            },
            {
              "key": "2",
              "label": "baidu"
            },
            {
              "key": "3",
              "label": "tencent"
            }
          ],
          "autoAlignPopupWidth": true
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack9",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "stack14",
        "type": "core/v1/stack",
        "properties": {
          "spacing": 0,
          "direction": "horizontal",
          "align": "start",
          "wrap": "",
          "justify": ""
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "dropdown6",
                "slot": "trigger"
              }
            }
          }
        ]
      },
      {
        "id": "button15",
        "type": "arco/v1/button",
        "properties": {
          "type": "primary",
          "status": "default",
          "long": false,
          "size": "default",
          "disabled": false,
          "loading": false,
          "shape": "square",
          "text": "hover me"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack14",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/event",
            "properties": {
              "handlers": []
            }
          },
          {
            "type": "core/v1/style",
            "properties": {
              "styles": [
                {
                  "styleSlot": "content",
                  "style": "&&{\nbackground-color: transparent !important;\ncolor:rgb(22,93,255) !important;\n  padding-right:0px !important;\nbackground: transparent;\n}"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "button10",
        "type": "arco/v1/button",
        "properties": {
          "type": "primary",
          "status": "default",
          "long": false,
          "size": "default",
          "disabled": false,
          "loading": false,
          "shape": "square",
          "text": ""
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack14",
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
                  "style": "&&{\nbackground-color: transparent !important;\n  padding-left:1px !important;\ncolor:rgb(22,93,255) !important;\nbackground: transparent;\n}"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "icon16",
        "type": "arco/v1/icon",
        "properties": {
          "name": "IconDown",
          "spin": false
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "button10",
                "slot": "icon"
              }
            }
          }
        ]
      },
      {
        "id": "dropdown3",
        "type": "arco/v1/dropdown",
        "properties": {
          "dropdownType": "default",
          "trigger": "click",
          "position": "bl",
          "disabled": false,
          "defaultPopupVisible": false,
          "list": [
            {
              "key": "1",
              "label": "sign in"
            },
            {
              "key": "2",
              "label": "sign up"
            }
          ],
          "autoAlignPopupWidth": true
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack9",
                "slot": "content"
              }
            }
          }
        ]
      },
      {
        "id": "stack14_copy5",
        "type": "core/v1/stack",
        "properties": {
          "spacing": 0,
          "direction": "horizontal",
          "align": "start",
          "wrap": "",
          "justify": ""
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "dropdown3",
                "slot": "trigger"
              }
            }
          }
        ]
      },
      {
        "id": "button15_copy5",
        "type": "arco/v1/button",
        "properties": {
          "type": "primary",
          "status": "default",
          "long": false,
          "size": "default",
          "disabled": false,
          "loading": false,
          "shape": "square",
          "text": "click me"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack14_copy5",
                "slot": "content"
              }
            }
          },
          {
            "type": "core/v1/event",
            "properties": {
              "handlers": []
            }
          },
          {
            "type": "core/v1/style",
            "properties": {
              "styles": [
                {
                  "styleSlot": "content",
                  "style": "&&{\nbackground-color: transparent !important;\ncolor:rgb(22,93,255) !important;\n  padding-right:0px !important;\nbackground: transparent;\n}"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "button10_copy5",
        "type": "arco/v1/button",
        "properties": {
          "type": "primary",
          "status": "default",
          "long": false,
          "size": "default",
          "disabled": false,
          "loading": false,
          "shape": "square",
          "text": ""
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "stack14_copy5",
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
                  "style": "&&{\nbackground-color: transparent !important;\n  padding-left:1px !important;\ncolor:rgb(22,93,255) !important;\nbackground: transparent;\n}"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "icon16_copy5",
        "type": "arco/v1/icon",
        "properties": {
          "name": "IconDown",
          "spin": false
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "button10_copy5",
                "slot": "icon"
              }
            }
          }
        ]
      }
    ]
  }
}

export default basicUsage;
