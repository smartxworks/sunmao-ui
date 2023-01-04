type OperationType =
  | 'createComponent'
  | 'removeComponent'
  | 'modifyComponentProperties'
  | 'modifyComponentId'
  | 'adjustComponentOrder'
  | 'createTrait'
  | 'removeTrait'
  | 'modifyTraitProperty'
  | 'replaceApp'
  | 'pasteComponent'
  | 'moveComponent'
  | 'createDataSource';

type Operation = {
  type: OperationType;
  props: Record<string, any>;
};

export type Operations = Operation[];
