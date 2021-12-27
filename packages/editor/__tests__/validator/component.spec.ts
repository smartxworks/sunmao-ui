import { registry } from '../../src/setup';
import { ComponentInvalidSchema,ComponentPropertyExpressionSchema } from './mock';
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
    it('ignore expreesion', () => {
      const result = schemaValidator.validate(ComponentPropertyExpressionSchema);
      expect(result.length).toBe(0);
    })
  });
});
