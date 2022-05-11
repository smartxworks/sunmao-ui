import { Descriptions as BaseDescriptions } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { DescriptionPropsSpec as BaseDescriptionPropsSpec } from '../generated/types/Descriptions';

const DescriptionPropsSpec = Type.Object(BaseDescriptionPropsSpec);
const DescriptionStateSpec = Type.Object({});

const exampleProperties: Static<typeof DescriptionPropsSpec> = {
  data: [
    {
      label: 'Name',
      value: 'Socrates',
    },
    {
      label: 'Mobile',
      value: '123-1234-1234',
    },
    {
      label: 'Residence',
      value: 'Beijing',
    },
    {
      label: 'Hometown',
      value: 'Beijing',
    },
    {
      label: 'Date of Birth',
      value: '2020-05-15',
      span: 2,
    },
    {
      label: 'Address',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
  ],
  title: 'User Info',
  colon: '',
  layout: 'horizontal',
  size: 'default',
  tableLayout: 'auto',
  border: true,
  column: 2,
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'descriptions',
    displayName: 'Descriptions',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: DescriptionPropsSpec,
    state: DescriptionStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
};

export const Descriptions = implementRuntimeComponent(options)(props => {
  const { data, ...cProps } = getComponentProps(props);
  const { customStyle } = props;

  return (
    <BaseDescriptions data={data} className={css(customStyle?.content)} {...cProps} />
  );
});
