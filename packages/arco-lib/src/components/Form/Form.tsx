import { Form as BaseForm } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../../sunmao-helper';
import { FormPropsSpec as BaseFormPropsSpec } from '../../generated/types/Form';
import { EmptyPlaceholder } from '../_internal/EmptyPlaceholder';

const FormPropsSpec = Type.Object(BaseFormPropsSpec);
const FormStateSpec = Type.Object({});

const exampleProperties: Static<typeof FormPropsSpec> = {
  inline: false,
  size: 'default',
  bordered: true,
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'form',
    displayName: 'Form',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: FormPropsSpec,
    state: FormStateSpec,
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
};

export const Form = implementRuntimeComponent(options)(props => {
  const { inline, bordered, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  const borderStyle = css`
    border: 1px solid #eee;
    width: 100%;
    height: 100%;
    padding: 5px;
  `;

  return (
    <div ref={elementRef} className={bordered ? borderStyle : ''}>
      <BaseForm
        className={css(customStyle?.content)}
        {...cProps}
        layout={inline ? 'inline' : 'horizontal'}
      >
        {slotsElements.content ? (
          slotsElements.content
        ) : (
          <EmptyPlaceholder componentName="Form Control" />
        )}
      </BaseForm>
    </div>
  );
});
