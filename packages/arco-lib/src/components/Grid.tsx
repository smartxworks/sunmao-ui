import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { Type } from '@sinclair/typebox';
import { Grid } from '@arco-design/web-react';
import { css } from '@emotion/css';
import { RowPropsSpec, ColPropsSpec } from '../generated/types/Grid';
import { getComponentProps } from '../sunmao-helper';
import { EmptyPlaceholder } from './_internal/EmptyPlaceholder';

export const Row = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    name: 'row',
    displayName: 'Row',
    description: '',
    exampleProperties: {
      gutter: 16,
      align: 'start',
      justify: 'start',
    },
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: Type.Object(RowPropsSpec),
    state: Type.Object({}),
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['wrapper'],
    events: [],
  },
})(props => {
  const { elementRef, slotsElements, customStyle } = props;
  const { ...cProps } = getComponentProps(props);

  return (
    <Grid.Row className={css(customStyle?.wrapper)} ref={elementRef} {...cProps}>
      {slotsElements.content ? (
        slotsElements.content({})
      ) : (
        <EmptyPlaceholder componentName="" />
      )}
    </Grid.Row>
  );
});

export const Col = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    name: 'col',
    displayName: 'Col',
    description: '',
    exampleProperties: {
      offset: 0,
      pull: 0,
      push: 0,
      span: 12,
      order: 0,
    },
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: Type.Object(ColPropsSpec),
    state: Type.Object({}),
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['wrapper'],
    events: [],
  },
})(props => {
  const { elementRef, slotsElements, customStyle } = props;
  const { ...cProps } = getComponentProps(props);
  return (
    <Grid.Col className={css(customStyle?.wrapper)} ref={elementRef} {...cProps}>
      {slotsElements.content ? (
        slotsElements.content({})
      ) : (
        <EmptyPlaceholder componentName="" />
      )}
    </Grid.Col>
  );
});
