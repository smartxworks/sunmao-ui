/**
 * The slot receiver is a magic hole of sunmao's runtime.
 * In sunmao, we support pass props and fallback elements to a slot.
 * But if we pass them as React component's props,
 * it will cause re-render since most of them could not use a shallow equal checker.
 *
 * Also, in sunmao's runtime, we are not using a traditional React render mechanism.
 * Instead, we keep most of the components not be rendered and only subscribe to related state updates.
 *
 * To continue with our design,
 * we need a way to render slot's fallback elements without passing the elements as props.
 * This is where the slot receiver comes.
 * It contains a map and an event emitter, when a slot need render,
 * it will attach the fallback elements to the map and send a signal via the emitter.
 * When the Receiver component receive a signal, it will force render the fallback elements.
 */
import React, { useEffect, useState, useRef } from 'react';
import mitt from 'mitt';

export class SlotReceiver {
  fallbacks: Partial<Record<string, React.ReactNode>> = {};
  emitter = mitt<Record<string, React.ReactNode>>();

  constructor() {
    this.emitter.on('*', (slotKey: string, c: React.ReactNode) => {
      this.fallbacks[slotKey] = c;
    });
  }
}

export function initSlotReceiver() {
  return new SlotReceiver();
}

export const Receiver: React.FC<{ slotKey?: string; slotReceiver: SlotReceiver }> = ({
  slotKey = '',
  slotReceiver,
}) => {
  const [, setForce] = useState(0);
  const cRef = useRef<React.ReactNode>(slotReceiver.fallbacks[slotKey] || null);
  useEffect(() => {
    if (!slotKey) {
      return;
    }
    const handler = (c: React.ReactNode) => {
      if (slotReceiver.fallbacks[slotKey]) {
        // release memory
        slotReceiver.fallbacks[slotKey] = null;
      }
      cRef.current = c;
      /**
       * the event emitter fired during render process
       * defer the setState to avoid React warning
       */
      setTimeout(() => {
        setForce(prev => prev + 1);
      }, 0);
    };
    slotReceiver.emitter.on(slotKey, handler);
    return () => {
      slotReceiver.emitter.off(slotKey, handler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotKey]);
  return <>{cRef.current}</>;
};
