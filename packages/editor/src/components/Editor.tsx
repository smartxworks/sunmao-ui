import { useEffect, useState } from 'react';
import { Application, createApplication } from '@meta-ui/core';
import { Box, Button } from '@chakra-ui/react';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import { DialogFormSchema } from '../constants';
import { App } from '../metaUI';

export const Editor = () => {
  const [code, setCode] = useState(JSON.stringify(DialogFormSchema));
  const [codeError, setCodeError] = useState('');
  const [app, setApp] = useState<Application>(() => JSON.parse(code));
  useEffect(() => {
    try {
      const newApp = JSON.parse(code);
      // as validation
      createApplication(newApp);
      setApp(newApp);
      setCodeError('');
    } catch (error) {
      console.warn(error);
      setCodeError(String(error));
    }
  }, [code]);

  return (
    <Box display="flex" height="100vh">
      <Box flex="1" borderRight="2px solid black">
        <App debugStore={false} debugEvent={false} options={app} />
      </Box>
      <Box width="400px">
        <Box py={1}>
          <Button
            size="sm"
            onClick={() => {
              try {
                setCode(JSON.stringify(JSON.parse(code), null, 2));
              } catch {
                return;
              }
            }}>
            format
          </Button>
        </Box>
        <Box background={codeError ? 'red.50' : 'blue.50'}>
          <CodeEditor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.json, 'JSON')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </Box>
        {codeError && <Box>{codeError}</Box>}
      </Box>
    </Box>
  );
};
