import { Application } from '@sunmao-ui/core';

export const customComponent: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'table',
        type: 'arco/v1/table',
        properties: {
          columns: [
            {
              title: 'Name',
              dataIndex: 'name',
              sorter: true,
              sortDirections: ['ascend', 'descend'],
              type: 'text',
              filter: true,
              displayValue: '',
              componentSlotIndex: 0,
            },
            {
              title: 'Salary',
              dataIndex: 'salary',
              sorter: true,
              sortDirections: ['ascend', 'descend'],
              filter: false,
              type: 'text',
              displayValue: '',
              componentSlotIndex: 0,
            },
            {
              title: 'Link',
              dataIndex: 'link',
              type: 'link',
              filter: true,
              sortDirections: ['ascend', 'descend'],
              displayValue: '',
              componentSlotIndex: 0,
            },
            {
              title: 'Hello',
              type: 'component',
              componentSlotIndex: 0,
              dataIndex: '',
              displayValue: '',
              filter: false,
            },
          ],
          data: [
            {
              key: 'key 0',
              name: 'Naomi Cook0',
              link: 'link-A',
              salary: 272,
            },
            {
              key: 'key 1',
              name: 'Kevin Sandra1',
              link: 'link-B',
              salary: 911,
            },
            {
              key: 'key 2',
              name: 'Kevin Sandra2',
              link: 'link-B',
              salary: 527,
            },
            {
              key: 'key 3',
              name: 'Kevin Sandra3',
              link: 'link-B',
              salary: 906,
            },
            {
              key: 'key 4',
              name: 'Naomi Cook4',
              link: 'link-A',
              salary: 261,
            },
            {
              key: 'key 5',
              name: 'Naomi Cook5',
              link: 'link-A',
              salary: 134,
            },
            {
              key: 'key 6',
              name: 'Kevin Sandra6',
              link: 'link-A',
              salary: 877,
            },
            {
              key: 'key 7',
              name: 'Kevin Sandra7',
              link: 'link-A',
              salary: 287,
            },
            {
              key: 'key 8',
              name: 'Naomi Cook8',
              link: 'link-B',
              salary: 319,
            },
            {
              key: 'key 9',
              name: 'Kevin Sandra9',
              link: 'link-B',
              salary: 105,
            },
            {
              key: 'key 10',
              name: 'Naomi Cook10',
              link: 'link-B',
              salary: 468,
            },
            {
              key: 'key 11',
              name: 'Naomi Cook11',
              link: 'link-A',
              salary: 53,
            },
            {
              key: 'key 12',
              name: 'Naomi Cook12',
              link: 'link-A',
              salary: 195,
            },
          ],
          checkCrossPage: true,
          pagination: {
            enablePagination: true,
            pageSize: 6,
            defaultCurrent: 1,
            updateWhenDefaultPageChanges: false,
            useCustomPagination: false,
          },
          rowClick: false,
          tableLayoutFixed: false,
          borderCell: false,
          stripe: false,
          size: 'default',
          useDefaultFilter: true,
          useDefaultSort: true,
          pagePosition: 'bottomCenter',
          rowSelectionType: 'single',
          border: true,
          loading: false,
        },
        traits: [],
      },
      {
        id: 'button4',
        type: 'arco/v1/button',
        properties: {
          type: 'primary',
          status: 'default',
          long: false,
          size: 'small',
          disabled: false,
          loading: false,
          shape: 'round',
          text: 'Click',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'table',
                slot: 'content',
              },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'onClick',
                  componentId: '$utils',
                  method: {
                    name: 'arco/v1/message',
                    parameters: {
                      type: 'info',
                      content: 'Hello{{$slot.$listItem.name}}',
                      position: 'top',
                      closable: false,
                      duration: 1000,
                    },
                  },
                  disabled: false,
                  wait: {
                    type: 'delay',
                    time: 0,
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
