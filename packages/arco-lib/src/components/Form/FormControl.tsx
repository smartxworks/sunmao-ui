import { Form } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent, Text } from '@sunmao-ui/runtime';
import { css, cx } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../../sunmao-helper';
import { FormControlPropsSchema as BaseFormControlPropsSchema } from '../../generated/types/Form';
import { EmptyPlaceholder } from './EmptyPlaceholder';
import { FormControlErrorMessage } from './FormControlErrorMessage';

const FormControlPropsSchema = Type.Object(BaseFormControlPropsSchema);
const BaseFormControl = Form.Item;

const FormControlStyle = css`
  margin-right: 10px;
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

const FormControlImpl: ComponentImpl<Static<typeof FormControlPropsSchema>> = props => {
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
        slotsElements.content
      ) : (
        <EmptyPlaceholder componentName="Input" />
      )}
      <FormControlErrorMessage errorMsg={errorMsg} />
    </BaseFormControl>
  );
};

const exampleProperties: Static<typeof FormControlPropsSchema> = {
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
  labelCol: { span: 5, offset: 0 },
  wrapperCol: { span: 19, offset: 0 },
  help: '',
};

export const FormControl = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'formControl',
    displayName: 'Form Control',
    exampleProperties: exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: FormControlPropsSchema,
    state: Type.Object({}),
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
})(FormControlImpl);
