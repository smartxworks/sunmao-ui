import { Type } from "@sinclair/typebox";
import { StringUnion } from "../../sunmao-helper";
import { Category } from '../../constants/category'


export const SkeletonTextPropsSchema = {
  rows: Type.Number(),
  width: Type.Optional(
    Type.Union([
      Type.Number(),
      Type.String(),
      Type.Array(
        Type.Union([Type.Union([Type.Number()]), Type.Union([Type.String()])])
      ),
    ])
  ),
};

export const SkeletonImagePropsSchema = {
  shape: StringUnion(["circle", "square"]),
  size: StringUnion(["small", "default", "large"]),
  position: StringUnion(["left", "right"]),
};

export const SkeletonPropsSchema = {
  animation: Type.Boolean({
    category:Category.Style
  }),
  loading: Type.Boolean({
    category:Category.Style
  }),
  // TODO remove union type
  image: Type.Union([Type.Boolean(), Type.Object(SkeletonImagePropsSchema)],{
    category:Category.General
  }),
  text: Type.Union([Type.Boolean(), Type.Object(SkeletonTextPropsSchema)],{
    category:Category.General
  })
};
