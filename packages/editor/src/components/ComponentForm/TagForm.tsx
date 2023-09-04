import React from 'react';
import { Text, VStack, Checkbox } from '@chakra-ui/react';
import { EditorServices } from '../../types';

type Props = {
  services: EditorServices;
};

export const TagForm: React.FC<Props> = ({ services }) => {
  const { editorStore } = services;
  const tagMap = editorStore.app.metadata.annotations?.componentsTagMap;
  const componentId = editorStore.selectedComponentId;

  if (!tagMap) return null;

  const tagItems = Object.keys(tagMap).map(tag => {
    const checked = tagMap[tag].includes(editorStore.selectedComponentId);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTagMap = tagMap;
      const nextValue = e.target.checked;
      if (nextValue) {
        newTagMap[tag].push(componentId);
      } else {
        newTagMap[tag] = tagMap[tag].filter(id => id !== componentId);
      }
      services.editorStore.appStorage.saveAppAnnotations({
        componentsTagMap: newTagMap,
      });
    };

    return (
      <Checkbox key={tag} defaultChecked={checked} onChange={onChange}>
        <Text>{tag}</Text>
      </Checkbox>
    );
  });

  return <VStack align="flex-start">{tagItems}</VStack>;
};
