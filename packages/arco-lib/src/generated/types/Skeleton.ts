
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const SkeletonTextPropsSchema = {
    className: Type.Optional(Type.String()),
    rows: Type.Optional(Type.Number()),
    width: Type.Optional(Type.Union([
        Type.Number(), Type.String(),
        Type.Array(Type.Union([Type.Number(), Type.String()]))
    ])),
}

export const SkeletonImagePropsSchema = {
    className: Type.Optional(Type.String()),
    shape: Type.Optional(StringUnion(['circle', 'square'])),
    size: Type.Optional(StringUnion(['small', 'default', 'large'])),
    position: Type.Optional(StringUnion(['left', 'right'])),
}

export const SkeletonPropsSchema = {
    className: Type.Optional(Type.String()),
    animation: Type.Optional(Type.Boolean()),
    loading: Type.Optional(Type.Boolean()),
    image: Type.Optional(Type.Union([
        Type.Boolean(),
        Type.Object(SkeletonImagePropsSchema)
    ])),
    text: Type.Optional(Type.Union([
        Type.Boolean(),
        Type.Object(SkeletonTextPropsSchema)
    ])),
};
