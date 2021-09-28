export type Operations = CreateComponentOperation | RemoveComponentOperation;
export class CreateComponentOperation {
  kind = 'createComponent';

  constructor(
    public parentId: string,
    public slot: string,
    public componentType: string
  ) {}
}

export class RemoveComponentOperation {
  kind = 'removeComponent';
  constructor(public componentId: string) {}
}
