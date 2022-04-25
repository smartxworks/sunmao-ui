import { Static, Type } from '@sinclair/typebox';
import {
  EventHandlerSpec,
  EventCallBackHandlerSpec,
  FETCH_TRAIT_NAME,
  CORE_VERSION,
  RECORD_FIELD_WIDGET_NAME,
} from '@sunmao-ui/shared';
import { generateCallback } from './Event';
import { implementRuntimeTrait } from '../../utils/buildKit';

export const FetchTraitPropertiesSpec = Type.Object({
  url: Type.String({ title: 'URL' }), // {format:uri}?;
  method: Type.KeyOf(
    Type.Object({
      get: Type.String(),
      post: Type.String(),
      put: Type.String(),
      delete: Type.String(),
      patch: Type.String(),
    }),
    { title: 'Method' }
  ), // {pattern: /^(get|post|put|delete)$/i}
  lazy: Type.Boolean({ title: 'Lazy' }),
  disabled: Type.Boolean({ title: 'Disabled' }),
  headers: Type.Record(Type.String(), Type.String(), {
    title: 'Headers',
  }),
  body: Type.Record(Type.String(), Type.String(), {
    title: 'Body',
    widget: `${CORE_VERSION}/${RECORD_FIELD_WIDGET_NAME}`,
  }),
  bodyType: Type.KeyOf(
    Type.Object({
      json: Type.String(),
      formData: Type.String(),
    }),
    { title: 'Body Type' }
  ),
  onComplete: Type.Array(EventCallBackHandlerSpec),
  onError: Type.Array(EventCallBackHandlerSpec),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: FETCH_TRAIT_NAME,
    description: 'fetch data to store',
  },
  spec: {
    properties: FetchTraitPropertiesSpec,
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
})(() => {
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
    disabled,
  }) => {
    const lazy = _lazy === undefined ? true : _lazy;

    const fetchData = () => {
      if (disabled) return;
      // TODO: clear when component destroy
      // FIXME: listen to the header change
      const headers = new Headers();
      if (_headers) {
        for (const key in _headers) {
          headers.append(key, _headers[key]);
        }
      }

      mergeState({
        fetch: {
          ...(services.stateManager.store[componentId].fetch || {}),
          code: undefined,
          codeText: '',
          loading: true,
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
              typeof FetchTraitPropertiesSpec
            >['onComplete'];
            rawOnComplete?.forEach((rawHandler, index) => {
              generateCallback(
                onComplete![index],
                rawHandler as Static<typeof EventHandlerSpec>,
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
              typeof FetchTraitPropertiesSpec
            >['onError'];
            rawOnError?.forEach((rawHandler, index) => {
              generateCallback(
                onError![index],
                rawHandler as Static<typeof EventHandlerSpec>,
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
            typeof FetchTraitPropertiesSpec
          >['onError'];
          rawOnError?.forEach(handler => {
            const evaledHandler = services.stateManager.deepEval(handler, {
              evalListItem: false,
            });
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
    if (!lazy && url) {
      fetchData();
    }

    subscribeMethods({
      triggerFetch() {
        fetchData();
      },
    });

      return {
        props: {},
      };
    };
});
