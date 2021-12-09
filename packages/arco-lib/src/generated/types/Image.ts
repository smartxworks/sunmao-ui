
import { Type, TUnion, TLiteral } from "@sinclair/typebox";

type IntoStringUnion<T> = {[K in keyof T]: T[K] extends string ? TLiteral<T[K]>: never }

function StringUnion<T extends string[]>(values: [...T]): TUnion<IntoStringUnion<T>> {
    return { enum: values } as any
}

export const ImagePropsSchema = {
  'src': Type.Optional(Type.String()),
  'title': Type.Optional(Type.String()),
  'description': Type.Optional(Type.String()),
  'footerPosition': Type.Optional(StringUnion(['inner', 'outer'])),
  'simple': Type.Optional(Type.Boolean()),
  'preview': Type.Optional(Type.Boolean())
};
