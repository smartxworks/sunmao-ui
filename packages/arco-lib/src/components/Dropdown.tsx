import { Dropdown as BaseDropdown } from "@arco-design/web-react";
import {
  ComponentImpl,
  implementRuntimeComponent,
} from "@sunmao-ui/runtime";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { DropdownPropsSchema as BaseDropdownPropsSchema } from "../generated/types/Dropdown";

const DropdownPropsSchema = Type.Object(BaseDropdownPropsSchema);
const DropdownStateSchema = Type.Object({});

const DropdownImpl: ComponentImpl<
  Static<typeof DropdownPropsSchema>
> = (props) => {
  const { slotsElements } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseDropdown {...cProps} droplist={slotsElements.list}>
      {slotsElements.trigger}
    </BaseDropdown>
  );
};

const exampleProperties: Static<typeof DropdownPropsSchema> = {
  position: "bl",
  disabled: false,
  unmountOnExit: false,
  defaultPopupVisible: false,
  popupVisible: false,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "dropdown",
    displayName: "Dropdown",
    exampleProperties,
  },
  spec: {
    properties: DropdownPropsSchema,
    state: DropdownStateSchema,
    methods: {},
    slots: ["trigger", "list"],
    styleSlots: [],
    events: [],
  },
};

export const Dropdown = implementRuntimeComponent(options)(
  DropdownImpl
);
