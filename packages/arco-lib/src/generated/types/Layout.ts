
import { Type, TUnion, TLiteral } from "@sinclair/typebox";

type IntoStringUnion<T> = {[K in keyof T]: T[K] extends string ? TLiteral<T[K]>: never }

function StringUnion<T extends string[]>(values: [...T]): TUnion<IntoStringUnion<T>> {
    return { enum: values } as any
}

export const LayoutPropsSchema = {
  'hasSider': Type.Optional(Type.Boolean()),
  'defaultChecked': Type.Optional(Type.Boolean()),
  'suppressContentEditableWarning': Type.Optional(Type.Boolean()),
  'suppressHydrationWarning': Type.Optional(Type.Boolean()),
  'hidden': Type.Optional(Type.Boolean()),
  'translate': Type.Optional(StringUnion(['yes', 'no'])),
  'itemScope': Type.Optional(Type.Boolean()),
  'unselectable': Type.Optional(StringUnion(['on', 'off'])),
  'inputMode': Type.Optional(StringUnion(['text', 'none', 'search', 'tel', 'url', 'email', 'numeric', 'decimal']))
};
export const HeaderPropsSchema = {
  'defaultChecked': Type.Optional(Type.Boolean()),
  'suppressContentEditableWarning': Type.Optional(Type.Boolean()),
  'suppressHydrationWarning': Type.Optional(Type.Boolean()),
  'hidden': Type.Optional(Type.Boolean()),
  'translate': Type.Optional(StringUnion(['yes', 'no'])),
  'itemScope': Type.Optional(Type.Boolean()),
  'unselectable': Type.Optional(StringUnion(['on', 'off'])),
  'inputMode': Type.Optional(StringUnion(['text', 'none', 'search', 'tel', 'url', 'email', 'numeric', 'decimal']))
};
export const FooterPropsSchema = {
  'defaultChecked': Type.Optional(Type.Boolean()),
  'suppressContentEditableWarning': Type.Optional(Type.Boolean()),
  'suppressHydrationWarning': Type.Optional(Type.Boolean()),
  'hidden': Type.Optional(Type.Boolean()),
  'translate': Type.Optional(StringUnion(['yes', 'no'])),
  'itemScope': Type.Optional(Type.Boolean()),
  'unselectable': Type.Optional(StringUnion(['on', 'off'])),
  'inputMode': Type.Optional(StringUnion(['text', 'none', 'search', 'tel', 'url', 'email', 'numeric', 'decimal']))
};
export const ContentPropsSchema = {
  'defaultChecked': Type.Optional(Type.Boolean()),
  'suppressContentEditableWarning': Type.Optional(Type.Boolean()),
  'suppressHydrationWarning': Type.Optional(Type.Boolean()),
  'hidden': Type.Optional(Type.Boolean()),
  'translate': Type.Optional(StringUnion(['yes', 'no'])),
  'itemScope': Type.Optional(Type.Boolean()),
  'unselectable': Type.Optional(StringUnion(['on', 'off'])),
  'inputMode': Type.Optional(StringUnion(['text', 'none', 'search', 'tel', 'url', 'email', 'numeric', 'decimal']))
};
export const SiderPropsSchema = {
  'theme': Type.Optional(StringUnion(['dark', 'light'])),
  'collapsed': Type.Optional(Type.Boolean()),
  'collapsible': Type.Optional(Type.Boolean()),
  'defaultCollapsed': Type.Optional(Type.Boolean()),
  'reverseArrow': Type.Optional(Type.Boolean()),
  'breakpoint': Type.Optional(StringUnion(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']))
};
