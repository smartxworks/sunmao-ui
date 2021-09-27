import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../modules/registry';
import { CallMethodSchema } from '../../types/CallMethodSchema';

const hasFetchedMap = new Map<string, boolean>();

const useFetchTrait: TraitImplementation<Static<typeof PropsSchema>> = ({
  url,
  method,
  lazy: _lazy,
  headers: _headers,
  body,
  mergeState,
  mModules,
  subscribeMethods,
  componentId,
  onComplete,
}) => {
  const hashId = `#${componentId}@${'fetch'}`;
  const hasFetched = hasFetchedMap.get(hashId);
  const lazy = undefined ? method.toLowerCase() !== 'get' : _lazy;

  const fetchData = () => {
    // TODO: clear when component destory
    hasFetchedMap.set(hashId, true);
    // FIXME: listen to the header change
    const headers = new Headers();
    if (_headers) {
      for (let i = 0; i < _headers.length; i++) {
        const header = _headers[i];
        headers.append(header.key, _headers[i].value);
      }
    }

    // fetch data
    fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    }).then(
      async response => {
        if (response.ok) {
          // handle 20x/30x
          const data = await response.json();
          mergeState({
            fetch: {
              loading: false,
              data,
              error: undefined,
            },
          });
          onComplete?.forEach(event => {
            mModules.apiService.send('uiMethod', {
              componentId: event.componentId,
              name: event.method.name,
              parameters: event.method.parameters,
            });
          });
        } else {
          // TODO: Add FetchError class and remove console info
          const error = new Error(`HTTP${response.status}: ${response.statusText}`);
          console.warn(error);
          mergeState({
            fetch: {
              loading: false,
              data: undefined,
              error,
            },
          });
        }
      },
      async error => {
        console.warn(error);
        mergeState({
          fetch: {
            loading: false,
            data: undefined,
            error: error instanceof Error ? error : new Error(error),
          },
        });
      }
    );
  };

  // non lazy query, listen to the change and query;
  if (!lazy && url && !hasFetched) {
    fetchData();
  }

  subscribeMethods({
    triggerFetch() {
      fetchData();
    },
  });

  return {
    props: {
      effects: [
        () => {
          hasFetchedMap.set(hashId, false);
        },
      ],
    },
  };
};

const PropsSchema = Type.Object({
  url: Type.String(), // {format:uri}?;
  method: Type.String(), // {pattern: /^(get|post|put|delete)$/i}
  lazy: Type.Boolean(),
  headers: Type.Array(Type.Object({ key: Type.String(), value: Type.String() })),
  body: Type.Any(),
  onComplete: Type.Array(CallMethodSchema),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'fetch',
      description: 'fetch data to store',
    },
    spec: {
      properties: PropsSchema,
      state: Type.Object({
        fetch: Type.Object({
          loading: Type.Boolean(),
          data: Type.Any(),
          error: Type.Any(),
        }),
      }),
      methods: [],
    },
  }),
  impl: useFetchTrait,
};
