import { Application } from "@sunmao-ui/core";

export const basicUsage: Application = {
  "kind": "Application",
  "version": "example/v1",
  "metadata": {
    "name": "tableBasicUsage",
    "description": "table basic usage"
  },
  "spec": {
    "components": [
      {
        "id": "space1",
        "type": "arco/v1/space",
        "properties": {
          "align": "center",
          "direction": "vertical",
          "wrap": false,
          "size": "mini"
        },
        "traits": []
      },
      {
        "id": "table2",
        "type": "arco/v1/table",
        "properties": {
          "columns": [
            {
              "title": "Name",
              "dataIndex": "name",
              "sorter": false,
              "sortDirections": [
                "ascend",
                "descend"
              ],
              "defaultSortOrder": "ascend",
              "type": "text",
              "filter": false
            },
            {
              "title": "Salary",
              "dataIndex": "salary",
              "sorter": false,
              "filter": false,
              "type": "text"
            },
            {
              "title": "Time",
              "dataIndex": "time",
              "sorter": false,
              "filter": false,
              "type": "text"
            },
            {
              "title": "Link",
              "dataIndex": "link",
              "type": "link",
              "filter": false,
              "sorter": false
            }
          ],
          "data": [
            {
              "key": "key 0",
              "name": "xzdry0",
              "link": "link-B",
              "salary": 59,
              "time": "2021-7-11T1:10:45.437Z"
            },
            {
              "key": "key 1",
              "name": "xzdry1",
              "link": "link-A",
              "salary": 371,
              "time": "2021-1-11T11:10:45.437Z"
            },
            {
              "key": "key 2",
              "name": "Kevin Sandra2",
              "link": "link-A",
              "salary": 779,
              "time": "2021-10-11T4:10:45.437Z"
            },
            {
              "key": "key 3",
              "name": "Kevin Sandra3",
              "link": "link-A",
              "salary": 107,
              "time": "2021-7-11T4:10:45.437Z"
            },
            {
              "key": "key 4",
              "name": "Kevin Sandra4",
              "link": "link-A",
              "salary": 610,
              "time": "2021-7-11T11:10:45.437Z"
            },
            {
              "key": "key 5",
              "name": "xzdry5",
              "link": "link-A",
              "salary": 297,
              "time": "2021-6-11T8:10:45.437Z"
            },
            {
              "key": "key 6",
              "name": "xzdry6",
              "link": "link-A",
              "salary": 799,
              "time": "2021-0-11T9:10:45.437Z"
            },
            {
              "key": "key 7",
              "name": "xzdry7",
              "link": "link-B",
              "salary": 242,
              "time": "2021-10-11T0:10:45.437Z"
            },
            {
              "key": "key 8",
              "name": "xzdry8",
              "link": "link-B",
              "salary": 798,
              "time": "2021-2-11T2:10:45.437Z"
            },
            {
              "key": "key 9",
              "name": "xzdry9",
              "link": "link-B",
              "salary": 947,
              "time": "2021-1-11T9:10:45.437Z"
            },
            {
              "key": "key 10",
              "name": "Kevin Sandra10",
              "link": "link-B",
              "salary": 927,
              "time": "2021-4-11T0:10:45.437Z"
            },
            {
              "key": "key 11",
              "name": "Kevin Sandra11",
              "link": "link-A",
              "salary": 463,
              "time": "2021-10-11T5:10:45.437Z"
            },
            {
              "key": "key 12",
              "name": "Kevin Sandra12",
              "link": "link-B",
              "salary": 396,
              "time": "2021-9-11T3:10:45.437Z"
            }
          ],
          "pagination": {
            "pageSize": 6
          },
          "tableLayoutFixed": false,
          "borderCell": false,
          "stripe": false,
          "size": "default",
          "pagePosition": "bottomCenter",
          "rowSelectionType": "default"
        },
        "traits": [
          {
            "type": "core/v1/slot",
            "properties": {
              "container": {
                "id": "space1",
                "slot": "content"
              }
            }
          }
        ]
      }
    ]
  }
}
