import type Ajv from 'ajv';

export function initAjv(ajv: Ajv) {
  return ajv
    .addKeyword('kind')
    .addKeyword('modifier')
    .addKeyword('widget')
    .addKeyword('weight')
    .addKeyword('category')
    .addKeyword('widgetOptions')
    .addKeyword('conditions')
    .addKeyword('name')
    .addKeyword('isComponentId')
    .addKeyword('defaultValue');
}
