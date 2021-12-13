import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../types/RuntimeSchema';
import { FetchTraitPropertiesSchema } from '../../types/TraitPropertiesSchema';

const hasFetchedMap = new Map<string, boolean>();

const useFetchTrait: TraitImplementation<Static<typeof FetchTraitPropertiesSchema>> = ({
  url,
  method,
  lazy: _lazy,
  headers: _headers,
  body,
  mergeState,
  services,
  subscribeMethods,
  componentId,
  onComplete,
}) => {
  const hashId = `#${componentId}@${'fetch'}`;
  const hasFetched = hasFetchedMap.get(hashId);
  const lazy = _lazy === undefined ? true : _lazy;

  const fetchData = () => {
    // TODO: clear when component destory
    hasFetchedMap.set(hashId, true);
    // FIXME: listen to the header change
    const headers = new Headers();
    if (_headers) {
      for (const key in _headers) {
        headers.append(key, _headers[key]);
      }
    }

    mergeState({
      fetch: {
        loading: true,
        data: undefined,
        error: undefined,
      },
    });

    // fetch data
    fetch(url, {
      method,
      headers,
      body: method === 'get' ? undefined : JSON.stringify(body),
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
            services.apiService.send('uiMethod', {
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

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'fetch',
      description: 'fetch data to store',
    },
    spec: {
      properties: FetchTraitPropertiesSchema,
      state: Type.Object({
        fetch: Type.Object({
          loading: Type.Boolean(),
          data: Type.Any(),
          error: Type.Any(),
        }),
      }),
      methods: [
        {
          name: 'triggerFetch',
        },
      ],
    },
  }),
  impl: useFetchTrait,
};
