import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { Button, VStack } from '@chakra-ui/react';
import { implementRuntimeComponent, watch } from '@sunmao-ui/runtime';

const PropsSchema = Type.Object({
  hideSubmit: Type.Boolean(),
});

export default implementRuntimeComponent({
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
    methods: {
      resetForm: void 0,
    },
    slots: ['content'],
    styleSlots: ['content'],
    events: ['onSubmit'],
  },
})(
  ({
    mergeState,
    subscribeMethods,
    hideSubmit,
    callbackMap,
    services,
    customStyle,
    Slot,
    treeMap,
    component
  }) => {
    const [invalidArray, setInvalidArray] = useState<boolean[]>([]);
    const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
    const formDataRef = useRef<Record<string, any>>({});
    const formControlIds = useMemo<string[]>(() => {
      return (
        treeMap[component.id]?.content.map(slot => {
          return slot.id;
        }) || []
      );
    }, [component.id, treeMap]);

    useEffect(() => {
      setInvalidArray(
        formControlIds.map(fcid => {
          return services.stateManager.store[fcid].isInvalid;
        })
      );
    }, [formControlIds, services.stateManager.store]);

    useEffect(() => {
      const disable = invalidArray.some(v => v);
      setIsFormInvalid(disable);
      mergeState({
        disableSubmit: disable,
      });
    }, [invalidArray, mergeState]);

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
    }, [
      formControlIds,
      services.apiService,
      services.stateManager.store,
      subscribeMethods,
    ]);

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
    }, [formControlIds, mergeState, services.stateManager.store]);

    const onSubmit = () => {
      callbackMap?.onSubmit();
    };

    return (
      <VStack
        width="full"
        height="full"
        padding="4"
        background="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="4"
        spacing="5"
        className={css`
          ${customStyle?.content}
        `}
      >
        <Slot slot="content" />
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
  }
);
