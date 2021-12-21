import { Application, ApplicationComponent } from '@sunmao-ui/core';
import { ApplicationFixture } from '../../__fixture__/application';
import { AdjustComponentOrderLeafOperation } from '../../src/operations/leaf/component/adjustComponentOrderLeafOperation';
import { ApplicationModel } from '../../src/operations/AppModel/AppModel';
import { ComponentType } from '../../src/operations/AppModel/IAppModel';
const AppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'dialog_component', description: 'dialog component example' },
  spec: {
    components: [
      {
        id: 'hstack1',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
      {
        id: 'vstack1',
        type: 'chakra_ui/v1/vstack',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text1',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text2',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button1',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'hstack2',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', align: '' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text3',
        type: 'core/v1/text',
        properties: { value: { raw: 'VM1', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'vstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text4',
        type: 'core/v1/text',
        properties: { value: { raw: '虚拟机', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'vstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'moduleContainer1',
        type: 'core/v1/moduleContainer',
        properties: { id: 'myModule', type: 'custom/v1/module' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
    ],
  },
};
  describe('change component properties', () => {
    const appModel = new ApplicationModel(AppSchema.spec.components);
    const origin = appModel.json;
    const text1 = appModel.getComponentById('text1' as any);
    text1!.changeComponentProperty('value', { raw: 'hello', format: 'md' });
    const newSchema = appModel.json;
    
    expect(newSchema[2].properties.value).toEqual({ raw: 'hello', format: 'md' });
    it ('keep immutable after changing component properties', () => {
      expect(origin).not.toBe(newSchema);
      expect(origin[0]).toBe(newSchema[0]);
      expect(origin[1]).toBe(newSchema[1]);
      expect(origin[2]).not.toBe(newSchema[2]);
    })
  });

describe('create component', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.json;
  const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
  expect(newComponent.id).toEqual('text5');
  describe('append component to parent', () => {
    const parent = appModel.getComponentById('vstack1' as any)!;
    newComponent.appendTo('content' as any, parent);
    expect(newComponent.parent).toBe(parent);
    expect(newComponent.parentId).toEqual('vstack1');
    expect(newComponent.parentSlot).toEqual('content');

    it('create slot trait', () => {
      expect(newComponent.traits[0].type).toEqual('core/v1/slot');
      expect(newComponent.traits[0].properties).toEqual({
        container: { id: 'vstack1', slot: 'content' },
      });
    });
    it('update parent children', () => {
      expect(parent.children['content' as any]).toContain(newComponent);
      expect(newComponent.traits[0].properties).toEqual({
        container: { id: 'vstack1', slot: 'content' },
      });
    });
    it('update add model cache', () => {
      expect(appModel.allComponents[appModel.allComponents.length - 1]).toBe(newComponent);
    });
    it ('keep immutable after create component', () => {
      const newSchema = appModel.json;
      expect(origin).not.toBe(newSchema);
      expect(origin.length).toBe(newSchema.length - 1);
      expect(origin.every((v, i) => v === newSchema[i])).toBe(true);
      const newComponentSchema = newSchema[newSchema.length - 1];
      expect(newComponentSchema.id).toBe('text5');
      expect(newComponentSchema.traits[0].properties).toEqual({
        container: { id: 'vstack1', slot: 'content' },
      });
    })
  });
});
