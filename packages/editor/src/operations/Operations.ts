export type Operations =
  | CreateComponentOperation
  | RemoveComponentOperation
  | ModifyComponentPropertyOperation;
export class CreateComponentOperation {
  kind = 'createComponent';

  constructor(
    public componentType: string,
    public parentId?: string,
    public slot?: string,
    public componentId?: string
  ) {}
}

export class RemoveComponentOperation {
  kind = 'removeComponent';
  constructor(public componentId: string) {}
}

export class ModifyComponentPropertyOperation {
  kind = 'modifyComponentProperty';
  constructor(
    public componentId: string,
    public propertyKey: string,
    public propertyValue: unknown
  ) {}
}
export class ModifyComponentIdOperation {
  kind = 'modifyComponentId';
  constructor(
    public componentId: string,
    public value: string
  ) {}
}

export class ModifyTraitPropertyOperation {
  kind = 'modifyTraitProperty';
  constructor(
    public componentId: string,
    public traitType: string,
    public propertyKey: string,
    public propertyValue: unknown
  ) {}
}
