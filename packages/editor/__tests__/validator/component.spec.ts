import { registry } from '../../src/setup';
import {
  ComponentInvalidSchema,
  ComponentPropertyExpressionSchema,
  ComponentWrongPropertyExpressionSchema,
} from './mock';
import { SchemaValidator } from '../../src/validator';

const schemaValidator = new SchemaValidator(registry);

describe('Validate component', () => {
  describe('validate component properties', () => {
    const result = schemaValidator.validate(ComponentInvalidSchema);
    it('detect missing field', () => {
      expect(result[0].message).toBe(`must have required property 'format'`);
    });
    it('detect wrong type', () => {
      expect(result[1].message).toBe(`must be string`);
    });
    it('ignore expression', () => {
      const result = schemaValidator.validate(ComponentPropertyExpressionSchema);
      expect(result.length).toBe(0);
    });
    it('detect using non-exist variables in expression', () => {
      const result = schemaValidator.validate(ComponentWrongPropertyExpressionSchema);
      expect(result[0].message).toBe(`Cannot find 'input' in store.`);
    });
  });
});
