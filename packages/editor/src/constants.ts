import { Application } from '@sunmao-ui/core';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';

export const ignoreTraitsList = [
  'core/v1/slot',
  'core/v1/event',
  'core/v1/fetch',
  'core/v1/style',
];

export const EmptyAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'dialog_component', description: 'dialog component example' },
  spec: {
    components: [
      {
        id: 'input1',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'outline',
          placeholder: 'Please input value',
          size: 'md',
          isDisabled: false,
          isRequired: false,
          defaultValue: '',
        },
        traits: [
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: "background: red",
            },
          },
        ],
      },
      {
        id: 'input2',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'outline',
          placeholder: 'Please input value',
          size: 'md',
          isDisabled: false,
          isRequired: false,
          defaultValue: '',
        },
        traits: [],
      },
      {
        id: 'input3',
        type: 'chakra_ui/v1/input',
        properties: {
          variant: 'outline',
          placeholder: 'Please input value',
          size: 'md',
          isDisabled: false,
          isRequired: false,
          defaultValue: '',
        },
        traits: [],
      },
      {
        id: 'hstack1',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
      {
        id: 'button1',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button2',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button3',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
    ],
  },
};

export const DefaultNewModule: ImplementedRuntimeModule = {
  kind: 'Module',
  parsedVersion: { category: 'custom/v1', value: 'myModule' },
  version: 'custom/v1',
  metadata: { name: 'myModule', description: 'my module' },
  spec: {
    stateMap: {},
    events: [],
    properties: {},
  },
  impl: [
    {
      id: 'text1',
      type: 'core/v1/text',
      properties: { value: { raw: 'Hello, world!', format: 'plain' } },
      traits: [],
    },
  ],
};
export const UserCenterApp: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: {
    name: 'app',
    description: 'user center app',
  },
  spec: {
    components: [
      { id: 'root', type: 'chakra_ui/v1/root', properties: {}, traits: [] },
      {
        id: 'tabs1',
        type: 'chakra_ui/v1/tabs',
        properties: {
          tabNames: ['用户', '角色', '分配策略', '部门管理'],
          initialSelectedTabIndex: 0,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'root', slot: 'root' } },
          },
        ],
      },
      {
        id: 'usersGridLayout',
        type: 'core/v1/grid_layout',
        properties: {
          layout: [
            {
              w: 12,
              h: 15,
              x: 0,
              y: 1,
              i: 'tabContentVStack',
              moved: false,
              static: false,
            },
            {
              w: 2,
              h: 1,
              x: 10,
              y: 0,
              i: 'createUserButton',
              moved: false,
              static: false,
            },
          ],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'tabs1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'isUpdateRole',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
              initialValue: false,
            },
          },
        ],
      },
      {
        id: 'isUpdatePosition',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
              initialValue: false,
            },
          },
        ],
      },
      {
        id: 'editingViewRange',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'data',
              initialValue: {},
            },
          },
        ],
      },
      {
        id: 'fetchUsers',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: false,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  '{ users { id name email mobile departments { name id parentId } positions { name id } roles { name id system { name id } } isActive createdAt } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'fetchUsersFailToast',
                      status: 'error',
                      title: '获取用户列表失败',
                      description: '{{fetchUsers.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [],
            },
          },
        ],
      },
      {
        id: 'editUser',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: true,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  'mutation { updateOneUser( data: { email: "{{editUserFormModule.data.email}}" name: "{{editUserFormModule.data.name}}" mobile: "{{editUserFormModule.data.mobile}}" isActive: {{editUserFormModule.data.isActive === \'true\' ? true : false}} positions: { connect: [{{editUserFormModule.data.positions ? editUserFormModule.data.positions.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } departments: { connect: [{{editUserFormModule.data.departments ? editUserFormModule.data.departments.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } roles: { connect: [{{editUserFormModule.data.roles ? editUserFormModule.data.roles.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } } where: { email: "{{usersTable.selectedItem.email}}" } ) { name } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'editUserFailToast',
                      status: 'error',
                      title: '编辑用户失败',
                      description: '{{createUser.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createSuccessToast',
                      title: '编辑用户成功',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'fetchUsers',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  componentId: 'editUserDialog',
                  method: { name: 'cancelDialog' },
                },
              ],
            },
          },
        ],
      },
      {
        id: 'createUser',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: true,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  'mutation { createOneUser( data: { email: "{{createUserFormModule.data.email}}" isActive: {{createUserFormModule.data.isActive === \'true\' ? true : false}} positionIds: [{{createUserFormModule.data.positions ? createUserFormModule.data.positions.map((id) => `"${id}"`).join(\',\') : [] }}] departmentIds: [{{createUserFormModule.data.departments ? createUserFormModule.data.departments.map((id) => `"${id}"`).join(\',\') : [] }}] roleIds: [{{createUserFormModule.data.roles ? createUserFormModule.data.roles.map((id) => `"${id}"`).join(\',\') : [] }}] } ) { name } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createUserFailToast',
                      status: 'error',
                      title: '创建用户失败',
                      description: '{{createUser.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createSuccessToast',
                      title: '创建用户成功',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'fetchUsers',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  componentId: 'createUserDialog',
                  method: { name: 'cancelDialog' },
                },
              ],
            },
          },
        ],
      },
      {
        id: 'createRole',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: true,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  'mutation { createOneRole( data: { name: "{{roleFormModule.data.name}}" system: { connect: { id: "{{roleFormModule.data.system}}" } } permissions: { connect: [{{roleFormModule.data.permissions ? roleFormModule.data.permissions.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } } ) { name } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createRoleFailToast',
                      status: 'error',
                      title: '创建角色失败',
                      description: '{{createRole.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createSuccessToast',
                      title: '创建角色成功',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'fetchRoles',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  componentId: 'roleFormDialog',
                  method: { name: 'cancelDialog' },
                },
              ],
            },
          },
        ],
      },

      {
        id: 'updateRole',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: true,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  'mutation { updateOneRole(where: {id: "{{rolesTable.selectedItem.id}}"} data: { name: "{{roleFormModule.data.name}}" system: { connect: { id: "{{roleFormModule.data.system}}" } } permissions: { connect: [{{roleFormModule.data.permissions ? roleFormModule.data.permissions.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } } ) { name } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'updateRoleFailToast',
                      status: 'error',
                      title: '编辑角色失败',
                      description: '{{updateRole.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'updateRoleSuccessToast',
                      title: '编辑角色成功',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'fetchRoles',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  componentId: 'roleFormDialog',
                  method: { name: 'cancelDialog' },
                },
              ],
            },
          },
        ],
      },

      {
        id: 'updateViewRange',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: true,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  'mutation { updateOneViewRange( where: { id: "{{editingViewRange.data.id}}" } data: { type: {{viewRangeFormModule.data.type}} system: { connect: { id: "{{rolesTable.selectedItem.system.id}}" } } role: { connect: { id: "{{rolesTable.selectedItem.id}}" } } resource: { connect: { id: "{{viewRangeFormModule.data.resource}}" } } departments: { connect: [{{viewRangeFormModule.data.departments ? viewRangeFormModule.data.departments.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } } ) { type } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'updateViewRangeFailToast',
                      status: 'error',
                      title: '编辑可见范围失败',
                      description: '{{updateViewRange.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'updateViewRangeSuccessToast',
                      title: '编辑可见范围成功',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'fetchRoles',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  componentId: 'viewRangeFormDialog',
                  method: { name: 'cancelDialog' },
                },
              ],
            },
          },
        ],
      },

      {
        id: 'createViewRange',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              method: 'post',
              lazy: true,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  'mutation { createOneViewRange( data: { type: {{viewRangeFormModule.data.type}} system: { connect: { id: "{{rolesTable.selectedItem.system.id}}" } } role: { connect: { id: "{{rolesTable.selectedItem.id}}" } } resource: { connect: { id: "{{viewRangeFormModule.data.resource}}" } } departments: { connect: [{{viewRangeFormModule.data.departments ? viewRangeFormModule.data.departments.map((id) => `{id: "${id}"}`).join(\',\') : [] }}] } } ) { type } }',
              },
              onError: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createViewRangeFailToast',
                      status: 'error',
                      title: '创建可见范围失败',
                      description: '{{createViewRange.fetch.error.message}}',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
              ],
              onComplete: [
                {
                  componentId: '$utils',
                  method: {
                    name: 'toast.open',
                    parameters: {
                      id: 'createViewRangeSuccessToast',
                      title: '创建可见范围成功',
                      position: 'top-right',
                      duration: 3000,
                      isClosable: true,
                    },
                  },
                },
                {
                  componentId: 'fetchRoles',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  componentId: 'viewRangeFormDialog',
                  method: { name: 'cancelDialog' },
                },
              ],
            },
          },
        ],
      },
      {
        id: 'usersTable',
        type: 'chakra_ui/v1/table',
        properties: {
          data: '{{fetchUsers.fetch.data ? fetchUsers.fetch.data.data.users : undefined}}',
          columns: [
            { key: 'name', title: '用户名', type: 'link' },
            { key: 'email', title: '邮箱', type: 'text' },
            { key: 'mobile', title: '手机', type: 'text' },
            {
              key: 'positions',
              title: '职位',
              type: 'text',
              displayValue: "{{$listItem.positions.map(d => d.name).join('; ')}}",
            },
            {
              key: 'departments',
              title: '部门',
              type: 'text',
              displayValue:
                "{{(function (departments) { const ans = []; function traverse(d, prev) { const next = prev.concat([d.name]); if (d.children.length === 0) { ans.push(next.join(' > ')); } else { d.children.forEach(child => { traverse(child, next); }); } } departments.forEach(d => { traverse(d, []); }); return ans.join('\\n'); })(arrayToTree($listItem.departments, { dataField: null }))}}",
            },
            {
              key: 'isActive',
              title: '状态',
              type: 'text',
              displayValue: "{{$listItem.isActive ? '启用' : '未启用'}}",
            },
            {
              key: 'createdTime',
              title: '创建时间',
              displayValue: "{{dayjs($listItem.createdTime).format('LL')}}",
            },
          ],
          majorKey: 'id',
          rowsPerPage: '5',
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
              container: { id: 'userInfoHStack', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'userInfoHeader',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', align: '', justify: 'space-between' },
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
        id: 'userNameRow',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'userNameRowModule',
          type: 'userCenter/v1/infoRow',
          properties: {
            key: '用户名',
            value: "{{usersTable.selectedItem ? usersTable.selectedItem.name : ''}}",
          },
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoContainer2', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'emailRow',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'emailRowModule',
          type: 'userCenter/v1/infoRow',
          properties: {
            key: '邮箱',
            value: "{{usersTable.selectedItem ? usersTable.selectedItem.email : ''}}",
          },
          handlers: [],
        },
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
        id: 'mobileRow',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'mobileRowModule',
          type: 'userCenter/v1/infoRow',
          properties: {
            key: '手机',
            value: "{{usersTable.selectedItem ? usersTable.selectedItem.mobile : ''}}",
          },
          handlers: [],
        },
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
        id: 'createdTimeRow',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'createdTimeRowModule',
          type: 'userCenter/v1/infoRow',
          properties: {
            key: '创建时间',
            value:
              "{{usersTable.selectedItem ? dayjs(usersTable.selectedItem.createdTime).format('LL') : ''}}",
          },
          handlers: [],
        },
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
        id: 'positionsRow',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'positionsRowModule',
          type: 'userCenter/v1/infoRow',
          properties: {
            key: '职位',
            value:
              "{{usersTable.selectedItem ? usersTable.selectedItem.positions.map(d => d.name).join('; ') : ''}}",
          },
          handlers: [],
        },
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
        id: 'departmentsRow',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'departmentsRowModule',
          type: 'userCenter/v1/infoRow',
          properties: {
            key: '部门',
            value:
              "{{(function (departments) { const ans = []; function traverse(d, prev) { const next = prev.concat([d.name]); if (d.children.length === 0) { ans.push(next.join(' > ')); } else { d.children.forEach(child => { traverse(child, next); }); } } departments.forEach(d => { traverse(d, []); }); return ans.join('\\n'); })(arrayToTree(usersTable.selectedItem.departments, { dataField: null }))}}",
          },
          handlers: [],
        },
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
        id: 'tabContentVStack',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: '24px' },
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
        id: 'createUserButton',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: '创建用户', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'usersGridLayout', slot: 'content' },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'onClick',
                  componentId: 'createUserDialog',
                  method: {
                    name: 'openDialog',
                    parameters: { title: '创建用户' },
                  },
                  disabled: false,
                },
              ],
            },
          },
          {
            type: 'core/v1/style',
            properties: { styleSlot: 'content', style: 'width: 100%' },
          },
        ],
      },
      {
        id: 'editUserDialog',
        type: 'chakra_ui/v1/dialog',
        properties: {
          title: 'Dialog',
          confirmButton: { text: '保存' },
          cancelButton: { text: '取消' },
          disableConfirm: '{{editUserFormModule.disableSubmit}}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'root', slot: 'root' } },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'confirmDialog',
                  componentId: 'editUser',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  type: 'cancelDialog',
                  componentId: 'editUserDialog',
                  method: { name: 'cancelDialog' },
                  disabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'editUserFormModuleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'editUserFormModule',
          type: 'userCenter/v1/editUserForm',
          properties: {
            initValue: {
              name: "{{usersTable.selectedItem ? usersTable.selectedItem.name : ''}}",
              email: "{{usersTable.selectedItem ? usersTable.selectedItem.email : ''}}",
              mobile: "{{usersTable.selectedItem ? usersTable.selectedItem.mobile : ''}}",
              isActive:
                "{{usersTable.selectedItem ? usersTable.selectedItem.isActive : 'true'}}",
              positions:
                '{{usersTable.selectedItem ? usersTable.selectedItem.positions.map(({id, name}) => ({label: name, value: id})) : []}}',
              roles:
                '{{usersTable.selectedItem ? usersTable.selectedItem.roles.map(({id, name}) => ({label: name, value: id})) : []}}',
            },
          },
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'editUserDialog', slot: 'content' },
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
              container: { id: 'userInfoHeader', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'userInfoEditButton',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: '编辑', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoHeader', slot: 'content' },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'onClick',
                  componentId: 'editUserDialog',
                  method: {
                    name: 'openDialog',
                    parameters: { title: '编辑用户' },
                  },
                  disabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'createUserDialog',
        type: 'chakra_ui/v1/dialog',
        properties: {
          title: 'Dialog',
          confirmButton: { text: '创建' },
          cancelButton: { text: '取消' },
          disableConfirm: '{{createUserFormModule.disableSubmit}}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'root', slot: 'root' } },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'confirmDialog',
                  componentId: 'createUser',
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  type: 'cancelDialog',
                  componentId: 'createUserDialog',
                  method: { name: 'cancelDialog' },
                  disabled: false,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'createUserFormModuleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'createUserFormModule',
          type: 'userCenter/v1/createUserForm',
          properties: {},
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'createUserDialog', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'userInfoHStack',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
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
        id: 'roleInfoContainer',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: 4, align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'userInfoHStack', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'roleInfoTitle',
        type: 'core/v1/text',
        properties: { value: { raw: '**角色信息**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'roleInfoContainer', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'RoleList',
        type: 'chakra_ui/v1/list',
        properties: {
          listData:
            "{{usersTable.sele}",
          template: {
            id: 'RoleListItem-{{$i}}',
            type: 'userCenter/v1/infoRow',
            properties: {
              key: '{{$listItem[0]}}',
              value: "{{$listItem[1].map(v => v.name).join('\\n')}}",
              showEditButton: false,
            },
            traits: [],
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'roleInfoContainer', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'fetchRoles',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://192.168.1.1',
              method: 'post',
              lazy: false,
              headers: { 'content-type': 'application/json' },
              body: {
                query:
                  '{ roles { id name system { name id } permissions { name id resource { name id } } createdAt users { id } } }',
              },
              onComplete: [],
            },
          },
        ],
      },

      {
        id: 'rolesContainer',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: '2', align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'tabs1', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'createRoleButton',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: '创建角色', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'rolesContainer', slot: 'content' },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  componentId: 'isUpdateRole',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value: false,
                    },
                  },
                },
                {
                  type: 'onClick',
                  componentId: 'roleFormDialog',
                  method: {
                    name: 'openDialog',
                    parameters: { title: '创建角色' },
                  },
                  disabled: false,
                },
              ],
            },
          },
          {
            type: 'core/v1/style',
            properties: { styleSlot: 'content', style: 'width: 100px;' },
          },
        ],
      },

      {
        id: 'rolesTable',
        type: 'chakra_ui/v1/table',
        properties: {
          data: "{{ _.get(fetchRoles, 'fetch.data.data.roles') }}",
          columns: [
            { key: 'name', title: '角色名', type: 'text' },
            {
              key: 'system',
              title: '系统',
              type: 'text',
              displayValue: '{{$listItem.system.name}}',
            },
            {
              key: 'users',
              title: '关联用户数',
              type: 'text',
              displayValue: '{{$listItem.users.length}}',
            },
            {
              key: 'createdTime',
              title: '创建时间',
              displayValue: "{{dayjs($listItem.createdAt).format('LL')}}",
            },
            {
              key: 'edit',
              type: 'button',
              buttonConfig: {
                text: '编辑',
                handlers: [
                  {
                    type: 'onClick',
                    componentId: 'isUpdateRole',
                    method: {
                      name: 'setValue',
                      parameters: {
                        key: 'value',
                        value: true,
                      },
                    },
                  },
                  {
                    componentId: 'roleFormDialog',
                    method: {
                      name: 'openDialog',
                      parameters: { title: '编辑角色' },
                    },
                  },
                ],
              },
            },
          ],
          majorKey: 'id',
          rowsPerPage: '5',
          isMultiSelect: 'false',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'rolesContainer', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'roleInfoHStack',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '2', align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'rolesContainer', slot: 'content' },
            },
          },
          {
            type: 'core/v1/style',
            properties: {
              styleSlot: 'content',
              style: "{{!rolesTable.selectedItem ? 'display: none' : ''}}",
            },
          },
        ],
      },

      {
        id: 'permissionInfoContainer',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: 4, align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'roleInfoHStack', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'permissionInfoTitle',
        type: 'core/v1/text',
        properties: { value: { raw: '**操作权限**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'permissionInfoContainer', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'permissionList',
        type: 'chakra_ui/v1/list',
        properties: {
          listData:
            "{{rolesTable.selectedItem ? _.toPairs(_.groupBy(rolesTable.selectedItem.permissions, 'resource.name')) : undefined}}",
          template: {
            id: 'permissionListItem-{{$i}}',
            type: 'userCenter/v1/infoRow',
            properties: {
              key: '{{$listItem[0]}}',
              value: "{{$listItem[1].map(v => v.name).join('\\n')}}",
              showEditButton: false,
            },
            traits: [],
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'permissionInfoContainer', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'viewRangeContainer',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: 4, align: 'stretch' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'roleInfoHStack', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'viewRangeHeader',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: 4, justify: 'space-between' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'viewRangeContainer', slot: 'content' },
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
        id: 'viewRangeInfoTitle',
        type: 'core/v1/text',
        properties: { value: { raw: '**可见范围**', format: 'md' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'viewRangeHeader', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'createViewRangeButton',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: '创建可见范围', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'viewRangeHeader', slot: 'content' },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'onClick',
                  componentId: 'isUpdateViewRange',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value: false,
                    },
                  },
                },
                {
                  type: 'onClick',
                  componentId: 'editingViewRange',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'data',
                      value: {},
                    },
                  },
                },
                {
                  type: 'onClick',
                  componentId: 'viewRangeFormDialog',
                  method: {
                    name: 'openDialog',
                    parameters: { title: '创建可见范围' },
                  },
                  disabled: false,
                },
              ],
            },
          },
          {
            type: 'core/v1/style',
            properties: { styleSlot: 'content', style: 'width: 100px;' },
          },
        ],
      },
      {
        id: 'viewRangeList',
        type: 'chakra_ui/v1/list',
        properties: {
          listData:
            '{{rolesTable.selectedItem ? rolesTable.selectedItem.viewRanges : undefined}}',
          template: {
            id: 'viewRangeListItem-{{$i}}',
            type: 'userCenter/v1/infoRow',
            properties: {
              key: '{{$listItem.resource.name}}',
              value:
                "{{$listItem.type === 'DEPARTMENTS' ? $listItem.departments.map(d => d.name).join(', ') : ($listItem.type === 'ALL' ? '全部' : '个人')}}",
              showEditButton: true,
            },
            handlers: [
              {
                type: 'onClickEdit',
                componentId: 'isUpdateViewRange',
                method: {
                  name: 'setValue',
                  parameters: {
                    key: 'value',
                    value: true,
                  },
                },
                disabled: 'false',
              },
              {
                type: 'onClickEdit',
                componentId: 'editingViewRange',
                method: {
                  name: 'setValue',
                  parameters: {
                    key: 'data',
                    value: '{{$listItem}}',
                  },
                },
                disabled: 'false',
              },
              {
                type: 'onClickEdit',
                componentId: 'viewRangeFormDialog',
                method: {
                  name: 'openDialog',
                  parameters: { title: '编辑可见范围' },
                },
                disabled: 'false',
              },
            ],
            traits: [],
          },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'viewRangeContainer', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'roleFormDialog',
        type: 'chakra_ui/v1/dialog',
        properties: {
          title: 'Dialog',
          confirmButton: {
            text: "{{isUpdateRole.value ? '保存' : '创建'}}",
          },
          cancelButton: { text: '取消' },
          disableConfirm: '{{roleFormModule.disableSubmit}}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'root', slot: 'root' } },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'confirmDialog',
                  componentId: "{{ isUpdateRole.value ? 'updateRole' : 'createRole'}}",
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  type: 'cancelDialog',
                  componentId: 'roleFormDialog',
                  method: { name: 'cancelDialog' },
                  disabled: false,
                },
              ],
            },
          },
        ],
      },

      {
        id: 'roleFormModuleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'roleFormModule',
          type: 'userCenter/v1/roleForm',
          properties: {
            initValue: {
              name: "{{rolesTable.selectedItem ? rolesTable.selectedItem.name : ''}}",
              system:
                "{{rolesTable.selectedItem ? rolesTable.selectedItem.system.id : ''}}",
              permissions:
                '{{rolesTable.selectedItem ? rolesTable.selectedItem.permissions.map(({id, name}) => ({label: name, value: id})) : []}}',
            },
          },
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'roleFormDialog', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'viewRangeFormDialog',
        type: 'chakra_ui/v1/dialog',
        properties: {
          title: 'Dialog',
          confirmButton: {
            text: "{{isUpdateViewRange.value ? '保存' : '创建'}}",
          },
          cancelButton: { text: '取消' },
          disableConfirm: '{{viewRangeFormModule.disableSubmit}}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'root', slot: 'root' } },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'confirmDialog',
                  componentId:
                    "{{isUpdateViewRange.value ? 'updateViewRange' : 'createViewRange'}}",
                  method: { name: 'triggerFetch' },
                  disabled: false,
                },
                {
                  type: 'cancelDialog',
                  componentId: 'viewRangeFormDialog',
                  method: { name: 'cancelDialog' },
                  disabled: false,
                },
              ],
            },
          },
          {
            type: 'core/v1/state',
            properties: {
              key: 'isUpdate',
              initialValue: false,
            },
          },
        ],
      },

      {
        id: 'viewRangeFormModuleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'viewRangeFormModule',
          type: 'userCenter/v1/viewRangeForm',
          properties: {
            systemId:
              "{{rolesTable.selectedItem ? rolesTable.selectedItem.system.id : ''}}",
            initValue: {
              resource: '{{editingViewRange.data.resource.id}}',
              type: '{{editingViewRange.data.type}}',
              departments:
                '{{editingViewRange.data.departments.map((d) => ({label: d.name, value: d.id}))}}',
            },
          },
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'viewRangeFormDialog', slot: 'content' },
            },
          },
        ],
      },

      {
        id: 'strategyText',
        type: 'core/v1/text',
        properties: { value: { raw: '分配策略占位', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'tabs1', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'tabs2',
        type: 'chakra_ui/v1/tabs',
        properties: {
          tabNames: ['部门', '职位'],
          initialSelectedTabIndex: 1,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'tabs1', slot: 'content' } },
          },
        ],
      },

      {
        id: 'departmentPageModuleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'departmentPageModule',
          type: 'userCenter/v1/departmentPage',
          properties: {},
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'tabs2', slot: 'content' },
            },
          },
        ],
      },
      {
        id: 'positionPageModuleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'positionPageModule',
          type: 'userCenter/v1/positionPage',
          properties: {},
          handlers: [],
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: { id: 'tabs2', slot: 'content' },
            },
          },
        ],
      },
    ],
  },
};
