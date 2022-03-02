import { Type } from "@sinclair/typebox";
import { Category } from "../../constants/category";
import { StringUnion } from "../../sunmao-helper";

export const TreeNodeSchema = Type.Object({
  title: Type.String(),
  key: Type.String(),
  children: Type.Optional(Type.Array(Type.Any())),
  selectable: Type.Optional(Type.Boolean()),
  checkable: Type.Optional(Type.Boolean()),
});

export const TreePropsSchema = Type.Object({
  data: Type.Array(TreeNodeSchema, {
    category: Category.Data,
    title: "Tree Data",
  }),
  size: StringUnion(["mini", "small", "medium", "large"], {
    category: Category.Style,
    title: "Size",
  }),
  multiple: Type.Boolean({
    category: Category.Basic,
    title: "Multiple Select",
  }),
  autoExpandParent: Type.Boolean({
    category: Category.Basic,
    title: "Auto Expand Node",
  }),
});
