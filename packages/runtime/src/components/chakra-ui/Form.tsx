import React, { useEffect, useMemo, useState } from 'react';
import { Type } from '@sinclair/typebox';
import { createComponent } from '@meta-ui/core';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { Button } from '@chakra-ui/react';
import { stateStore } from '../../store';
import { watch } from '@vue-reactivity/watch';

const FormImpl: ComponentImplementation<Record<string, string>> = ({
  mergeState,
  slotsMap,
  callbackMap,
}) => {
  const [validArray, setValidArray] = useState(() => {
    const inputsAmount = slotsMap?.get('content')?.length || 0;
    return Array(inputsAmount).fill(false);
  });

  // 理论上说slotsMap是永远不变的
  const formControlIds = useMemo<string[]>(() => {
    return (
      slotsMap?.get('content')?.map(slot => {
        return slot.id;
      }) || []
    );
  }, [slotsMap]);

  useEffect(() => {
    const stops: ReturnType<typeof watch>[] = [];
    formControlIds.forEach((fcId, i) => {
      const stop = watch(
        () => {
          const inputId = stateStore[fcId].inputId;
          const state = stateStore[inputId];
          return state.isValid;
        },
        newV => {
          setValidArray(oldValidArray => {
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
      <Button disabled={validArray.some(v => !v)} onClick={onSubmit}>
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
      methods: [],
    },
  }),
  impl: FormImpl,
};
