import React, { ReactElement } from 'react';
import { registry } from '../../metaUI';

export const ComponentList: React.FC = () => {
  const componentList = React.useMemo(() => {
    const groups: ReactElement[] = [];
    registry.components.forEach((componentMap, version) => {
      const components: ReactElement[] = [];
      componentMap.forEach(c => {
        const onDragStart = (e: any) => {
          e.dataTransfer.setData('component', `${c.version}/${c.metadata.name}`);
        };
        const cEle = (
          <div
            key={c.metadata.name}
            className="droppable-element"
            draggable={true}
            unselectable="on"
            onDragStart={onDragStart}
          >
            {`${c.version}/${c.metadata.name}`}
          </div>
        );

        components.push(cEle);
      });
      const cGroupEle = (
        <div key={version}>
          <div>
            <strong>{version}</strong>
          </div>
          {components}
        </div>
      );

      groups.push(cGroupEle);
    });

    return groups;
  }, []);

  return <div>{componentList}</div>;
};
