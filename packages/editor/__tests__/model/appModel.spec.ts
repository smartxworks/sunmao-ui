import { Application } from '@sunmao-ui/core';
import { ApplicationModel } from '../../src/operations/AppModel/AppModel';
import {
  ComponentId,
  ComponentType,
  SlotName,
  TraitType,
} from '../../src/operations/AppModel/IAppModel';

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
      {
        id: 'hstack3',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
    ],
  },
};
describe('change component properties', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const text1 = appModel.getComponentById('text1' as any);
  text1!.changeComponentProperty('value', { raw: 'hello', format: 'md' });
  const newSchema = appModel.toJS();

  it('change component properties', () => {
    expect(newSchema[2].properties.value).toEqual({ raw: 'hello', format: 'md' });
  });

  it('keep immutable after changing component properties', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    expect(origin[2]).not.toBe(newSchema[2]);
  });
});

describe('remove component', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  appModel.removeComponent('text1' as any);
  const newSchema = appModel.toJS();
  it('remove component', () => {
    expect(origin.length - 1).toEqual(newSchema.length);
    expect(newSchema.some(c => c.id === 'text1')).toBe(false);
  });
  it('keep immutable after removing component', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
  });
});

describe('create component', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
  it('create component', () => {
    expect(newComponent.id).toEqual('text5');
  });
  describe('append component to parent', () => {
    const parent = appModel.getComponentById('vstack1' as any)!;
    newComponent.appendTo(parent, 'content' as SlotName);
    expect(newComponent.parent).toBe(parent);
    expect(newComponent.parentId).toEqual('vstack1');
    expect(newComponent.parentSlot).toEqual('content');

    it('create slot trait', () => {
      expect(newComponent.traits[0].type).toEqual('core/v1/slot');
      expect(newComponent.traits[0].rawProperties).toEqual({
        container: { id: 'vstack1', slot: 'content' },
      });
    });
    it('update parent children', () => {
      expect(parent.children['content' as any]).toContain(newComponent);
      expect(newComponent.traits[0].rawProperties).toEqual({
        container: { id: 'vstack1', slot: 'content' },
      });
    });
    it('update add model cache', () => {
      expect(appModel.allComponents[appModel.allComponents.length - 1]).toBe(
        newComponent
      );
    });
    it('keep immutable after create component', () => {
      const newSchema = appModel.toJS();
      expect(origin).not.toBe(newSchema);
      expect(origin.length).toBe(newSchema.length - 1);
      expect(origin.every((v, i) => v === newSchema[i])).toBe(true);
      const newComponentSchema = newSchema[newSchema.length - 1];
      expect(newComponentSchema.id).toBe('text5');
      expect(newComponentSchema.traits[0].properties).toEqual({
        container: { id: 'vstack1', slot: 'content' },
      });
    });
  });
});

describe('append component', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const text1 = appModel.getComponentById('text1' as any);
  it('append component to top level', () => {
    text1.appendTo()
    const newSchema = appModel.toJS();
    expect(newSchema[newSchema.length - 1].id).toBe('text1');
    expect(newSchema.length).toBe(origin.length);
  })
})

describe('add trait', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const text1 = appModel.getComponentById('text1' as any);
  text1!.addTrait('core/v1/state' as TraitType, { key: 'value' });
  const newSchema = appModel.toJS();

  it('add trait', () => {
    expect(newSchema[2].traits[1].properties.key).toEqual('value');
  });
  it('keep immutable after adding trait', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    expect(origin[2]).not.toBe(newSchema[2]);
  });
});

describe('remove trait', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const text1 = appModel.getComponentById('text1' as any)!;
  text1!.removeTrait(text1.traits[0].id);
  const newSchema = appModel.toJS();
  it('remove trait', () => {
    expect(newSchema[2].traits.length).toEqual(0);
  });

  it('keep immutable after adding trait', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    expect(origin[2]).not.toBe(newSchema[2]);
  });
});

describe('change component id', () => {
  const newId = 'newHstack1' as ComponentId;
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const hStack1 = appModel.getComponentById('hstack1' as ComponentId)!;
  hStack1.changeId(newId);
  const newSchema = appModel.toJS();
  it('change component id', () => {
    expect(newSchema[0].id).toEqual(newId);
  });
  it('change children slot trait', () => {
    expect(newSchema[1].traits[0].properties.container).toEqual({
      id: newId,
      slot: 'content',
    });
    expect(newSchema[5].traits[0].properties.container).toEqual({
      id: newId,
      slot: 'content',
    });
    expect(newSchema[8].traits[0].properties.container).toEqual({
      id: newId,
      slot: 'content',
    });
  });

  it('keep immutable after changing component id', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).not.toBe(newSchema[0]);
    expect(origin[1]).not.toBe(newSchema[1]);
    expect(origin[2]).toBe(newSchema[2]);
    expect(origin[3]).toBe(newSchema[3]);
  });
});

describe('move component', () => {
  const appModel = new ApplicationModel(AppSchema.spec.components);
  const origin = appModel.toJS();
  const hstack1 = appModel.getComponentById('hstack1' as ComponentId)!;
  const text1 = appModel.getComponentById('text1' as ComponentId)!;

  it('can move component', () => {
    text1.moveAfter('text2' as ComponentId);
    const newSchema = appModel.toJS();
    expect(text1.parent!.children['content' as SlotName][0].id).toEqual('text2');
    expect(text1.parent!.children['content' as SlotName][1].id).toEqual('text1');
    expect(newSchema[2].id).toEqual('text2');
    expect(newSchema[3].id).toEqual('text1');
  });

  it('can move top level component', () => {
    hstack1.moveAfter('hstack3' as ComponentId);
    const newSchema = appModel.toJS();
    expect(appModel.model[0].id).toEqual('hstack3');
    expect(appModel.model[1].id).toEqual('hstack1');
    expect(newSchema[8].id).toEqual('hstack3');
    expect(newSchema[9].id).toEqual('hstack1');
  });
  it('can move component to the first', () => {
    hstack1.moveAfter(null);
    const newSchema = appModel.toJS();
    expect(appModel.model[0].id).toEqual('hstack1');
    expect(newSchema[0].id).toEqual('hstack1');
  });

  it('keep immutable after moving component', () => {
    const text2 = appModel.getComponentById('text2' as ComponentId)!;
    text2.moveAfter('text1' as ComponentId);
    const newSchema = appModel.toJS();
    expect(origin).not.toBe(newSchema);
    expect(origin.every((v, i) => v === newSchema[i])).toBe(true);
  });
});
