import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { PRESET_PROPERTY_CATEGORY } from '@sunmao-ui/editor'
import { TextPropertySchema } from "@sunmao-ui/runtime";

export const FormControlPropsSchema = {
    label: TextPropertySchema,
    required: Type.Boolean({
        title: 'Required',
        category: PRESET_PROPERTY_CATEGORY.Basic
    }),
    hidden: Type.Boolean({
        title: 'Hidden',
        category: PRESET_PROPERTY_CATEGORY.Basic
    }),
    extra: Type.String({
        title: 'Extra',
        category: PRESET_PROPERTY_CATEGORY.Basic
    }),
    errorMsg: Type.String({
        title: 'Error Message',
        category: PRESET_PROPERTY_CATEGORY.Basic
    }),
    help: Type.String({
        title: 'Help Message',
        category: PRESET_PROPERTY_CATEGORY.Basic
    }),
    labelAlign: StringUnion(['left', 'right', 'unset'], {
        title: 'Label Align',
        category: PRESET_PROPERTY_CATEGORY.Layout
    }),
    colon: Type.Boolean({
        title: 'Colon',
        category: PRESET_PROPERTY_CATEGORY.Style
    }),
    labelCol: Type.Object({
        span: Type.Number(),
        offset: Type.Number()
    }, {
        title: 'Label Col',
        category: PRESET_PROPERTY_CATEGORY.Layout
    }),
    wrapperCol: Type.Object({
        span: Type.Number(),
        offset: Type.Number()
    }, {
        title: 'Wrapper Col',
        category: PRESET_PROPERTY_CATEGORY.Layout
    })
}

export const FormPropsSchema = {
    layout: StringUnion(['horizontal', 'vertical', 'inline'], {
        title: 'Layout',
        category: PRESET_PROPERTY_CATEGORY.Layout
    }),
    childrenLayout: StringUnion(['vertical', 'horizontal'], {
        title: 'Children Layout',
        category: PRESET_PROPERTY_CATEGORY.Layout,
    }),
    labelAlign: StringUnion(['left', 'right'], {
        title: 'Label Align',
        category: PRESET_PROPERTY_CATEGORY.Layout
    }),
    size: StringUnion(['mini', 'small', 'default', 'large'], {
        title: 'Size',
        category: PRESET_PROPERTY_CATEGORY.Layout
    }),
    bordered: Type.Boolean({
        title: 'Bordered',
        category: PRESET_PROPERTY_CATEGORY.Layout
    }),
};
