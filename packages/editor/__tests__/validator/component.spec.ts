import {
  ComponentInvalidSchema,
  ComponentPropertyExpressionSchema,
  ComponentWrongPropertyExpressionSchema,
} from './mock';
import { SchemaValidator } from '../../src/validator';
import { registry } from '../sevices';

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
  })
  describe('validate expression', () => {
    const result = schemaValidator.validate(ComponentWrongPropertyExpressionSchema);
    it('detect using non-exist variables in expression', () => {
      expect(result[0].message).toBe(`Cannot find 'data' in store or window.`);
    });
    it('detect using non-exist variables in expression of array property', () => {
      expect(result[1].message).toBe(`Cannot find 'fetch' in store or window.`);
    });
    it('detect using property which does not exist in component state spec', () => {
      expect(result[2].message).toBe(`Component 'input1' does not have property 'noValue'.`);
    });
    it('detect using property which does not exist in window', () => {
      expect(result[3].message).toBe(`Window object 'Math' does not have property 'random2'.`);
    });
  });
});
