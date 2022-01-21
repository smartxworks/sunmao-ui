import { Modal as BaseModal } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ModalPropsSchema as BaseModalPropsSchema } from "../generated/types/Modal";
import { useEffect, useState } from "react";

const ModalPropsSchema = Type.Object(BaseModalPropsSchema);
const ModalStateSchema = Type.Object({
  visible: Type.Boolean(),
});

const ModalImpl: ComponentImpl<Static<typeof ModalPropsSchema>> = (props) => {
  const {
    subscribeMethods,
    mergeState,
    slotsElements,
    customStyle,
    callbackMap,
  } = props;
  const { className, title, ...cProps } = getComponentProps(props);
  const [visible, _setVisible] = useState(true);

  useEffect(() => {
    mergeState({ visible });
  }, [visible, mergeState]);

  useEffect(() => {
    subscribeMethods({
      setVisible({ visible }) {
        _setVisible(!!visible);
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
        _setVisible(false);
        callbackMap?.onCancel();
      }}
      onOk={() => {
        _setVisible(false);
        callbackMap?.onOk();
      }}
      afterClose={callbackMap?.afterClose}
      afterOpen={callbackMap?.afterOpen}
      footer={slotsElements.footer}
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    >
      {slotsElements.content}
    </BaseModal>
  );
};

const exampleProperties: Static<typeof ModalPropsSchema> = {
  className: "",
  title: "Modal title",
  mask: true,
  simple: false,
  okText: "确定",
  cancelText: "取消",
  closable: true,
  maskClosable: true,
  confirmLoading: false,
};
export const Modal = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    name: "Modal",
    displayName: "Modal",
  },
  spec: {
    properties: ModalPropsSchema,
    state: ModalStateSchema,
    methods: {
      setVisible: Type.Object({
        visible: Type.String(),
      }),
    },
    slots: ["title", "content", "footer"],
    styleSlots: ["content"],
    events: ["afterOpen", "afterClose", "onCancel", "onOk"],
  },
})(ModalImpl);
