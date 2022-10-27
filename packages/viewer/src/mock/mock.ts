import { Application } from '@sunmao-ui/core';

export const BaseSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'login',
  },
  spec: {
    components: [
      {
        id: 'text11',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [],
      },
      {
        id: 'stack12',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'fileInput13',
        type: 'core/v1/fileInput',
        properties: {
          multiple: false,
          hideDefaultInput: false,
          fileTypes: [],
        },
        traits: [],
      },
      {
        id: 'iframe14',
        type: 'core/v1/iframe',
        properties: {
          src: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
          referrerpolicy: 'unset',
          sandbox: 'unset',
          fetchpriority: 'auto',
        },
        traits: [],
      },
      {
        id: 'moduleContainer15',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'myModule',
          type: 'custom/v1/module',
        },
        traits: [],
      },
    ],
  },
};

export const Schema1: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'login',
  },
  spec: {
    components: [
      {
        id: 'text11',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [],
      },
      {
        id: 'stack12',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'fileInput13',
        type: 'core/v1/fileInput',
        properties: {
          multiple: false,
          hideDefaultInput: false,
          fileTypes: [],
        },
        traits: [],
      },
      {
        id: 'new_text16',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [],
      },
      {
        id: 'iframe14',
        type: 'core/v1/iframe',
        properties: {
          src: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
          referrerpolicy: 'unset',
          sandbox: 'unset',
          fetchpriority: 'auto',
        },
        traits: [],
      },
      {
        id: 'moduleContainer15',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'myModule',
          type: 'custom/v1/module',
        },
        traits: [],
      },
    ],
  },
};

export const Schema2: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'login',
  },
  spec: {
    components: [
      {
        id: 'text11',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [],
      },
      {
        id: 'iframe14',
        type: 'core/v1/iframe',
        properties: {
          src: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
          referrerpolicy: 'unset',
          sandbox: 'unset',
          fetchpriority: 'auto',
        },
        traits: [],
      },
      {
        id: 'stack12',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'fileInput13',
        type: 'core/v1/fileInput',
        properties: {
          multiple: false,
          hideDefaultInput: false,
          fileTypes: [],
        },
        traits: [],
      },
      {
        id: 'text5',
        type: 'core/v1/text',
        properties: {
          value: {
            raw: 'text',
            format: 'plain',
          },
        },
        traits: [],
      },
      {
        id: 'moduleContainer15',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'myModule',
          type: 'custom/v1/module',
        },
        traits: [],
      },
    ],
  },
};
