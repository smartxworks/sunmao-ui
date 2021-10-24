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
    public propertyValue: any
  ) {}
}

export class AddTraitOperation {
  kind = 'addTraitOperation';
  constructor(
    public componentId: string,
    public traitType: string,
    public properties: any
  ) {}
}

export class RemoveTraitOperation {
  kind = 'removeTraitOperation';
  constructor(public componentId: string, public traitIndex: number) {}
}

export class ModifyComponentIdOperation {
  kind = 'modifyComponentId';
  constructor(public componentId: string, public value: string) {}
}

export class ModifyTraitPropertyOperation {
  kind = 'modifyTraitProperty';
  constructor(
    public componentId: string,
    public traitType: string,
    public propertyKey: string,
    public propertyValue: any
  ) {}
}

export class ModifyTraitPropertiesOperation {
  kind = 'modifyTraitProperties';
  constructor(
    public componentId: string,
    public traitType: string,
    public properties: Record<string, any>
  ) {}
}
export class SortComponentOperation {
  kind = 'sortComponent';
  constructor(
    public componentId: string,
    public direction: 'up' | 'down'
  ) {}
}
