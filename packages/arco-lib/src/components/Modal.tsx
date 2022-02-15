import { Modal as BaseModal } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ModalPropsSchema as BaseModalPropsSchema } from "../generated/types/Modal";
import { useEffect, useState } from "react";

const ModalPropsSchema = Type.Object(BaseModalPropsSchema);
const ModalStateSchema = Type.Object({});

const ModalImpl: ComponentImpl<Static<typeof ModalPropsSchema>> = (props) => {
  const {
    subscribeMethods,
    slotsElements,
    customStyle,
    callbackMap,
  } = props;
  const { title, ...cProps } = getComponentProps(props);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    subscribeMethods({
      openModal() {
        setVisible(true);
      },
      closeModal() {
        setVisible(false);
      },
    });
  }, [subscribeMethods]);

  return (
    <BaseModal
      visible={visible}
      title={
        <>
          {title}
          {slotsElements.title}
        </>
      }
      onCancel={() => {
        setVisible(false);
        callbackMap?.onCancel?.();
      }}
      onOk={() => {
        setVisible(false);
        callbackMap?.onOk?.();
      }}
      afterClose={callbackMap?.afterClose}
      afterOpen={callbackMap?.afterOpen}
      footer={slotsElements.footer}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {slotsElements.content}
    </BaseModal>
  );
};

const exampleProperties: Static<typeof ModalPropsSchema> = {
  title: "Modal title",
  mask: true,
  simple: false,
  okText: "confirm",
  cancelText: "cancel",
  closable: true,
  maskClosable: true,
  confirmLoading: false,
};
export const Modal = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    name: "modal",
    displayName: "Modal",
    annotations: {
      category: "Display",
    }
  },
  spec: {
    properties: ModalPropsSchema,
    state: ModalStateSchema,
    methods: {
      openModal: Type.String(),
      closeModal: Type.String(),
    } as Record<string, any>,
    slots: ["title", "content", "footer"],
    styleSlots: ["content"],
    events: ["afterOpen", "afterClose", "onCancel", "onOk"],
  },
})(ModalImpl);
