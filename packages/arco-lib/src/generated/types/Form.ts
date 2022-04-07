import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';
import { TextPropertySpec } from "@sunmao-ui/runtime";

export const FormControlPropsSchema = {
    label: TextPropertySpec,
    required: Type.Boolean({
        title: 'Required',
        category: Category.Basic
    }),
    hidden: Type.Boolean({
        title: 'Hidden',
        category: Category.Basic
    }),
    layout: StringUnion(['vertical', 'horizontal'], {
        title: 'Layout',
        category: Category.Layout,
    }),
    extra: Type.String({
        title: 'Extra',
        category: Category.Basic
    }),
    errorMsg: Type.String({
        title: 'Error Message',
        category: Category.Basic
    }),
    help: Type.String({
        title: 'Help Message',
        category: Category.Basic
    }),
    labelAlign: StringUnion(['left', 'right'], {
        title: 'Label Align',
        category: Category.Layout
    }),
    colon: Type.Boolean({
        title: 'Colon',
        category: Category.Style
    }),
    labelCol: Type.Object({
        span: Type.Number(),
        offset: Type.Number()
    }, {
        title: 'Label Col',
        category: Category.Layout
    }),
    wrapperCol: Type.Object({
        span: Type.Number(),
        offset: Type.Number()
    }, {
        title: 'Wrapper Col',
        category: Category.Layout
    })
}

export const FormPropsSchema = {
    inline: Type.Boolean({
        title: 'Inline',
        category: Category.Layout
    }),
    size: StringUnion(['mini', 'small', 'default', 'large'], {
        title: 'Size',
        category: Category.Layout
    }),
    bordered: Type.Boolean({
        title: 'Bordered',
        category: Category.Layout
    }),
};
