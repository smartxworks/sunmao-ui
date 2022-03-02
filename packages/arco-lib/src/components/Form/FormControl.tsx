import { Form } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent, Text } from '@sunmao-ui/runtime';
import { css, cx } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../../sunmao-helper';
import { FormControlPropsSchema as BaseFormControlPropsSchema } from '../../generated/types/Form';
import { DragComponentTips } from './DragComponentTips';
import { FormControlErrorMessage } from './FormControlErrorMessage';

const FormControlPropsSchema = Type.Object(BaseFormControlPropsSchema);
const BaseFormControl = Form.Item;

const FormControlImpl: ComponentImpl<Static<typeof FormControlPropsSchema>> = props => {
  const { label, errorMsg, ...cProps } = getComponentProps(props);
  const { elementRef, slotsElements, customStyle } = props;

  if (!cProps.colon) {
    Reflect.deleteProperty(cProps, 'colon');
  }
  if (cProps.labelAlign === 'unset') {
    Reflect.deleteProperty(cProps, 'labelAlign');
  }

  const formControlProps = {
    className: cx(
      'sunmao-form-control-layout',
      css`
        ${customStyle?.content}
        svg {
          display: inherit;
        }
        & * {
          word-wrap: normal;
        }
        & label {
          white-space: inherit !important;
        }
      `
    ),
  };

  return (
    <BaseFormControl
      label={<Text cssStyle="display:inline-block" value={label} />}
      ref={elementRef}
      {...formControlProps}
      {...cProps}
      labelAlign={cProps.labelAlign as any}
    >
      {slotsElements.content ? (
        slotsElements.content
      ) : (
        <DragComponentTips componentName="Form Control" />
      )}
      <FormControlErrorMessage errorMsg={errorMsg} />
    </BaseFormControl>
  );
};

const exampleProperties: Static<typeof FormControlPropsSchema> = {
  label: {
    format: 'md',
    raw: '**label**',
  },
  required: false,
  hidden: false,
  extra: '',
  errorMsg: '',
  labelAlign: 'unset',
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
