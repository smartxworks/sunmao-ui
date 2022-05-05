import { Application } from '@sunmao-ui/core';

const withAvatarUsage: Application = {
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
        "id": "dropdown3",
        "type": "arco/v1/dropdown",
        "properties": {
          "dropdownType": "default",
          "trigger": "hover",
          "position": "tl",
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
          ]
        },
        "traits": []
      },
      {
        "id": "avatar2",
        "type": "arco/v1/avatar",
        "properties": {
          "shape": "circle",
          "triggerType": "button",
          "size": 50,
          "type": "text",
          "text": "T"
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
          },
          {
            "type": "core/v1/style",
            "properties": {
              "styles": [
                {
                  "styleSlot": "content",
                  "style": "&&{\ncursor:pointer;\nbackground-color:rgb(20, 201, 201)\n}"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "icon3",
        "type": "arco/v1/icon",
        "properties": {
          "name": "IconTwitter",
          "spin": false
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "avatar2",
                "slot": "triggerIcon"
              }
            }
          }
        ]
      }
    ]
  }
}

export default withAvatarUsage;
