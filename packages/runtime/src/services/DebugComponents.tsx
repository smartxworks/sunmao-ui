import React, { useEffect, useState } from 'react';
import { StateManagerInterface } from './StateManager';
import { ApiService } from './apiService';
import { watch } from '../utils/watchReactivity';
import copy from 'copy-to-clipboard';

export const DebugStore: React.FC<{ stateManager: StateManagerInterface }> = ({
  stateManager,
}) => {
  const [store, setStore] = useState(stateManager.store);
  useEffect(() => {
    setStore({ ...stateManager.store });
    watch(stateManager.store, newValue => {
      setTimeout(() => {
        setStore({ ...newValue });
      }, 0);
    });
  }, []);

  return <pre>{JSON.stringify(store, null, 2)}</pre>;
};

export const DebugEvent: React.FC<{ apiService: ApiService }> = ({ apiService }) => {
  const [events, setEvents] = useState<unknown[]>([]);

  useEffect(() => {
    const handler = (type: string, event: unknown) => {
      setEvents(cur => cur.concat({ type, event, t: new Date() }));
    };
    apiService.on('*', handler);
    return () => apiService.off('*', handler);
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            copy(JSON.stringify(events));
          }}
        >
          copy test case
        </button>
      </div>
      <div
        style={{
          padding: '0.5em',
          border: '2px solid black',
          maxHeight: '200px',
          overflow: 'auto',
        }}
      >
        {events.map((event, idx) => (
          <pre key={idx}>{JSON.stringify(event)}</pre>
        ))}
      </div>
    </div>
  );
};
