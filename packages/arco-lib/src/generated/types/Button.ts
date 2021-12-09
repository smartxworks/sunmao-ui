
import { Type, TUnion, TLiteral } from "@sinclair/typebox";

type IntoStringUnion<T> = {[K in keyof T]: T[K] extends string ? TLiteral<T[K]>: never }

function StringUnion<T extends string[]>(values: [...T]): TUnion<IntoStringUnion<T>> {
    return { enum: values } as any
}

export const ButtonPropsSchema = Type.Object({
  'htmlType': Type.Optional(StringUnion(['button', 'submit', 'reset'])),
  'type': Type.Optional(StringUnion(['default', 'primary', 'secondary', 'dashed', 'text', 'outline'])),
  'size': Type.Optional(StringUnion(['default', 'mini', 'small', 'large'])),
  'shape': Type.Optional(StringUnion(['circle', 'round', 'square'])),
  'disabled': Type.Optional(Type.Boolean()),
  'loading': Type.Optional(Type.Boolean()),
  'loadingFixedWidth': Type.Optional(Type.Boolean()),
  'iconOnly': Type.Optional(Type.Boolean()),
  'long': Type.Optional(Type.Boolean())
});
