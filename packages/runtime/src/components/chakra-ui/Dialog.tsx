import { useEffect, useState, useRef } from 'react';
import { createComponent } from '@sunmao-ui/core';
import { ComponentImplementation } from 'services/registry';
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
import { Static, Type } from '@sinclair/typebox';
import Slot from '../_internal/Slot';
import { ColorSchemePropertySchema } from './Types/ColorScheme';
import { DIALOG_CONTAINER_ID } from '../../constants';

const HandleButtonPropertySchema = Type.Object({
  text: Type.Optional(Type.String()),
  colorScheme: ColorSchemePropertySchema,
});

const Dialog: ComponentImplementation<Static<typeof PropsSchema>> = ({
  slotsMap,
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
  }, []);

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
      css={`
        ${customStyle?.content}
      `}
    >
      <AlertDialogOverlay {...(containerRef.current ? dialogOverlayProps : {})}>
        <AlertDialogContent {...(containerRef.current ? dialogContentProps : {})}>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogBody>
            <Slot slotsMap={slotsMap} slot="content" />
          </AlertDialogBody>

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
};

const PropsSchema = Type.Object({
  title: Type.Optional(Type.String()),
  confirmButton: HandleButtonPropertySchema,
  cancelButton: HandleButtonPropertySchema,
  disableConfirm: Type.Optional(Type.Boolean()),
});

export default {
  ...createComponent({
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
    },
    spec: {
      properties: PropsSchema,
      state: {},
      methods: [
        {
          name: 'openDialog',
          parameters: Type.Object({
            title: Type.String(),
          }),
        },
        {
          name: 'confirmDialog',
        },
        {
          name: 'cancelDialog',
        },
      ],
      slots: ['content'],
      styleSlots: ['content'],
      events: ['cancelDialog', 'confirmDialog'],
    },
  }),
  impl: Dialog,
};
