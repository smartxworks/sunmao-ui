// 外面exp依赖里面
export type OutsideExpRelation = {
  componentId: string;
  exp: string;
  key: string;
  valuePath: string;
  relyOn: string;
};

export type OutsideExpRelationWithState = OutsideExpRelation & {
  stateName: string;
};
