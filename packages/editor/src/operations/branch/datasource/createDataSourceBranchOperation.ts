import { AppModel } from '../../../AppModel/AppModel';
import { BaseBranchOperation } from '../../type';
import { CreateComponentBranchOperation } from '../index';
import { CreateTraitLeafOperation } from '../../leaf';
import { DataSourceType, DATASOURCE_TRAIT_TYPE_MAP } from '../../../constants/dataSource';
import {
  generateDefaultValueFromSpec,
  CORE_VERSION,
  CoreComponentName,
} from '@sunmao-ui/shared';
import { JSONSchema7Object } from 'json-schema';
import { Static } from '@sinclair/typebox';
import {
  FetchTraitPropertiesSpec,
  LocalStorageTraitPropertiesSpec,
  StateTraitPropertiesSpec,
} from '@sunmao-ui/runtime';

export type ApiProperties = Static<typeof FetchTraitPropertiesSpec>;

export type LocalStorageProperties = Static<typeof LocalStorageTraitPropertiesSpec>;

export type StateProperties = Static<typeof StateTraitPropertiesSpec>;

export type DataSourceProperties = Partial<
  ApiProperties & LocalStorageProperties & StateProperties
>;

export type CreateDataSourceBranchOperationContext = {
  id: string;
  type: DataSourceType;
  defaultProperties: DataSourceProperties;
};

export class CreateDataSourceBranchOperation extends BaseBranchOperation<CreateDataSourceBranchOperationContext> {
  do(prev: AppModel): AppModel {
    const { id, type, defaultProperties = {} } = this.context;
    const traitType = DATASOURCE_TRAIT_TYPE_MAP[type];
    const traitSpec = this.registry.getTraitByType(traitType).spec;
    const initProperties = generateDefaultValueFromSpec(
      traitSpec.properties
    ) as JSONSchema7Object;

    this.operationStack.insert(
      new CreateComponentBranchOperation(this.registry, {
        componentType: `${CORE_VERSION}/${CoreComponentName.Dummy}`,
        componentId: id,
      })
    );
    this.operationStack.insert(
      new CreateTraitLeafOperation(this.registry, {
        componentId: id,
        traitType,
        properties:
          type === DataSourceType.API
            ? {
                ...initProperties,
                ...defaultProperties,
                method: defaultProperties.method || 'get',
              }
            : { ...initProperties, ...defaultProperties },
      })
    );

    // do the operation in order
    return this.operationStack.reduce((prev, node) => {
      prev = node.do(prev);
      return prev;
    }, prev);
  }
}
