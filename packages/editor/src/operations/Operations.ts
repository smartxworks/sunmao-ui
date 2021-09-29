export type Operations =
  | CreateComponentOperation
  | RemoveComponentOperation
  | ModifyComponentPropertyOperation;
export class CreateComponentOperation {
  kind = 'createComponent';

  constructor(
    public parentId: string,
    public slot: string,
    public componentType: string,
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
