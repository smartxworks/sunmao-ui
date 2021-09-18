import React, { useEffect, useState, useRef } from 'react';
import { createComponent } from '@meta-ui/core';
import { ComponentImplementation } from '../../registry';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { Static, Type } from '@sinclair/typebox';
import Slot from '../_internal/Slot';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const TitlePropertySchema = Type.Optional(Type.String());
const DisableConfirmPropertySchema = Type.Optional(Type.Boolean());

const HandleButtonPropertySchema = Type.Object({
  text: Type.Optional(Type.String()),
  colorScheme: ColorSchemePropertySchema,
});

const Dialog: ComponentImplementation<{
  title?: Static<typeof TitlePropertySchema>;
  confirmButton?: Static<typeof HandleButtonPropertySchema>;
  cancelButton?: Static<typeof HandleButtonPropertySchema>;
  disableConfirm?: Static<typeof DisableConfirmPropertySchema>;
}> = ({
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(customerTitle || '');
  const cancelRef = useRef(null);

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

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{title}</AlertDialogHeader>

            <AlertDialogBody>
              <Slot slotsMap={slotsMap} slot="content" />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                colorScheme={cancelButton.colorScheme}
                onClick={callbacks?.cancelDialog}>
                {cancelButton.text}
              </Button>
              <Button
                disabled={disableConfirm}
                colorScheme={confirmButton.colorScheme}
                onClick={callbacks?.confirmDialog}
                ml={3}>
                {confirmButton.text}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'dialog',
      description: 'chakra_ui dialog',
    },
    spec: {
      properties: [
        {
          name: 'title',
          ...TitlePropertySchema,
        },
        {
          name: 'confirmButton',
          ...HandleButtonPropertySchema,
        },
        {
          name: 'cancelButton',
          ...HandleButtonPropertySchema,
        },
        {
          name: 'disableConfirm',
          ...DisableConfirmPropertySchema,
        },
      ],
      acceptTraits: [],
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
    },
  }),
  impl: Dialog,
};
