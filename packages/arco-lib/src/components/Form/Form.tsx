import { Form as BaseForm } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../../sunmao-helper';
import { FormPropsSchema as BaseFormPropsSchema } from '../../generated/types/Form';
import { DragComponentTips } from './DragComponentTips';

const FormPropsSchema = Type.Object(BaseFormPropsSchema);
const FormStateSchema = Type.Object({});

const FormImpl: ComponentImpl<Static<typeof FormPropsSchema>> = props => {
  const { childrenLayout, bordered, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  let formStyle;
  if (cProps.layout === 'inline' && childrenLayout === 'vertical') {
    formStyle = `
      && {
        flex-direction: row;
        flex-wrap: wrap;
      }
      && > *{
        margin:0 10px 10px 0;
        display: block;
        width: auto
      }
      `;
  }
  const borderStyle = css`
    border: 1px solid #eee;
    width: 100%;
    height: 100%;
    padding: 5px;
  `;

  return (
    <div ref={elementRef} className={bordered ? borderStyle : ''}>
      <BaseForm className={css(customStyle?.content, formStyle)} {...cProps}>
        {slotsElements.content ? (
          slotsElements.content
        ) : (
          <DragComponentTips componentName="Form Control" />
        )}
      </BaseForm>
    </div>
  );
};

const exampleProperties: Static<typeof FormPropsSchema> = {
  layout: 'horizontal',
  size: 'default',
  bordered: true,
  labelAlign: 'left',
  childrenLayout: 'horizontal',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'formStack',
    displayName: 'Form Stack',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: FormPropsSchema,
    state: FormStateSchema,
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
};

export const Form = implementRuntimeComponent(options)(FormImpl);
