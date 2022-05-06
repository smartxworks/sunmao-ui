export enum DataSourceType {
  API = 'API',
  STATE = 'State',
  LOCALSTORAGE = 'LocalStorage',
  TRANSFORMER = 'Transformer',
}

export const DATASOURCE_NAME_MAP = {
  [DataSourceType.API]: 'api',
  [DataSourceType.STATE]: 'state',
  [DataSourceType.LOCALSTORAGE]: 'localStorage',
  [DataSourceType.TRANSFORMER]: 'transformer',
};

export const DATASOURCE_TRAIT_TYPE_MAP = {
  [DataSourceType.API]: 'core/v1/fetch',
  [DataSourceType.STATE]: 'core/v1/state',
  [DataSourceType.LOCALSTORAGE]: 'core/v1/localStorage',
  [DataSourceType.TRANSFORMER]: 'core/v1/transformer',
};

export const DATA_DATASOURCES = [
  {
    type: DataSourceType.STATE,
    traitType: DATASOURCE_TRAIT_TYPE_MAP[DataSourceType.STATE],
    filterPlaceholder: 'filter the states',
    emptyPlaceholder: 'No States.',
  },
  {
    type: DataSourceType.LOCALSTORAGE,
    traitType: DATASOURCE_TRAIT_TYPE_MAP[DataSourceType.LOCALSTORAGE],
    filterPlaceholder: 'filter the localStorages',
    emptyPlaceholder: 'No LocalStorages.',
  },
  {
    type: DataSourceType.TRANSFORMER,
    traitType: DATASOURCE_TRAIT_TYPE_MAP[DataSourceType.TRANSFORMER],
    filterPlaceholder: 'filter the transformers',
    emptyPlaceholder: 'No Transformers.',
  },
];
