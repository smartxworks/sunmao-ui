import { Form } from '@arco-design/web-react';
import { implementRuntimeComponent, Text } from '@sunmao-ui/runtime';
import { css, cx } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../../sunmao-helper';
import { FormControlPropsSpec as BaseFormControlPropsSpec } from '../../generated/types/Form';
import { EmptyPlaceholder } from '../_internal/EmptyPlaceholder';
import { FormControlErrorMessage } from './FormControlErrorMessage';

const FormControlPropsSpec = Type.Object(BaseFormControlPropsSpec);
const BaseFormControl = Form.Item;

const FormControlStyle = css`
  svg {
    display: inherit;
  }
  & * {
    word-wrap: normal;
  }
  & label {
    white-space: inherit !important;
  }
`;

const exampleProperties: Static<typeof FormControlPropsSpec> = {
  label: {
    format: 'plain',
    raw: 'label',
  },
  layout: 'horizontal',
  required: false,
  hidden: false,
  extra: '',
  errorMsg: '',
  labelAlign: 'left',
  colon: false,
  help: '',
  labelCol: {
    span: 3,
    offset: 0,
  },
  wrapperCol: {
    span: 21,
    offset: 0,
  },
};

export const FormControl = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'formControl',
    displayName: 'Form Control',
    exampleProperties: exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: FormControlPropsSpec,
    state: Type.Object({}),
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { label, errorMsg, ...cProps } = getComponentProps(props);
  const { elementRef, slotsElements, customStyle } = props;

  return (
    <BaseFormControl
      label={<Text cssStyle="display:inline-block" value={label} />}
      className={cx(
        FormControlStyle,
        css`
          ${customStyle?.content}
        `
      )}
      ref={elementRef}
      {...cProps}
    >
      {slotsElements.content ? (
        slotsElements.content({})
      ) : (
        <EmptyPlaceholder componentName="Input" />
      )}
      <FormControlErrorMessage errorMsg={errorMsg} />
    </BaseFormControl>
  );
});
