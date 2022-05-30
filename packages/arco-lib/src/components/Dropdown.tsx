import {
  Dropdown as BaseDropdown,
  Menu as BaseMenu,
  Button,
} from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { DropdownPropsSpec as BaseDropdownPropsSpec } from '../generated/types/Dropdown';

const DropdownPropsSpec = Type.Object(BaseDropdownPropsSpec);
const DropdownStateSpec = Type.Object({
  selectedItemKey: Type.String(),
  visible: Type.Boolean(),
});

const exampleProperties: Static<typeof DropdownPropsSpec> = {
  dropdownType: 'default',
  trigger: 'click',
  position: 'bl',
  disabled: false,
  defaultPopupVisible: false,
  list: [
    { key: '1', label: 'Menu item 1' },
    { key: '2', label: 'Menu item 2' },
    { key: '3', label: 'Menu item 3' },
  ],
  autoAlignPopupWidth: true,
  unmountOnExit: false,
};

export const Dropdown = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'dropdown',
    displayName: 'Dropdown',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: DropdownPropsSpec,
    state: DropdownStateSpec,
    methods: {},
    slots: ['trigger'],
    styleSlots: [],
    events: ['onClickMenuItem', 'onVisibleChange', 'onButtonClick'],
  },
})(props => {
  const { elementRef, slotsElements, callbackMap, mergeState } = props;
  const cProps = getComponentProps(props);
  const { list, dropdownType, autoAlignPopupWidth, ...restProps } = cProps;
  const typeMap = {
    default: BaseDropdown,
    button: BaseDropdown.Button,
  };

  const onClickMenuItem = (key: string) => {
    mergeState({
      selectedItemKey: key,
    });
    callbackMap?.onClickMenuItem?.();
  };
  const onVisibleChange = (visible: boolean) => {
    mergeState({
      visible,
    });
    callbackMap?.onVisibleChange?.();
  };

  const Dropdown = typeMap[dropdownType];
  const droplist = (
    <BaseMenu onClickMenuItem={onClickMenuItem}>
      {(list || []).map(item => (
        <BaseMenu.Item key={item.key}>{item.label}</BaseMenu.Item>
      ))}
    </BaseMenu>
  );

  return (
    <Dropdown
      {...restProps}
      droplist={droplist}
      onVisibleChange={onVisibleChange}
      onClick={callbackMap?.onButtonClick}
      triggerProps={{ autoAlignPopupMinWidth: autoAlignPopupWidth }}
    >
      <div ref={elementRef}>{slotsElements.trigger || <Button>Click</Button>}</div>
    </Dropdown>
  );
});
