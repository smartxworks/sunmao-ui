export interface BaseOperation {
  kind: OperationKind;
}

export enum OperationKind {
  createComponent = 'createComponent',
  removeComponent = 'removeComponent',
}

export class CreateComponentOperation implements BaseOperation {
  kind = OperationKind.createComponent;

  constructor(
    public parentId: string,
    public slot: string,
    public componentType: string
  ) {}
}

export class RemoveComponentOperation implements BaseOperation {
  kind = OperationKind.removeComponent;
  constructor(public componentId: string) {}
}

// export interface MoveComponentOperation extends BaseOperation {
//   kind: 'moveComponent';
//   componentId: string;
//   fromComponent: string;
//   fromSlot: string;
//   toComponent: string;
//   toSlot: string;
// }

// export interface ModifyComponentIdOperation extends BaseOperation {
//   kind: 'modifyComponentId';
//   oldComponentId: string;
//   newComponentId: string;
// }

// export interface ModifyComponentPropertyOperation extends BaseOperation {
//   kind: 'modifyComponentProperty';
//   componentId: string;
//   propertyKey: string;
//   newValue: any;
// }

// export interface AddTraitOperation extends BaseOperation {
//   kind: 'addTrait';
//   componentId: string;
//   traitType: string;
// }
