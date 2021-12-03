import {
  CreateComponentBranchOperation,
  CreateComponentBranchOperationContext,
  ModifyComponentIdBranchOperation,
  ModifyComponentIdBranchOperationContext,
  RemoveComponentBranchOperation,
  RemoveComponentBranchOperationContext,
} from './branch';
import { CutComponentBranchOperation } from './branch/cutComponentBranchOperation';
import {
  AdjustComponentOrderLeafOperation,
  AdjustComponentOrderLeafOperationContext,
  CreateTraitLeafOperation,
  CreateTraitLeafOperationContext,
  CutComponentLeafOperationContext,
  ModifyComponentPropertiesLeafOperation,
  ModifyComponentPropertiesLeafOperationContext,
  ModifyTraitPropertiesLeafOperation,
  ModifyTraitPropertiesLeafOperationContext,
  RemoveTraitLeafOperation,
  RemoveTraitLeafOperationContext,
  ReplaceAppLeafOperation,
  ReplaceAppLeafOperationContext,
  PasteComponentLeafOperation,
  PasteComponentLeafOperationContext,
} from './leaf';
import { IOperation } from './type';

const OperationConstructors: Record<
  OperationTypes,
  OperationConfigMaps[OperationTypes]['constructor']
> = {
  createComponent: CreateComponentBranchOperation,
  removeComponent: RemoveComponentBranchOperation,
  modifyComponentProperty: ModifyComponentPropertiesLeafOperation,
  modifyComponentId: ModifyComponentIdBranchOperation,
  adjustComponentOrder: AdjustComponentOrderLeafOperation,
  createTrait: CreateTraitLeafOperation,
  removeTrait: RemoveTraitLeafOperation,
  modifyTraitProperty: ModifyTraitPropertiesLeafOperation,
  replaceApp: ReplaceAppLeafOperation,
  pasteComponent: PasteComponentLeafOperation,
  cutComponent: CutComponentBranchOperation,
};

type OperationTypes = keyof OperationConfigMaps;

type OperationConfigMap<TOperation, TContext> = {
  constructor: new (context: TContext) => TOperation;
  context: TContext;
};

type OperationConfigMaps = {
  createComponent: OperationConfigMap<
    CreateComponentBranchOperation,
    CreateComponentBranchOperationContext
  >;
  removeComponent: OperationConfigMap<
    RemoveComponentBranchOperation,
    RemoveComponentBranchOperationContext
  >;
  cutComponent: OperationConfigMap<
    CutComponentBranchOperation,
    CutComponentLeafOperationContext
  >;
  modifyComponentProperty: OperationConfigMap<
    ModifyComponentPropertiesLeafOperation,
    ModifyComponentPropertiesLeafOperationContext
  >;
  modifyComponentId: OperationConfigMap<
    ModifyComponentIdBranchOperation,
    ModifyComponentIdBranchOperationContext
  >;
  adjustComponentOrder: OperationConfigMap<
    AdjustComponentOrderLeafOperation,
    AdjustComponentOrderLeafOperationContext
  >;
  createTrait: OperationConfigMap<
    CreateTraitLeafOperation,
    CreateTraitLeafOperationContext
  >;
  removeTrait: OperationConfigMap<
    RemoveTraitLeafOperation,
    RemoveTraitLeafOperationContext
  >;
  modifyTraitProperty: OperationConfigMap<
    ModifyTraitPropertiesLeafOperation,
    ModifyTraitPropertiesLeafOperationContext
  >;
  replaceApp: OperationConfigMap<ReplaceAppLeafOperation, ReplaceAppLeafOperationContext>;

  pasteComponent: OperationConfigMap<
    PasteComponentLeafOperation,
    PasteComponentLeafOperationContext
  >;
};

export const genOperation = <T extends OperationTypes>(
  type: T,
  context: OperationConfigMaps[T]['context']
): IOperation => {
  const OperationConstructor = OperationConstructors[
    type
  ] as OperationConfigMaps[T]['constructor'];
  return new OperationConstructor(context as any);
};
