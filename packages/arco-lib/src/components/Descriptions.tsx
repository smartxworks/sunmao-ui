import { Descriptions as BaseDescriptions } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { DescriptionPropsSpec as BaseDescriptionPropsSpec } from '../generated/types/Descriptions';
import { useMemo } from 'react';

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
      value: 'Zhichun Road, Beijing',
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

export const Descriptions = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'descriptions',
    displayName: 'Descriptions',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: DescriptionPropsSpec,
    state: DescriptionStateSpec,
    methods: {},
    slots: {
      title: { slotProps: Type.Object({}) },
      label: {
        slotProps: Type.Object({
          label: Type.String(),
        }),
      },
      value: {
        slotProps: Type.Object({
          value: Type.String(),
        }),
      },
    },
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { data, title, ...cProps } = getComponentProps(props);
  const { slotsElements, customStyle } = props;
  const descriptionData = useMemo(() => {
    return data.map((d, idx) => {
      return {
        label:
          slotsElements?.label?.({ label: d.label }, undefined, `label_${idx}`) ||
          d.label,
        value:
          slotsElements?.value?.({ value: d.value }, undefined, `value_${idx}`) ||
          d.value,
        span: d.span,
      };
    });
  }, [data, slotsElements]);

  return (
    <BaseDescriptions
      data={descriptionData}
      title={slotsElements?.title?.({}) || title}
      className={css(customStyle?.content)}
      {...cProps}
    />
  );
});
