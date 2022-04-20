import React from 'react';
import { ImplWrapperProps } from '../../../../types';

export function useGridLayout(
  props: ImplWrapperProps,
  node: React.ReactNode,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { component: c, app } = props;

  let parentComponent;

  const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');

  if (slotTrait && app) {
    parentComponent = app.spec.components.find(
      c => c.id === (slotTrait.properties.container as any).id
    );
  }

  if (parentComponent?.parsedType.name === 'grid_layout') {
    /* eslint-disable */
    const { component, services, app, gridCallbacks, ...restProps } = props;
    /* eslint-enable */
    return (
      <div key={c.id} data-sunmao-ui-id={c.id} ref={ref} {...restProps}>
        {node}
      </div>
    );
  }

  return <>{node}</>;
}
