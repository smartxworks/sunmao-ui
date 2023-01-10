import { AppModel } from '../../../AppModel/AppModel';
import { BaseBranchOperation } from '../../type';
import { CreateComponentBranchOperation } from '../index';
import { CreateTraitLeafOperation } from '../../leaf';
import {
  generateDefaultValueFromSpec,
  CORE_VERSION,
  CoreComponentName,
} from '@sunmao-ui/shared';
import { JSONSchema7Object } from 'json-schema';

export type CreateDataSourceBranchOperationContext = {
  id: string;
  type: string;
  defaultProperties?: Record<string, any>;
};

export class CreateDataSourceBranchOperation extends BaseBranchOperation<CreateDataSourceBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const { id, type, defaultProperties } = this.context;
    const traitDefine = this.registry.getTraitByType(type);
    const traitSpec = traitDefine.spec;
    const initProperties =
      traitDefine.metadata.exampleProperties ||
      (generateDefaultValueFromSpec(traitSpec.properties, {
        genArrayItemDefaults: true,
      }) as JSONSchema7Object);

    this.operationStack.insert(
      new CreateComponentBranchOperation(this.registry, {
        componentType: `${CORE_VERSION}/${CoreComponentName.Dummy}`,
        componentId: id,
      })
    );
    this.operationStack.insert(
      new CreateTraitLeafOperation(this.registry, {
        componentId: id,
        traitType: type,
        properties: defaultProperties || initProperties,
      })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
