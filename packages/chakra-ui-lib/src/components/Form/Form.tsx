import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { Button, VStack } from '@chakra-ui/react';
import { implementRuntimeComponent, watch } from '@sunmao-ui/runtime';
import { BEHAVIOR } from '../constants/category';

const PropsSpec = Type.Object({
  hideSubmit: Type.Boolean({
    title: 'Hide Submit',
    category: BEHAVIOR,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'form',
    displayName: 'Form',
    description: 'chakra-ui form',
    exampleProperties: {
      hideSubmit: false,
    },
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({
      data: Type.Any(),
      disableSubmit: Type.Boolean(),
    }),
    methods: {
      resetForm: undefined,
    },
    slots: {
      content: { slotProps: Type.Object({}) },
    },
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
    slotsElements,
    childrenMap,
    component,
    elementRef,
  }) => {
    const [invalidArray, setInvalidArray] = useState<boolean[]>([]);
    const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
    const formDataRef = useRef<Record<string, any>>({});
    const formControlIds = useMemo<string[]>(() => {
      return (
        childrenMap[component.id]?.content.map(slot => {
          return slot.id;
        }) || []
      );
    }, [component.id, childrenMap]);

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
              triggerId: component.id,
              eventType: 'resetForm',
            });
          });
        },
      });
    }, [
      component.id,
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
        ref={elementRef}
      >
        {slotsElements.content ? slotsElements.content({}) : null}
        {hideSubmit ? undefined : (
          <Button
            marginInlineStart="auto !important"
            disabled={isFormInvalid}
            onClick={onSubmit}
          >
            Submit
          </Button>
        )}
      </VStack>
    );
  }
);
