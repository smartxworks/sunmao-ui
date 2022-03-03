import { Application } from '@sunmao-ui/core';

export const basicUsage: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'table0',
        type: 'arco/v1/table',
        properties: {
          columns: [
            {
              title: 'Name',
              dataIndex: 'username',
              sorter: false,
              type: 'text',
              filter: true,
              displayValue: '',
            },
            {
              title: 'Age',
              dataIndex: 'id',
              sorter: true,
              filter: false,
              type: 'text',
              displayValue: '{{$listItem.age}}',
            },
            {
              title: 'BirthDay',
              dataIndex: 'createdTime',
              sorter: true,
              filter: false,
              type: 'text',
              displayValue: "{{dayjs($listItem.createdTime).format('YYYY-MM-DD')}}",
            },
            {
              title: 'Area',
              type: 'text',
              dataIndex: 'area',
              displayValue: '',
              sorter: false,
              filter: false,
            },
            {
              title: 'Job',
              type: 'text',
              dataIndex: 'job',
              displayValue: '',
              sorter: false,
              filter: false,
            },
          ],
          data: '{{api0.fetch.data}}',
          pagination: {
            pageSize: 5,
          },
          tableLayoutFixed: false,
          borderCell: false,
          stripe: false,
          size: 'default',
          pagePosition: 'bottomCenter',
          rowSelectionType: 'disable',
          border: true,
          loading: '{{!api0.fetch.data}}',
        },
        traits: [],
      },
      {
        id: 'api0',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://6177d4919c328300175f5b99.mockapi.io/users',
              method: 'get',
              lazy: false,
              headers: {},
              body: {},
              onComplete: [],
              onError: [],
            },
          },
        ],
      },
    ],
  },
};
