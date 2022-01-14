import { AppModel } from '../../src/AppModel/AppModel';
import { ComponentId, ComponentType } from '../../src/AppModel/IAppModel';
import { registry } from '../sevices';
import { AppSchema, DuplicatedIdSchema } from './mock';

describe('AppModel test', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  describe('resolve tree', () => {
    it('resolve Tree corectlly', () => {
      expect(appModel.allComponents.length).toBe(10);
      expect(appModel.topComponents.length).toBe(2);
    });
    it('components order', () => {
      const order = [
        'hstack1',
        'vstack1',
        'text3',
        'text4',
        'hstack2',
        'text1',
        'text2',
        'button1',
        'moduleContainer1',
        'apiFetch',
      ];
      expect(appModel.allComponents.map(c => c.id)).toEqual(order);
    });

    it('detect duplicated dd', () => {
      try {
        new AppModel(DuplicatedIdSchema, registry);
      } catch (e: any) {
        expect(e.message).toBe('Duplicate component id: hstack1');
      }
    });
  });

  it('to schema', () => {
    const schema = appModel.toSchema();
    expect(AppSchema.spec.components).toStrictEqual(schema);
  });

  it('create component', () => {
    const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
    expect(newComponent.id).toEqual('text10');
    expect(newComponent.type).toEqual('core/v1/text');
    expect(newComponent.appModel).toBe(appModel);
  });

  it('create component with id', () => {
    const newComponent = appModel.createComponent(
      'core/v1/text' as ComponentType,
      'text1000' as ComponentId
    );
    expect(newComponent.id).toEqual('text1000');
  });

  it('get component', () => {
    const c = appModel.getComponentById('text1' as ComponentId);
    expect(c?.id).toEqual('text1');
  });
  it('get component doesnt exist', () => {
    const c = appModel.getComponentById('hello' as ComponentId);
    expect(c).toEqual(undefined);
  });

  it('append component to top level', () => {
    const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
    appModel.appendChild(newComponent);
    expect(appModel.allComponents.length).toBe(11);
    expect(appModel.topComponents[appModel.topComponents.length - 1].id).toBe(
      newComponent.id
    );
    expect(appModel.getComponentById(newComponent.id)).toBe(newComponent);
    expect(newComponent.appModel).toBe(appModel);
  });
  it('can append component from other appModel', () => {
    const appModel2 = new AppModel(AppSchema.spec.components, registry);
    const newComponent2 = appModel2.createComponent('core/v1/text' as ComponentType);
    expect(newComponent2.appModel).not.toBe(appModel);
    appModel.appendChild(newComponent2);
    expect(newComponent2.appModel).toBe(appModel);
  });

  describe('remove component', () => {
    const appModel = new AppModel(AppSchema.spec.components, registry);
    const origin = appModel.toSchema();
    appModel.removeComponent('text1' as any);
    it('remove component', () => {
      const newSchema = appModel.toSchema();
      expect(origin.length - 1).toEqual(newSchema.length);
      expect(newSchema.some(c => c.id === 'text1')).toBe(false);
    });
    it('remove top level component', () => {
      appModel.removeComponent('apiFetch' as any);
      const newSchema = appModel.toSchema();
      expect(origin.length - 2).toEqual(newSchema.length);
      expect(newSchema.some(c => c.id === 'text1')).toBe(false);
    });
    const newSchema = appModel.toSchema();
    it('keep immutable after removing component', () => {
      expect(origin).not.toBe(newSchema);
      expect(origin[0]).toBe(newSchema[0]);
    });
  });
});
