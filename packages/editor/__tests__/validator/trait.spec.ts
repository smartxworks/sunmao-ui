import {
  TraitInvalidSchema,
  EventTraitSchema,
  EventTraitTraitMethodSchema,
} from './mock';
import { SchemaValidator } from '../../src/validator';
import { registry } from '../services';
import { AppModel } from '../../src/AppModel/AppModel';

const schemaValidator = new SchemaValidator(registry);

describe('Validate trait', () => {
  describe('validate trait properties', () => {
    const result = schemaValidator.validate(new AppModel(TraitInvalidSchema, registry));
    it('detect missing field', () => {
      expect(result[0].message).toBe(`must have required property 'key'`);
    });
    it('detect wrong type', () => {
      expect(result[1].message).toBe(`must be string`);
    });
  });

  describe('validate event trait', () => {
    const result = schemaValidator.validate(new AppModel(EventTraitSchema, registry));
    it('detect wrong event', () => {
      expect(result[0].message).toBe(`Component does not have event: change.`);
    });
    it('detect missing target', () => {
      expect(result[1].message).toBe(`Event target component is not exist: dialog1.`);
    });
    it('detect missing method', () => {
      expect(result[2].message).toBe(
        `Event target component does not have method: fetch.`
      );
    });
    it('detect wrong method parameters', () => {
      expect(result[3].message).toBe(`must be string`);
    });
    it('detect method on trait', () => {
      const result = schemaValidator.validate(
        new AppModel(EventTraitTraitMethodSchema, registry)
      );
      expect(result.length).toBe(0);
    });
  });
});
