import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { Type, Static } from '@sinclair/typebox';
import { createComponent } from '@meta-ui/core';
import { Button, VStack } from '@chakra-ui/react';
import { watch } from '../../../utils/watchReactivity';
import { ComponentImplementation } from '../../../services/registry';
import Slot from '../../_internal/Slot';

const FormImpl: ComponentImplementation<Static<typeof PropsSchema>> = ({
  mergeState,
  subscribeMethods,
  hideSubmit,
  slotsMap,
  callbackMap,
  services,
}) => {
  const [invalidArray, setInvalidArray] = useState<boolean[]>([]);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  const formDataRef = useRef<Record<string, any>>({});
  const formControlIds = useMemo<string[]>(() => {
    return (
      slotsMap?.get('content')?.map(slot => {
        return slot.id;
      }) || []
    );
  }, [slotsMap]);

  useEffect(() => {
    setInvalidArray(
      formControlIds.map(fcid => {
        return services.stateManager.store[fcid].isInvalid;
      })
    );
  }, []);

  useEffect(() => {
    const disable = invalidArray.some(v => v);
    setIsFormInvalid(disable);
    mergeState({
      disableSubmit: disable,
    });
  }, [invalidArray]);

  useEffect(() => {
    subscribeMethods({
      resetForm() {
        formControlIds.forEach(fcId => {
          const inputId = services.stateManager.store[fcId].inputId;
          services.apiService.send('uiMethod', {
            componentId: inputId,
            name: 'resetInputValue',
          });
        });
      },
    });
  }, [formControlIds]);

  useEffect(() => {
    const stops: ReturnType<typeof watch>[] = [];
    formControlIds.forEach((fcId, i) => {
      // watch isInvalid
      let stop = watch(
        () => {
          return services.stateManager.store[fcId].isInvalid;
        },
        newV => {
          setInvalidArray(oldValidArray => {
            const newValidArray = [...oldValidArray];
            newValidArray[i] = newV;
            return newValidArray;
          });
        }
      );
      stops.push(stop);

      // watch value
      stop = watch(
        () => {
          return services.stateManager.store[fcId].value;
        },
        newV => {
          const fcState = services.stateManager.store[fcId];
          formDataRef.current[fcState.fieldName] = newV;
          mergeState({ data: { ...formDataRef.current } });
        }
      );
      stops.push(stop);
    });

    return () => {
      stops.forEach(s => {
        s();
      });
    };
  }, [formControlIds]);

  const onSubmit = () => {
    callbackMap?.onSubmit();
  };

  const style = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: var(--chakra-space-4);
    background: white;
    border: 1px solid var(--chakra-colors-gray-200);
    border-radius: 4px;
  `;

  return (
    <VStack css={style} spacing="5">
      <Slot slotsMap={slotsMap} slot="content" />
      {hideSubmit ? undefined : (
        <Button
          marginInlineStart="auto !important"
          disabled={isFormInvalid}
          onClick={onSubmit}
        >
          提交
        </Button>
      )}
    </VStack>
  );
};

const PropsSchema = Type.Object({
  hideSubmit: Type.Boolean(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'form',
      displayName: 'Form',
      description: 'chakra-ui form',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        hideSubmit: false,
      },
      exampleSize: [4, 6],
    },
    spec: {
      properties: PropsSchema,
      state: Type.Object({
        data: Type.Any(),
        disableSubmit: Type.Boolean(),
      }),
      methods: [
        {
          name: 'resetForm',
        },
      ],
      slots: ['content'],
      styleSlots: [],
      events: ['onSubmit'],
    },
  }),
  impl: FormImpl,
};
