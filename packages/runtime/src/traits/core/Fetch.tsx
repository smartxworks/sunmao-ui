import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';
import { FetchTraitPropertiesSchema } from '../../types/traitPropertiesSchema';

const FetchTraitFactory: TraitImplFactory<Static<typeof FetchTraitPropertiesSchema>> =
  () => {
    const hasFetchedMap = new Map<string, boolean>();
    return ({
      trait,
      url,
      method,
      lazy: _lazy,
      headers: _headers,
      body,
      bodyType,
      mergeState,
      services,
      subscribeMethods,
      componentId,
    }) => {
      const hashId = `#${componentId}@${'fetch'}`;
      const hasFetched = hasFetchedMap.get(hashId);
      const lazy = _lazy === undefined ? true : _lazy;

      const fetchData = () => {
        // TODO: clear when component destroy
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

        let reqBody: string | FormData = '';

        switch (bodyType) {
          case 'json':
            reqBody = JSON.stringify(body);
            break;
          case 'formData':
            reqBody = new FormData();
            for (const key in body) {
              reqBody.append(key, body[key]);
            }
            break;
        }

        // fetch data
        fetch(url, {
          method,
          headers,
          body: reqBody,
        }).then(
          async response => {
            if (response.ok) {
              // handle 20x/30x
              let data: any;
              if (response.headers.get('Content-Type') === 'application/json') {
                data = await response.json();
              } else {
                data = await response.text();
              }
              mergeState({
                fetch: {
                  loading: false,
                  data,
                  error: undefined,
                },
              });
              const rawOnComplete = trait.properties.onComplete as Static<
                typeof FetchTraitPropertiesSchema
              >['onComplete'];
              rawOnComplete?.forEach(handler => {
                const evaledHandler = services.stateManager.deepEval(handler, false);
                services.apiService.send('uiMethod', {
                  componentId: evaledHandler.componentId,
                  name: evaledHandler.method.name,
                  parameters: evaledHandler.method.parameters,
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
              const rawOnError = trait.properties.onError as Static<
                typeof FetchTraitPropertiesSchema
              >['onError'];
              rawOnError?.forEach(handler => {
                const evaledHandler = services.stateManager.deepEval(handler, false);
                services.apiService.send('uiMethod', {
                  componentId: evaledHandler.componentId,
                  name: evaledHandler.method.name,
                  parameters: evaledHandler.method.parameters,
                });
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
            const rawOnError = trait.properties.onError as Static<
              typeof FetchTraitPropertiesSchema
            >['onError'];
            rawOnError?.forEach(handler => {
              const evaledHandler = services.stateManager.deepEval(handler, false);
              services.apiService.send('uiMethod', {
                componentId: evaledHandler.componentId,
                name: evaledHandler.method.name,
                parameters: evaledHandler.method.parameters,
              });
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
  factory: FetchTraitFactory,
};
