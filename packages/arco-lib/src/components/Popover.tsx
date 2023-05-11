import { Popover as BasePopover, Button } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { PopoverPropsSpec as BasePopoverPropsSpec } from '../generated/types/Popover';
import { useEffect, useState } from 'react';

const PopoverPropsSpec = Type.Object(BasePopoverPropsSpec);
const PopoverStateSpec = Type.Object({});

const exampleProperties: Static<typeof PopoverPropsSpec> = {
  color: '#eee',
  position: 'bottom',
  disabled: false,
  controlled: false,
  trigger: 'hover',
  title: 'Title',
  unmountOnExit: false,
};

export const Popover = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'popover',
    displayName: 'Popover',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: PopoverPropsSpec,
    state: PopoverStateSpec,
    methods: {
      openPopover: Type.Object({}),
      closePopover: Type.Object({}),
    },
    slots: {
      popupContent: { slotProps: Type.Object({}) },
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content', 'popover-trigger'],
    events: [],
  },
})(props => {
  const { controlled, ...cProps } = getComponentProps(props);
  const { subscribeMethods, elementRef, slotsElements, customStyle } = props;

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    subscribeMethods({
      openPopover() {
        setPopupVisible(true);
      },
      closePopover() {
        setPopupVisible(false);
      },
    });
  }, [subscribeMethods]);

  return controlled ? (
    <BasePopover
      className={css(customStyle?.content)}
      popupVisible={popupVisible}
      {...cProps}
      content={slotsElements.popupContent ? slotsElements.popupContent({}) : null}
    >
      <span className={css(customStyle?.['popover-trigger'])} ref={elementRef}>
        {slotsElements.content ? slotsElements.content({}) : <Button>Hover Me</Button>}
      </span>
    </BasePopover>
  ) : (
    <BasePopover
      className={css(customStyle?.content)}
      {...cProps}
      content={slotsElements.popupContent ? slotsElements.popupContent({}) : null}
      popupVisible={popupVisible}
      onVisibleChange={visible => {
        setPopupVisible(visible);
      }}
    >
      <span className={css(customStyle?.['popover-trigger'])} ref={elementRef}>
        {slotsElements.content ? slotsElements.content({}) : <Button>Hover Me</Button>}
      </span>
    </BasePopover>
  );
});
