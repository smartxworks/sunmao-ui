import React from 'react';
import { Application } from '@meta-ui/core';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { eventBus } from '../../eventBus';
import { RemoveComponentOperation } from '../../operations/Operations';

type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, Array<Application['spec']['components'][0]>>;
type Component = Application['spec']['components'][0];

type Props = {
  app: Application;
  onSelectComponent: (id: string) => void;
};

export const StructureTree: React.FC<Props> = props => {
  const { app, onSelectComponent } = props;
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

    const onClickRemove = () => {
      eventBus.send('operation', new RemoveComponentOperation(component.id));
    };

    return (
      <div key={component.id} style={{ paddingLeft: '16px' }}>
        <strong
          onClick={() => {
            onSelectComponent(component.id);
          }}
        >
          {component.id}
        </strong>
        <IconButton aria-label="remove" icon={<DeleteIcon />} onClick={onClickRemove} />
        {slotsEle}
      </div>
    );
  }

  const topEles = topLevelComponents.map(genTreeItem);

  return <div>{topEles}</div>;
};
