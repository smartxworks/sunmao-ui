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

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'popover',
    displayName: 'Popover',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PopoverPropsSpec,
    state: PopoverStateSpec,
    methods: {
      openPopover: Type.String(),
      closePopover: Type.String(),
    } as Record<string, any>,
    slots: ['popupContent', 'content'],
    styleSlots: ['content'],
    events: [],
  },
};

export const Popover = implementRuntimeComponent(options)(props => {
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
      {...cProps}
      content={slotsElements.popupContent}
    >
      <span ref={elementRef}>{slotsElements.content || <Button>Hover Me</Button>}</span>
    </BasePopover>
  ) : (
    <BasePopover
      className={css(customStyle?.content)}
      {...cProps}
      content={slotsElements.popupContent}
      popupVisible={popupVisible}
      onVisibleChange={visible => {
        setPopupVisible(visible);
      }}
    >
      <span ref={elementRef}>{slotsElements.content || <Button>Hover Me</Button>}</span>
    </BasePopover>
  );
});
