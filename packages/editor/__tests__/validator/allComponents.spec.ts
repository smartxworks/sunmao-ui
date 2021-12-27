import { registry } from '../../src/setup';
import { ComponentInvalidSchema } from './schema';
import { SchemaValidator } from '../../src/validator';

const schemaValidator = new SchemaValidator(registry);

describe('Validate all components', () => {
  const result = schemaValidator.validate(ComponentInvalidSchema);
  describe('detect orphen components', () => {
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
