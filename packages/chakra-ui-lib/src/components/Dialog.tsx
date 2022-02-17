import { useEffect, useState, useRef } from 'react';
import { implementRuntimeComponent, DIALOG_CONTAINER_ID } from '@sunmao-ui/runtime';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ModalContentProps,
  ModalOverlayProps,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { getColorSchemePropertySchema } from './Types/ColorScheme';
import { BASIC, BEHAVIOR } from './constants/category';

const getHandleButtonPropertySchema = (options?: Record<string, any>) =>
  Type.Object(
    {
      text: Type.String({
        title: 'Text',
      }),
      colorScheme: getColorSchemePropertySchema({
        title: 'Color Scheme',
      }),
    },
    options
  );

const PropsSchema = Type.Object({
  title: Type.String({
    title: 'Title',
    category: BASIC,
  }),
  confirmButton: getHandleButtonPropertySchema({
    title: 'Confirm Button',
    category: BASIC,
  }),
  cancelButton: getHandleButtonPropertySchema({
    title: 'Cancel Button',
    category: BASIC,
  }),
  disableConfirm: Type.Boolean({
    title: 'Disable Confirm',
    category: BEHAVIOR,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'dialog',
    displayName: 'Dialog',
    description: 'chakra_ui dialog',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {
      title: 'Dialog',
      confirmButton: 'Confirm',
      cancelButton: 'Cancel',
      disableConfirm: false,
    },
    exampleSize: [6, 6],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSchema,
    state: Type.Object({}),
    methods: {
      openDialog: Type.Object({
        title: Type.String(),
      }),
      confirmDialog: undefined,
      cancelDialog: undefined,
    },
    slots: ['content'],
    styleSlots: ['content'],
    events: ['cancelDialog', 'confirmDialog'],
  },
})(
  ({
    slotsElements,
    subscribeMethods,
    callbackMap: callbacks,
    title: customerTitle,
    disableConfirm,
    confirmButton = {
      text: 'confirm',
      colorScheme: 'red',
    },
    cancelButton = {
      text: 'cancel',
      colorScheme: 'blue',
    },
    customStyle,
    elementRef,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(customerTitle || '');
    const cancelRef = useRef(null);
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      containerRef.current = document.getElementById(DIALOG_CONTAINER_ID);
    }, [containerRef]);

    useEffect(() => {
      subscribeMethods({
        openDialog({ title }) {
          setIsOpen(true);
          setTitle(title);
        },
        confirmDialog() {
          setIsOpen(false);
        },
        cancelDialog() {
          setIsOpen(false);
        },
      });
    }, [subscribeMethods]);

    const dialogContentProps: ModalContentProps = {
      position: 'absolute',
      width: 'full',
      containerProps: { position: 'absolute', width: 'full', height: 'full' },
    };

    const dialogOverlayProps: ModalOverlayProps = {
      position: 'absolute',
      width: 'full',
      height: 'full',
    };

    const portalProps = {
      appendToParentPortal: true,
      containerRef,
    };

    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
        trapFocus={false}
        portalProps={containerRef.current ? portalProps : undefined}
        blockScrollOnMount={false}
      >
        <AlertDialogOverlay {...(containerRef.current ? dialogOverlayProps : {})}>
          <AlertDialogContent
            className={`${customStyle?.content}`}
            {...(containerRef.current ? dialogContentProps : {})}
            ref={elementRef}
          >
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogBody>{slotsElements.content}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                colorScheme={cancelButton.colorScheme}
                onClick={callbacks?.cancelDialog}
              >
                {cancelButton.text}
              </Button>
              <Button
                disabled={disableConfirm}
                colorScheme={confirmButton.colorScheme}
                onClick={callbacks?.confirmDialog}
                ml={3}
              >
                {confirmButton.text}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }
);
