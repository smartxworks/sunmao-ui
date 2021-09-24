import React from 'react';
import { Application } from '@meta-ui/core';

type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, Array<Application['spec']['components'][0]>>;
type Component = Application['spec']['components'][0];

export const StructureTree: React.FC<{ app: Application }> = props => {
  const { app } = props;
  const topLevelComponents: Component[] = [];
  const childrenMap: ChildrenMap = new Map();

  app.spec.components.forEach(c => {
    const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
    if (slotTrait) {
      const { id: parentId, slot } = slotTrait.properties.container as any;
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, new Map());
      }
      if (!childrenMap.get(parentId)?.has(slot)) {
        childrenMap.get(parentId)?.set(slot, []);
      }

      childrenMap.get(parentId)!.get(slot)!.push(c);
    } else {
      topLevelComponents.push(c);
    }
  });

  function genTreeItem(component: Component) {
    const slots = childrenMap.get(component.id);
    let slotsEle;
    if (slots) {
      slotsEle = Array.from(slots.keys()).map(slot => {
        const children = slots.get(slot)!.map(genTreeItem);
        return (
          <div key={slot}>
            <div>slot: {slot}</div>
            {children}
          </div>
        );
      });
    }
    return (
      <div key={component.id} style={{ paddingLeft: '16px' }}>
        <strong>{component.id}</strong>
        {slotsEle}
      </div>
    );
  }

  const topEles = topLevelComponents.map(genTreeItem);

  return <div>{topEles}</div>;
};
