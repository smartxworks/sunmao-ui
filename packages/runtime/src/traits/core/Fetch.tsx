import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';
import {
  FetchTraitPropertiesSchema,
  EventHandlerSchema,
} from '../../types/traitPropertiesSchema';
import { generateCallback } from './Event';

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
      onComplete,
      onError,
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
            code: undefined,
            codeText: '',
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
          body: method === 'get' ? undefined : reqBody,
        }).then(
          async response => {
            const isResponseJSON = response.headers
              .get('Content-Type')
              ?.includes('application/json');

            if (response.ok) {
              // handle 20x/30x
              let data: any;
              if (isResponseJSON) {
                data = await response.json();
              } else {
                data = await response.text();
              }
              mergeState({
                fetch: {
                  code: response.status,
                  codeText: response.statusText || 'ok',
                  loading: false,
                  data,
                  error: undefined,
                },
              });
              const rawOnComplete = trait.properties.onComplete as Static<
                typeof FetchTraitPropertiesSchema
              >['onComplete'];
              rawOnComplete?.forEach((rawHandler, index) => {
                generateCallback(
                  onComplete![index],
                  rawHandler as Static<typeof EventHandlerSchema>,
                  services
                )();
              });
            } else {
              // TODO: Add FetchError class and remove console info
              const error = await (isResponseJSON ? response.json() : response.text());
              console.warn(error);
              mergeState({
                fetch: {
                  code: response.status,
                  codeText: response.statusText || 'error',
                  loading: false,
                  data: undefined,
                  error,
                },
              });
              const rawOnError = trait.properties.onError as Static<
                typeof FetchTraitPropertiesSchema
              >['onError'];
              rawOnError?.forEach((rawHandler, index) => {
                generateCallback(
                  onError![index],
                  rawHandler as Static<typeof EventHandlerSchema>,
                  services
                )();
              });
            }
          },

          async error => {
            console.warn(error);
            mergeState({
              fetch: {
                code: undefined,
                codeText: 'Error',
                loading: false,
                data: undefined,
                error: error.toString(),
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
          code: Type.Optional(Type.Number()),
          codeText: Type.String(),
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
