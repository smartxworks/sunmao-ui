import { Type, Static, TSchema } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName, StringUnion } from '@sunmao-ui/shared';

type ParseValidateOption<
  T extends Record<string, TSchema>,
  OptionalKeys extends keyof T = ''
> = {
  [K in keyof T as K extends OptionalKeys ? never : K]: Static<T[K]>;
} & {
  [K in OptionalKeys]?: Static<T[K]>;
};
type UnionToIntersection<TUnion> = (
  TUnion extends unknown ? (params: TUnion) => unknown : never
) extends (params: infer Params) => unknown
  ? Params
  : never;

const validateOptionMap = {
  length: {
    minLength: Type.Number({ title: 'Min length' }),
    maxLength: Type.Number({ title: 'Max length' }),
  },
  include: {
    includeList: Type.Array(Type.String(), { title: 'Include list' }),
  },
  exclude: {
    excludeList: Type.Array(Type.String(), { title: 'Exclude List' }),
  },
  number: {
    min: Type.Number({ title: 'Min' }),
    max: Type.Number({ title: 'Max' }),
  },
  regex: {
    regex: Type.String({ title: 'Regex', description: 'The regular expression string.' }),
    flags: Type.String({
      title: 'Flags',
      description: 'The flags of the regular expression.',
    }),
  },
};
const validateFnMap = {
  required(value: string) {
    return value !== undefined && value !== null && value !== '';
  },
  length(
    value: string,
    {
      minLength,
      maxLength,
    }: ParseValidateOption<typeof validateOptionMap['length'], 'minLength' | 'maxLength'>
  ) {
    if (minLength !== undefined && value.length < minLength) {
      return false;
    }

    if (maxLength !== undefined && value.length > maxLength) {
      return false;
    }

    return true;
  },
  include(
    value: string,
    { includeList }: ParseValidateOption<typeof validateOptionMap['include']>
  ) {
    return includeList.includes(value);
  },
  exclude(
    value: string,
    { excludeList }: ParseValidateOption<typeof validateOptionMap['exclude']>
  ) {
    return !excludeList.includes(value);
  },
  regex(
    value: string,
    { regex, flags }: ParseValidateOption<typeof validateOptionMap['regex'], 'flags'>
  ) {
    return new RegExp(regex, flags).test(value);
  },
  number(
    value: string | number,
    { min, max }: ParseValidateOption<typeof validateOptionMap['number'], 'min' | 'max'>
  ) {
    const num = Number(value);

    if (min !== undefined && num < min) {
      return false;
    }

    if (max !== undefined && num > max) {
      return false;
    }

    return true;
  },
  ipv4(value: string) {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value
    );
  },
  email(value: string) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
  },
  url(value: string) {
    return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
      value
    );
  },
};

type AllFields = UnionToIntersection<
  typeof validateOptionMap[keyof typeof validateOptionMap]
>;
type AllFieldsKeys = keyof UnionToIntersection<AllFields>;

const ValidatorSpec = Type.Object({
  name: Type.String({
    title: 'Name',
    description: 'The name is used for getting the validated result.',
  }),
  value: Type.Any({ title: 'Value', description: 'The value need to be validated.' }),
  rules: Type.Array(
    Type.Object(
      {
        type: StringUnion(
          Object.keys(validateFnMap).concat(['custom']) as [
            keyof typeof validateFnMap,
            'custom'
          ],
          {
            type: 'Type',
            description:
              'The type of the rule. Setting it as `custom` to use custom validate function.',
          }
        ),
        validate:
          Type.Any({
            title: 'Validate',
            description:
              'The validate function for the rule. Return `false` means it is invalid.',
            conditions: [
              {
                key: 'type',
                value: 'custom',
              },
            ],
          }) ||
          Type.Function(
            [Type.String(), Type.Record(Type.String(), Type.Any())],
            Type.Boolean(),
            {
              conditions: [
                {
                  key: 'type',
                  value: 'custom',
                },
              ],
            }
          ),
        error: Type.Object(
          {
            message: Type.String({
              title: 'Message',
              description: 'The message to display when the value is invalid.',
            }),
          },
          { title: 'Error' }
        ),
        ...(Object.keys(validateOptionMap) as [keyof typeof validateOptionMap]).reduce(
          (result, key) => {
            const option = validateOptionMap[key] as AllFields;

            (Object.keys(option) as [AllFieldsKeys]).forEach(optionKey => {
              if (result[optionKey]) {
                // if the different validate functions have the same parameter
                throw Error(
                  "[Validation Trait]: The different validate function has the same parameter, please change the parameter's name."
                );
              } else {
                result[optionKey] = {
                  ...option[optionKey],
                  conditions: [{ key: 'type', value: key }],
                } as any;
              }
            });

            return result;
          },
          {} as AllFields
        ),
        customOptions: Type.Record(Type.String(), Type.Any(), {
          title: 'Custom options',
          description:
            'The custom options would pass to the custom validate function as the second parameter.',
          conditions: [
            {
              key: 'type',
              value: 'custom',
            },
          ],
        }),
      },
      {
        title: 'Rules',
      }
    ),
    {
      title: 'Rules',
      widget: 'core/v1/array',
      widgetOptions: { displayedKeys: ['type'] },
    }
  ),
});

export const ValidationTraitPropertiesSpec = Type.Object({
  validators: Type.Array(ValidatorSpec, {
    title: 'Validators',
    widget: 'core/v1/array',
    widgetOptions: { displayedKeys: ['name'] },
  }),
});

const ErrorSpec = Type.Object({
  message: Type.String(),
});

const ValidatedResultSpec = Type.Record(
  Type.String(),
  Type.Object({
    isInvalid: Type.Boolean(),
    errors: Type.Array(ErrorSpec),
  })
);

export const ValidationTraitStateSpec = Type.Object({
  validatedResult: ValidatedResultSpec,
  isInvalid: Type.Boolean(),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Validation,
    description: 'A trait for the form validation.',
  },
  spec: {
    properties: ValidationTraitPropertiesSpec,
    state: ValidationTraitStateSpec,
    methods: [
      {
        name: 'setErrors',
        parameters: Type.Object({
          errorsMap: Type.Record(Type.String(), Type.Array(ErrorSpec)),
        }),
      },
      {
        name: 'validateFields',
        parameters: Type.Object({
          names: Type.Array(Type.String()),
        }),
      },
      {
        name: 'validateAllFields',
        parameters: Type.Object({}),
      },
      {
        name: 'clearErrors',
        parameters: Type.Object({ names: Type.Array(Type.String()) }),
      },
      {
        name: 'clearAllErrors',
        parameters: Type.Object({}),
      },
    ],
  },
})(() => {
  const initialMap = new Map();
  const resultMap = new Map();

  return props => {
    const { validators = [], componentId, subscribeMethods, mergeState } = props;
    const validatorMap = validators.reduce((result, validator) => {
      result[validator.name] = validator;

      return result;
    }, {} as Record<string, Static<typeof ValidatorSpec>>);

    function setErrors({
      errorsMap = {},
    }: {
      errorsMap: Record<string, Static<typeof ErrorSpec>[]>;
    }) {
      const validatedResult = Object.keys(errorsMap).reduce(
        (result: Static<typeof ValidatedResultSpec>, name) => {
          result[name] = {
            isInvalid: errorsMap[name].length !== 0,
            errors: errorsMap[name],
          };

          return result;
        },
        {}
      );

      mergeState({
        validatedResult,
        isInvalid: Object.keys(validatedResult).some(
          key => validatedResult[key].isInvalid
        ),
      });
      resultMap.set(componentId, validatedResult);
    }
    function validateFields({ names = [] }: { names: string[] }) {
      const validatedResult = names
        .filter(name => validatorMap[name])
        .map(name => {
          const validator = validatorMap[name];
          const { value, rules } = validator;
          const errors = rules
            .map(rule => {
              const { type, error, validate, customOptions, ...options } = rule;
              let isValid = true;

              if (type === 'custom') {
                isValid = validate(value, customOptions);
              } else {
                isValid = validateFnMap[type](value, options);
              }

              return isValid ? null : { message: error.message };
            })
            .filter((error): error is Static<typeof ErrorSpec> => error !== null);

          return {
            name,
            isInvalid: errors.length !== 0,
            errors,
          };
        })
        .reduce((result: Static<typeof ValidatedResultSpec>, validatedResultItem) => {
          result[validatedResultItem.name] = {
            isInvalid: validatedResultItem.isInvalid,
            errors: validatedResultItem.errors,
          };

          return result;
        }, {});
      const mergedValidatedResult = {
        ...(resultMap.get(componentId) || {}),
        ...validatedResult,
      };

      mergeState({
        validatedResult: mergedValidatedResult,
        isInvalid: Object.keys(mergedValidatedResult).some(
          key => mergedValidatedResult[key].isInvalid
        ),
      });
      resultMap.set(componentId, mergedValidatedResult);
    }
    function validateAllFields() {
      validateFields({ names: validators.map(({ name }) => name) });
    }
    function clearErrors({ names = [] }: { names: string[] }) {
      setErrors({
        errorsMap: names.reduce((result: Record<string, []>, name) => {
          result[name] = [];

          return result;
        }, {}),
      });
    }
    function clearAllErrors() {
      clearErrors({ names: validators.map(({ name }) => name) });
    }

    subscribeMethods({
      setErrors,
      validateFields,
      validateAllFields,
      clearErrors,
      clearAllErrors,
    });

    if (initialMap.has(componentId) === false) {
      clearAllErrors();
      initialMap.set(componentId, true);
    }

    return {
      props: {
        componentDidUnmount: [
          () => {
            initialMap.delete(componentId);
          },
        ],
      },
    };
  };
});
