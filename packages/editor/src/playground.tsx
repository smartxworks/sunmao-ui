import { Flex, Box, ChakraProvider, Button } from '@chakra-ui/react';
import { Application } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import React, { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';

import { initSunmaoUIEditor } from './init';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';

type Example = {
  name: string;
  value: {
    app: Application;
    modules?: Parameters<Registry['registerModule']>[0][];
  };
};

const Playground: React.FC<{ examples: Example[] }> = ({ examples }) => {
  const [example, setExample] = useState<Example | null>(examples[0]);
  const { Editor, registry } = initSunmaoUIEditor({
    libs: [sunmaoChakraUILib],
    defaultApplication: example?.value.app,
  });
  example?.value.modules?.forEach(m => registry.registerModule(m));

  return (
    <Flex width="100vw" height="100vh">
      <Box shadow="md">
        <Box width="200px" height="100%" overflow="auto" pl={2}>
          {examples.map(e => (
            <Button
              variant={example === e ? 'solid' : 'ghost'}
              key={e.name}
              onClick={() => {
                /**
                 * Currently, the data flow between the useAppModel and
                 * the AppModelManager is a little wierd.
                 * When initialize the AppModelManager, it will notify
                 * the useAppModel hook, which will cause the Editor
                 * component update.
                 * React does not like this and throw Error to complain
                 * the Editor and the Playground components are updating
                 * together.
                 * So we set example to null, which unmount the editor
                 * first. Then we can re-create the editor with new example
                 * spec.
                 */
                setExample(null);
                setTimeout(() => {
                  setExample(e);
                }, 0);
              }}
            >
              {e.name}
            </Button>
          ))}
        </Box>
      </Box>
      <Box flex="1">
        <Editor />
      </Box>
    </Flex>
  );
};

export default function renderPlayground(examples: Example[]) {
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Playground examples={examples} />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}
