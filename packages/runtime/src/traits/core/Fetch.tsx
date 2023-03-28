import { Type } from '@sinclair/typebox';
import {
  consoleWarn,
  ConsoleType,
  EventCallBackHandlerSpec,
  CoreTraitName,
  CORE_VERSION,
  CoreWidgetName,
} from '@sunmao-ui/shared';
import { runEventHandler } from '../../utils/runEventHandler';
import { implementRuntimeTrait } from '../../utils/buildKit';

const FETCH_ONCOMPLETE_STATE = 'fetch onComplete';
const FETCH_ONERROR_STATE = 'fetch onError';
export const FetchTraitPropertiesSpec = Type.Object(
  {
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
    body: Type.Record(Type.String(), Type.Any(), {
      title: 'Body',
      widget: `${CORE_VERSION}/${CoreWidgetName.RecordField}`,
    }),
    bodyType: Type.KeyOf(
      Type.Object({
        json: Type.String(),
        formData: Type.String(),
        raw: Type.String(),
      }),
      { title: 'Body Type' }
    ),
    onComplete: Type.Array(EventCallBackHandlerSpec),
    onError: Type.Array(EventCallBackHandlerSpec),
  },
  {
    widget: 'core/v1/fetch',
    widgetOptions: {
      isDisplayLabel: false,
    },
  }
);

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Fetch,
    description: 'fetch data to store',
    isDataSource: true,
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
      {
        name: 'clear',
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
    slotKey,
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
          ...(services.stateManager.store[componentId]?.fetch || {}),
          code: undefined,
          codeText: '',
          loading: true,
          error: undefined,
        },
      });

      let reqBody: string | FormData = '';

      switch (bodyType) {
        case 'raw':
          reqBody = body.value || '';
          break;
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
        method: method.toUpperCase(),
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
            const rawOnComplete = trait.properties.onComplete;

            onComplete?.forEach((_, index) => {
              runEventHandler(
                onComplete[index],
                rawOnComplete,
                index,
                services,
                slotKey,
                componentId,
                FETCH_ONCOMPLETE_STATE
              )();
            });
          } else {
            // TODO: Add FetchError class and remove console info
            const error = await (isResponseJSON ? response.json() : response.text());
            mergeState({
              fetch: {
                code: response.status,
                codeText: response.statusText || 'error',
                loading: false,
                data: undefined,
                error,
              },
            });
            const rawOnError = trait.properties.onError;

            onError?.forEach((_, index) => {
              runEventHandler(
                onError[index],
                rawOnError,
                index,
                services,
                slotKey,
                componentId,
                FETCH_ONERROR_STATE
              )();
            });
          }
        },

        async error => {
          consoleWarn(ConsoleType.Trait, CoreTraitName.Fetch, error);
          mergeState({
            fetch: {
              code: undefined,
              codeText: 'Error',
              loading: false,
              data: undefined,
              error: error.toString(),
            },
          });
          const rawOnError = trait.properties.onError;

          onError?.forEach((_, index) => {
            runEventHandler(
              onError[index],
              rawOnError,
              index,
              services,
              slotKey,
              componentId
            )();
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
      clear() {
        mergeState({
          fetch: {
            code: undefined,
            codeText: '',
            loading: false,
            data: undefined,
            error: undefined,
          },
        });
      },
    });

    return {
      props: {},
    };
  };
});
