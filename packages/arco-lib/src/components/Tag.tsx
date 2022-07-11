import { Tag as BaseTag } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TagPropsSpec as BaseTagPropsSpec } from '../generated/types/Tag';
import { useEffect, useState } from 'react';

const TagPropsSpec = Type.Object(BaseTagPropsSpec);
const TagStateSpec = Type.Object({
  checked: Type.Boolean(),
});

const exampleProperties: Static<typeof TagPropsSpec> = {
  content: 'tag',
  closable: false,
  checkable: false,
  defaultChecked: false,
  color: '',
  size: 'large',
  bordered: false,
  defaultVisible: true,
};

export const Tag = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'tag',
    displayName: 'Tag',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: TagPropsSpec,
    state: TagStateSpec,
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({}),
      },
      icon: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: ['content'],
    events: ['onCheck', 'onClose'],
  },
})(props => {
  const { content, defaultChecked, defaultVisible, checkable, ...cProps } =
    getComponentProps(props);
  const { slotsElements, customStyle, elementRef, callbackMap, mergeState } = props;

  const [checked, setChecked] = useState<boolean | undefined>(defaultChecked);
  const [visible, setVisible] = useState(defaultVisible);
  useEffect(() => {
    if (!checkable) {
      setChecked(undefined);
      mergeState({ checked: undefined });
    } else {
      setChecked(defaultChecked);
      mergeState({ checked: defaultChecked });
    }
  }, [checkable, defaultChecked, mergeState, setChecked]);

  return (
    <BaseTag
      checked={checked}
      className={css(customStyle?.content)}
      ref={elementRef}
      checkable={checkable}
      visible={visible}
      onCheck={() => {
        setChecked(prev => !prev);
        mergeState({ checked: !checked });
        callbackMap?.onCheck?.();
      }}
      onClose={() => {
        setVisible(false);
        setChecked(undefined);
        mergeState({ checked: undefined });
        callbackMap?.onClose?.();
      }}
      icon={slotsElements.icon ? slotsElements.icon({}) : null}
      {...cProps}
    >
      {(slotsElements.content && slotsElements.content({})) || content}
    </BaseTag>
  );
});
