import { RegistryInterface } from '@sunmao-ui/runtime';
import {
  CreateComponentBranchOperation,
  CreateComponentBranchOperationContext,
  ModifyComponentIdBranchOperation,
  ModifyComponentIdBranchOperationContext,
  RemoveComponentBranchOperation,
  RemoveComponentBranchOperationContext,
  MoveComponentBranchOperation,
  MoveComponentBranchOperationContext,
  ExtractModuleBranchOperation,
  ExtractModuleBranchOperationContext,
  CreateDataSourceBranchOperation,
  CreateDataSourceBranchOperationContext,
} from './branch';
import {
  AdjustComponentOrderLeafOperation,
  AdjustComponentOrderLeafOperationContext,
  CreateTraitLeafOperation,
  CreateTraitLeafOperationContext,
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

export const OperationConstructors: Record<
  OperationTypes,
  OperationConfigMaps[OperationTypes]['constructor']
> = {
  createComponent: CreateComponentBranchOperation,
  removeComponent: RemoveComponentBranchOperation,
  modifyComponentProperties: ModifyComponentPropertiesLeafOperation,
  modifyComponentId: ModifyComponentIdBranchOperation,
  adjustComponentOrder: AdjustComponentOrderLeafOperation,
  createTrait: CreateTraitLeafOperation,
  removeTrait: RemoveTraitLeafOperation,
  modifyTraitProperty: ModifyTraitPropertiesLeafOperation,
  replaceApp: ReplaceAppLeafOperation,
  pasteComponent: PasteComponentLeafOperation,
  moveComponent: MoveComponentBranchOperation,
  extractModule: ExtractModuleBranchOperation,
  createDataSource: CreateDataSourceBranchOperation,
};

type OperationTypes = keyof OperationConfigMaps;

type OperationConfigMap<TOperation, TContext> = {
  constructor: new (registry: RegistryInterface, context: TContext) => TOperation;
  context: TContext;
  registry: RegistryInterface;
};

export type OperationConfigMaps = {
  createComponent: OperationConfigMap<
    CreateComponentBranchOperation,
    CreateComponentBranchOperationContext
  >;
  removeComponent: OperationConfigMap<
    RemoveComponentBranchOperation,
    RemoveComponentBranchOperationContext
  >;
  modifyComponentProperties: OperationConfigMap<
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
  moveComponent: OperationConfigMap<
    MoveComponentBranchOperation,
    MoveComponentBranchOperationContext
  >;
  extractModule: OperationConfigMap<
    ExtractModuleBranchOperation,
    ExtractModuleBranchOperationContext
  >;
  createDataSource: OperationConfigMap<
    CreateDataSourceBranchOperation,
    CreateDataSourceBranchOperationContext
  >;
};

export const genOperation = <T extends OperationTypes>(
  registry: RegistryInterface,
  type: T,
  context: OperationConfigMaps[T]['context']
): IOperation => {
  const OperationConstructor = OperationConstructors[
    type
  ] as OperationConfigMaps[T]['constructor'];
  return new OperationConstructor(registry, context as any);
};
