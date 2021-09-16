import React, { useEffect, useMemo, useState } from 'react';
import { Type } from '@sinclair/typebox';
import { createComponent } from '@meta-ui/core';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { Button } from '@chakra-ui/react';
import { stateStore } from '../../store';
import { watch } from '@vue-reactivity/watch';
import { apiService } from '../../api-service';

const FormImpl: ComponentImplementation<Record<string, string>> = ({
  mergeState,
  subscribeMethods,
  slotsMap,
  callbackMap,
}) => {
  // 理论上说slotsMap是永远不变的
  const formControlIds = useMemo<string[]>(() => {
    return (
      slotsMap?.get('content')?.map(slot => {
        return slot.id;
      }) || []
    );
  }, [slotsMap]);

  const [invalidArray, setInvalidArray] = useState<boolean[]>([]);

  useEffect(() => {
    setInvalidArray(
      formControlIds.map(fcid => {
        console.log('stateStore[fcid]', stateStore[fcid].isInvalid);
        return stateStore[fcid].isInvalid;
      })
    );
  }, []);

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
      const stop = watch(
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
    });

    return () => {
      stops.forEach(s => {
        s();
      });
    };
  }, []);

  const onSubmit = () => {
    const data: Record<string, string> = {};
    formControlIds.forEach(fcId => {
      const fcState = stateStore[fcId];
      const fieldName = fcState.fieldName;
      data[fieldName] = stateStore[fcState.inputId].value;
    });
    mergeState({
      data,
    });
    callbackMap?.onSubmit();
  };

  return (
    <form>
      <Slot slotsMap={slotsMap} slot="content" />
      <Button disabled={invalidArray.some(v => v)} onClick={onSubmit}>
        提交
      </Button>
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
      properties: [],
      acceptTraits: [],
      state: Type.Object({
        data: Type.Any(),
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
