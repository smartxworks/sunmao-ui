import { Tooltip as BaseTooltip, Button } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TooltipPropsSpec as BaseTooltipPropsSpec } from '../generated/types/Tooltip';
import { useState, useEffect } from 'react';

const TooltipPropsSpec = Type.Object(BaseTooltipPropsSpec);
const TooltipStateSpec = Type.Object({});

export const Tooltip = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'tooltip',
    displayName: 'Tooltip',
    exampleProperties: {
      color: '#bbb',
      position: 'bottom',
      mini: false,
      disabled: false,
      content: 'This is tooltip',
      trigger: 'hover',
      controlled: false,
      unmountOnExit: true,
    },
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: TooltipPropsSpec,
    state: TooltipStateSpec,
    methods: {
      openTooltip: Type.Object({}),
      closeTooltip: Type.Object({}),
    },
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content', 'tooltip-trigger'],
    events: [],
  },
})(props => {
  const { controlled, ...cProps } = getComponentProps(props);
  const { elementRef, subscribeMethods, slotsElements, customStyle } = props;

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    subscribeMethods({
      openTooltip() {
        setPopupVisible(true);
      },
      closeTooltip() {
        setPopupVisible(false);
      },
    });
  }, [subscribeMethods]);

  return controlled ? (
    <div className={css(customStyle?.['tooltip-trigger'])}>
      <BaseTooltip
        ref={elementRef}
        className={css(customStyle?.content)}
        {...cProps}
        popupVisible={popupVisible}
      >
        {/* need the child node of Tooltip accepts onMouseEnter, onMouseLeave, onFocus, onClick events */}
        <span ref={elementRef}>
          {slotsElements.content ? slotsElements.content({}) : <Button>Hover Me</Button>}
        </span>
      </BaseTooltip>
    </div>
  ) : (
    <div className={css(customStyle?.['tooltip-trigger'])}>
      <BaseTooltip className={css(customStyle?.content)} {...cProps}>
        <span ref={elementRef}>
          {slotsElements.content ? slotsElements.content({}) : <Button>Hover Me</Button>}
        </span>
      </BaseTooltip>
    </div>
  );
});
