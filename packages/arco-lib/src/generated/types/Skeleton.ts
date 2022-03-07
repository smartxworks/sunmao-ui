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
    title:'Animation',
    category:Category.Basic
  }),
  loading: Type.Boolean({
    title:'Loading',
    category:Category.Basic
  }),
  // TODO remove union type
  image: Type.Union([Type.Boolean(), Type.Object(SkeletonImagePropsSchema)],{
    title:'Image Placeholder',
    description:'Whether to show the picture placeholder',
    category:Category.Basic
  }),
  text: Type.Union([Type.Boolean(), Type.Object(SkeletonTextPropsSchema)],{
    title:'Text Placeholder',
    description:'Whether to show text placeholder',
    category:Category.Basic
  })
};
