import { Modal as BaseModal, ConfigProvider } from '@arco-design/web-react';
import { DIALOG_CONTAINER_ID, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { ModalPropsSpec as BaseModalPropsSpec } from '../generated/types/Modal';
import { useEffect, useRef, useState } from 'react';

const ModalPropsSpec = Type.Object(BaseModalPropsSpec);
const ModalStateSpec = Type.Object({});

const exampleProperties: Static<typeof ModalPropsSpec> = {
  title: 'Modal title',
  mask: true,
  simple: false,
  okText: 'confirm',
  cancelText: 'cancel',
  closable: true,
  maskClosable: true,
  confirmLoading: false,
  defaultOpen: true,
  unmountOnExit: true,
  hideFooter: false,
};
export const Modal = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    exampleProperties,
    name: 'modal',
    displayName: 'Modal',
    annotations: {
      category: 'Feedback',
    },
  },
  spec: {
    properties: ModalPropsSpec,
    state: ModalStateSpec,
    methods: {
      openModal: Type.Object({}),
      closeModal: Type.Object({}),
    },
    slots: {
      content: { slotProps: Type.Object({}) },
      footer: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: ['afterOpen', 'afterClose', 'onCancel', 'onOk'],
  },
})(props => {
  const { getElement, subscribeMethods, slotsElements, customStyle, callbackMap } = props;
  const { title, defaultOpen, hideFooter, ...cProps } = getComponentProps(props);
  const [visible, setVisible] = useState(defaultOpen);
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
        footer={hideFooter ? null : slotsElements?.footer?.({})}
        className={css(customStyle?.content)}
        mountOnEnter={true}
        {...cProps}
      >
        <div ref={contentRef}>
          {slotsElements.content ? slotsElements.content({}) : null}
        </div>
      </BaseModal>
    </ConfigProvider>
  );
});
