import { Application } from '@sunmao-ui/core';

export const ignoreTraitsList = ['core/v1/slot', 'core/v1/event', 'core/v1/fetch'];

export const DefaultAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: {
    name: 'dialog_component',
    description: 'dialog component example',
  },
  spec: {
    components: [
      {
        id: 'grid_layout1',
        type: 'core/v1/grid_layout',
        properties: {
          layout: [
            {
              w: 10,
              h: 15,
              x: 0,
              y: 0,
              i: 'tabs1',
              moved: false,
              static: false,
              isDraggable: true,
            },
          ],
        },
        traits: [],
      },
      {
        id: 'fetchUsers',
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
            },
          },
        ],
      },
      {
        id: 'usersTable',
        type: 'chakra_ui/v1/table',
        properties: {
          data: '{{fetchUsers.fetch.data}}',
          columns: [
            { key: 'username', title: '用户名', type: 'link' },
            { key: 'job', title: '职位', type: 'text' },
            { key: 'area', title: '地区', type: 'text' },
            {
              key: 'createdTime',
              title: '创建时间',
              displayValue: "{{dayjs($listItem.createdTime).format('LL')}}",
            },
          ],
          majorKey: 'id',
          rowsPerPage: '3',
          isMultiSelect: 'false',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'tabContentVStack', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'userInfoContainer',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: '2', align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'tabContentVStack', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: "{{!usersTable.selectedItem ? 'display: none' : ''}}",
            },
          },
        ],
      },
      {
        id: 'userInfoTitle',
        type: 'core/v1/text',
        properties: { value: { raw: '**基本信息**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'hstack1',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', hideBorder: '' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: 'padding: 0; border: none',
            },
          },
        ],
      },
      {
        id: 'usernameLabel',
        type: 'core/v1/text',
        properties: { value: { raw: '**用户名**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack1', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'usernameValue',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: "{{usersTable.selectedItem ? usersTable.selectedItem.username : ''}}",
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack1', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'divider1',
        type: 'chakra_ui/v1/divider',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'jobLabel',
        type: 'core/v1/text',
        properties: { value: { raw: '**职位**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack2', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'hstack2',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', hideBorder: '' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: 'padding: 0; border: none',
            },
          },
        ],
      },
      {
        id: 'areaLabel',
        type: 'core/v1/text',
        properties: { value: { raw: '**地区**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack3', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'areaValue',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: "{{usersTable.selectedItem ? usersTable.selectedItem.area : ''}}",
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack3', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'divider2',
        type: 'chakra_ui/v1/divider',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'createdTimeLabel',
        type: 'core/v1/text',
        properties: { value: { raw: '**创建时间**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack4', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'createdTimeValue',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: "{{usersTable.selectedItem ? dayjs(usersTable.selectedItem.createdTime).format('LL') : ''}}",
            format: 'plain',
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack4', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: { string: { kind: {}, type: {} } },
          },
        ],
      },
      {
        id: 'hstack3',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', hideBorder: '' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: 'padding: 0; border: none',
            },
          },
        ],
      },
      {
        id: 'divider3',
        type: 'chakra_ui/v1/divider',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'hstack4',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', hideBorder: '' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: 'padding: 0; border: none',
            },
          },
        ],
      },
      {
        id: 'tabs1',
        type: 'chakra_ui/v1/tabs',
        properties: {
          tabNames: ['用户信息', '角色'],
          initialSelectedTabIndex: 0,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'grid_layout1', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'tabContentVStack',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: '24px' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'tabs1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'testtext',
        type: 'core/v1/text',
        properties: { value: { raw: '**测试角色**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'tabs1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'jobValue',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: '1', align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'hstack2', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: 'padding: 0; border: none',
            },
          },
        ],
      },
      {
        id: 'link1',
        type: 'chakra_ui/v1/link',
        properties: {
          text: {
            raw: "{{usersTable.selectedItem ? usersTable.selectedItem.job : ''}}",
            format: 'plain',
          },
          href: 'https://www.google.com',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'jobValue', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'link2',
        type: 'chakra_ui/v1/link',
        properties: {
          text: {
            raw: "{{usersTable.selectedItem ? usersTable.selectedItem.job : ''}}",
            format: 'plain',
          },
          href: 'https://www.google.com',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'jobValue', slot: 'content' },
            },
          },
        ],
      },
    ],
  },
};
