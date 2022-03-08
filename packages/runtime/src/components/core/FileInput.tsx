import { Type } from '@sinclair/typebox';
import { css } from '@emotion/css';
import { implementRuntimeComponent } from '../../utils/buildKit';
import React, { useRef } from 'react';

const StateSchema = Type.Object({
  files: Type.Any(),
});

const PropsSchema = Type.Object({});

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'fileInput',
    displayName: 'File Input',
    description: 'Select file',
    isDraggable: true,
    isResizable: false,
    exampleProperties: {},
    exampleSize: [1, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(({ mergeState, customStyle, elementRef }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    mergeState({
      files: e.target.files,
    });
    if (!e.target.files) return;
    const formData = new FormData();
    formData.append('myFile', e.target.files[0]);
    console.log('formData', formData)
    fetch('http://localhost:3000/', {
      method: 'POST',
      body: formData,
    })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
    console.log(e.target.files);
  };

  return (
    <div
      ref={elementRef}
      className={css`
        ${customStyle?.content}
      `}
    >
      <input ref={inputRef} type="file" name="文件上传" onChange={onChange} />
    </div>
  );
});
