import { Type } from '@sinclair/typebox';
import { css } from '@emotion/css';
import { implementRuntimeComponent } from '../../utils/buildKit';
import React, { useEffect, useRef } from 'react';
import { CORE_VERSION } from '@sunmao-ui/shared';

const PropsSpec = Type.Object({
  multiple: Type.Boolean({
    title: 'Select Multiple Files',
    category: 'Basic',
  }),
  hideDefaultInput: Type.Boolean({
    title: 'Hide Default Input',
    category: 'Basic',
  }),
  fileTypes: Type.Array(Type.String(), {
    title: 'File Types',
    description: 'The accept value of Input. Example: ["jpg", "png", "svg", "gif"].',
    category: 'Basic',
  }),
});

const StateSpec = Type.Object({
  // actually, the type of files is 'File[]'
  // but JSON schema dose not has this type, so I mock it.
  files: Type.Array(
    Type.Object({
      lastModified: Type.Number(),
      name: Type.String(),
      size: Type.Number(),
      type: Type.String(),
    })
  ),
});

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: 'fileInput',
    displayName: 'File Input',
    description: 'Select file',
    isDraggable: true,
    isResizable: false,
    exampleProperties: {
      multiple: false,
      hideDefaultInput: false,
      fileTypes: [],
    },
    exampleSize: [1, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {
      selectFile: Type.Object({}),
    },
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
    hideDefaultInput,
    multiple,
    fileTypes,
    mergeState,
    subscribeMethods,
    customStyle,
    elementRef,
    slotsElements,
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      mergeState({ files: [] });

      subscribeMethods({
        selectFile: () => {
          inputRef.current?.click();
        },
      });
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      mergeState({
        files: Array.prototype.slice.call(e.target.files) || [],
      });
    };

    return (
      <div
        ref={elementRef}
        className={css`
          ${customStyle?.content}
        `}
      >
        <input
          style={{ display: hideDefaultInput ? 'none' : 'block' }}
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={fileTypes.join(',')}
          onChange={onChange}
        />
        {slotsElements.content ? <slotsElements.content /> : null}
      </div>
    );
  }
);
