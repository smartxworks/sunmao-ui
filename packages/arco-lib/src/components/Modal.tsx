import { Modal as BaseModal, ConfigProvider } from "@arco-design/web-react";
import {
  ComponentImpl,
  DIALOG_CONTAINER_ID,
  implementRuntimeComponent,
} from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ModalPropsSchema as BaseModalPropsSchema } from "../generated/types/Modal";
import { useEffect, useRef, useState } from "react";

const ModalPropsSchema = Type.Object(BaseModalPropsSchema);
const ModalStateSchema = Type.Object({});

const ModalImpl: ComponentImpl<Static<typeof ModalPropsSchema>> = (props) => {
  const { subscribeMethods, slotsElements, customStyle, callbackMap } = props;
  const { getElement, title, ...cProps } = getComponentProps(props);
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const afterOpen = () => {
    getElement && contentRef.current && getElement(contentRef.current);
    callbackMap?.afterOpen && callbackMap?.afterOpen();
  };
  const afterClose = () => {
    getElement && contentRef.current && getElement(contentRef.current);
    callbackMap?.afterClose && callbackMap?.afterClose();
  };

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
    <ConfigProvider focusLock={{ modal: false }}>
      <BaseModal
        getPopupContainer={() =>
          document.getElementById(DIALOG_CONTAINER_ID) || document.body
        }
        visible={visible}
        title={title}
        onCancel={() => {
          setVisible(false);
          callbackMap?.onCancel?.();
        }}
        onOk={() => {
          setVisible(false);
          callbackMap?.onOk?.();
        }}
        afterClose={afterClose}
        afterOpen={afterOpen}
        footer={slotsElements.footer}
        className={css(customStyle?.content)}
        mountOnEnter={true}
        unmountOnExit={true}
        {...cProps}
      >
        <div ref={contentRef}>{slotsElements.content}</div>
      </BaseModal>
    </ConfigProvider>
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
    },
  },
  spec: {
    properties: ModalPropsSchema,
    state: ModalStateSchema,
    methods: {
      openModal: Type.String(),
      closeModal: Type.String(),
    } as Record<string, any>,
    slots: ["content", "footer"],
    styleSlots: ["content"],
    events: ["afterOpen", "afterClose", "onCancel", "onOk"],
  },
})(ModalImpl);
