import { Application } from "@sunmao-ui/core";


export const sortAndFilter: Application = {
    "kind": "Application",
    "version": "example/v1",
    "metadata": {
        "name": "sortAndFilter",
        "description": "sort and filter usage"
    },
    "spec": {
        "components": [
            {
                "id": "space32",
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
                "id": "table31",
                "type": "arco/v1/table",
                "properties": {
                    "columns": [
                        {
                            "title": "Name",
                            "dataIndex": "name",
                            "sorter": true,
                            "sortDirections": [
                                "ascend",
                                "descend"
                            ],
                            "defaultSortOrder": "descend",
                            "type": "text",
                            "filter": true
                        },
                        {
                            "title": "Salary",
                            "dataIndex": "salary",
                            "sorter": true,
                            "filter": false,
                            "type": "text",
                            "sortDirections": "{{['ascend']}}"
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
                            "filter": true,
                            "sorter": false
                        }
                    ],
                    "data": [
                        {
                            "key": "key 0",
                            "name": "Kevin Sandra0",
                            "link": "link-A",
                            "salary": 181,
                            "time": "2021-0-11T2:10:45.437Z"
                        },
                        {
                            "key": "key 1",
                            "name": "Kevin Sandra1",
                            "link": "link-B",
                            "salary": 387,
                            "time": "2021-3-11T1:10:45.437Z"
                        },
                        {
                            "key": "key 2",
                            "name": "Kevin Sandra2",
                            "link": "link-B",
                            "salary": 215,
                            "time": "2021-5-11T14:10:45.437Z"
                        },
                        {
                            "key": "key 3",
                            "name": "xzdry3",
                            "link": "link-B",
                            "salary": 427,
                            "time": "2021-10-11T9:10:45.437Z"
                        },
                        {
                            "key": "key 4",
                            "name": "Kevin Sandra4",
                            "link": "link-A",
                            "salary": 950,
                            "time": "2021-10-11T6:10:45.437Z"
                        },
                        {
                            "key": "key 5",
                            "name": "xzdry5",
                            "link": "link-B",
                            "salary": 811,
                            "time": "2021-8-11T5:10:45.437Z"
                        },
                        {
                            "key": "key 6",
                            "name": "Kevin Sandra6",
                            "link": "link-A",
                            "salary": 805,
                            "time": "2021-5-11T5:10:45.437Z"
                        },
                        {
                            "key": "key 7",
                            "name": "Kevin Sandra7",
                            "link": "link-B",
                            "salary": 782,
                            "time": "2021-8-11T14:10:45.437Z"
                        },
                        {
                            "key": "key 8",
                            "name": "xzdry8",
                            "link": "link-A",
                            "salary": 87,
                            "time": "2021-3-11T6:10:45.437Z"
                        },
                        {
                            "key": "key 9",
                            "name": "Kevin Sandra9",
                            "link": "link-A",
                            "salary": 805,
                            "time": "2021-0-11T11:10:45.437Z"
                        },
                        {
                            "key": "key 10",
                            "name": "xzdry10",
                            "link": "link-B",
                            "salary": 935,
                            "time": "2021-10-11T4:10:45.437Z"
                        },
                        {
                            "key": "key 11",
                            "name": "xzdry11",
                            "link": "link-A",
                            "salary": 381,
                            "time": "2021-0-11T14:10:45.437Z"
                        },
                        {
                            "key": "key 12",
                            "name": "Kevin Sandra12",
                            "link": "link-B",
                            "salary": 406,
                            "time": "2021-2-11T13:10:45.437Z"
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
                    "rowSelectionType": "default",
                    "border": false,
                    "loading": false
                },
                "traits": [
                    {
                        "type": "core/v1/slot",
                        "properties": {
                            "container": {
                                "id": "space32",
                                "slot": "content"
                            }
                        }
                    }
                ]
            }
        ]
    }
}