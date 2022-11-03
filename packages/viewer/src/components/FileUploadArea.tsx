import React, { useState } from 'react';
import { css } from '@emotion/css';
import { Button, Upload } from '@arco-design/web-react';
import { Application } from '@sunmao-ui/core';

import jsyaml from 'js-yaml';

type Props = {
  onClickMerge: (o: Application, a: Application, b: Application) => void;
};

const Style = css`
  height: 100%;
  padding: 32px;
  border-right: 1px solid #eee;
`;

export const FileUploadArea: React.FC<Props> = ({ onClickMerge }) => {
  const [fileO, setFileO] = useState<Application | undefined>();
  const [fileA, setFileA] = useState<Application | undefined>();
  const [fileB, setFileB] = useState<Application | undefined>();

  const parseFile = async (file: File) => {
    const text = await file.text();
    try {
      return JSON.parse(text) as Application;
    } catch {
      try {
        return jsyaml.load(text) as Application;
      } catch {
        console.warn('Failed parsing file, please choose json and yaml file.');
      }
    }
  };

  const _onClickMerge = async () => {
    if (!fileO || !fileA || !fileB) return;
    onClickMerge(fileO, fileA, fileB);
  };

  return (
    <div className={Style}>
      <Upload
        drag
        accept=".json, .yaml"
        onChange={async fileList => {
          if (!fileList[0].originFile) return;
          const app = await parseFile(fileList[0].originFile);
          if (app) setFileO(app);
        }}
        tip="Version O"
      />
      <Upload
        drag
        accept=".json, .yaml"
        onChange={async fileList => {
          if (!fileList[0].originFile) return;
          const app = await parseFile(fileList[0].originFile);
          if (app) setFileA(app);
        }}
        tip="Version A"
      />
      <Upload
        drag
        accept=".json, .yaml"
        onChange={async fileList => {
          if (!fileList[0].originFile) return;
          const app = await parseFile(fileList[0].originFile);
          if (app) setFileB(app);
        }}
        tip="Version B"
      />
      <Button
        type="primary"
        disabled={!fileO || !fileA || !fileB}
        onClick={_onClickMerge}
      >
        合并
      </Button>
    </div>
  );
};
