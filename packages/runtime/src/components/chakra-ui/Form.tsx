import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Type } from '@sinclair/typebox';
import { createComponent } from '@meta-ui/core';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { Button } from '@chakra-ui/react';
import { stateStore } from '../../store';
import { watch } from '@vue-reactivity/watch';
import { apiService } from '../../api-service';

const FormImpl: ComponentImplementation<{
  hideSubmit?: boolean;
}> = ({ mergeState, subscribeMethods, hideSubmit, slotsMap, callbackMap }) => {
  // 理论上说slotsMap是永远不变的
  const formControlIds = useMemo<string[]>(() => {
    return (
      slotsMap?.get('content')?.map(slot => {
        return slot.id;
      }) || []
    );
  }, [slotsMap]);

  const [invalidArray, setInvalidArray] = useState<boolean[]>([]);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    setInvalidArray(
      formControlIds.map(fcid => {
        return stateStore[fcid].isInvalid;
      })
    );
  }, []);

  useEffect(() => {
    const disable = invalidArray.some(v => v);
    setDisableSubmit(disable);
    mergeState({
      disableSubmit: disable,
    });
  }, [invalidArray]);

  useEffect(() => {
    subscribeMethods({
      resetForm() {
        formControlIds.forEach(fcId => {
          const inputId = stateStore[fcId].inputId;
          apiService.send('uiMethod', {
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
          return stateStore[fcId].isInvalid;
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
          return stateStore[fcId].value;
        },
        newV => {
          const fcState = stateStore[fcId];
          dataRef.current[fcState.fieldName] = newV;
          mergeState({ data: { ...dataRef.current } });
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

  return (
    <form>
      <Slot slotsMap={slotsMap} slot="content" />
      {hideSubmit ? undefined : (
        <Button disabled={disableSubmit} onClick={onSubmit}>
          提交
        </Button>
      )}
    </form>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'form',
      description: 'chakra-ui form',
    },
    spec: {
      properties: [
        {
          name: 'hideSubmit',
          ...Type.Boolean(),
        },
      ],
      acceptTraits: [],
      state: Type.Object({
        data: Type.Any(),
        disableSubmit: Type.Boolean(),
      }),
      methods: [
        {
          name: 'resetForm',
        },
      ],
    },
  }),
  impl: FormImpl,
};
