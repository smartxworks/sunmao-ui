import { ApplicationModel } from '../../src/AppModel/AppModel';
import {
  ComponentId,
  ComponentType,
} from '../../src/AppModel/IAppModel';
import {AppSchema} from './schema'

describe('AppModel test', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  it('init corectlly', () => {
    expect(appModel.allComponents.length).toBe(10)
    expect(appModel.topComponents.length).toBe(2)
  });

  it('components order', () => {
    expect(appModel.allComponents[0].id).toBe('hstack1')
    expect(appModel.allComponents[1].id).toBe('vstack1')
    expect(appModel.allComponents[2].id).toBe('text3')
    expect(appModel.allComponents[3].id).toBe('text4')
    expect(appModel.allComponents[4].id).toBe('hstack2')
    expect(appModel.allComponents[5].id).toBe('text1')
    expect(appModel.allComponents[6].id).toBe('text2')
    expect(appModel.allComponents[7].id).toBe('button1')
    expect(appModel.allComponents[8].id).toBe('moduleContainer1')
    expect(appModel.allComponents[9].id).toBe('apiFetch')
  });

  it('to schema', () => {
    const schema = appModel.toSchema();
    expect(AppSchema.spec.components).toStrictEqual(schema)
  })

  it('create component', () => {
    const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
    expect(newComponent.id).toEqual('text10');
    expect(newComponent.type).toEqual('core/v1/text');
    expect(newComponent.appModel).toBe(appModel);

  });
  it('create component with id', () => {
    const newComponent = appModel.createComponent('core/v1/text' as ComponentType, 'text1000' as ComponentId);
    expect(newComponent.id).toEqual('text1000');
  })

  it('get component', () => {
    const c = appModel.getComponentById('text1' as ComponentId);
    expect(c?.id).toEqual('text1');
  });
  it ('get component doesnt exist', () => {
    const c = appModel.getComponentById('hello' as ComponentId);
    expect(c).toEqual(undefined);
  })

  it('append component to top level', () => {
    const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
    appModel.appendChild(newComponent);
    expect(appModel.allComponents.length).toBe(11);
    expect(appModel.topComponents[appModel.topComponents.length - 1].id).toBe(newComponent.id);
    expect(appModel.getComponentById(newComponent.id)).toBe(newComponent);
    expect(newComponent.appModel).toBe(appModel);

  })
  it('can append component from other appModel', () => {
    const appModel2 = new ApplicationModel(AppSchema.spec.components);
    const newComponent2 = appModel2.createComponent('core/v1/text' as ComponentType);
    expect(newComponent2.appModel).not.toBe(appModel);
    appModel.appendChild(newComponent2);
    expect(newComponent2.appModel).toBe(appModel);
  })

  describe('remove component', () => {
    const appModel = new ApplicationModel(AppSchema.spec.components);
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
