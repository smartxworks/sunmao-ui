import { OrphanComponentSchema } from './mock';
import { SchemaValidator } from '../../src/validator';
import { registry } from '../services';
import { AppModel } from '../../src/AppModel/AppModel';

const schemaValidator = new SchemaValidator(registry);

describe('Validate all components', () => {
  const result = schemaValidator.validate(new AppModel(OrphanComponentSchema, registry));
  describe('detect orphan components', () => {
    it('no parent', () => {
      expect(result[0].message).toBe(`Cannot find parent component: aParent.`);
    });
    it('no slot', () => {
      expect(result[1].message).toBe(
        `Parent component 'hstack1' does not have slot: aSlot.`
      );
    });
  });
});
