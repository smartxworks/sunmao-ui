import { AppModel } from '../../src/AppModel/AppModel';
import {
  ComponentId,
  ComponentType,
  SlotName,
  TraitType,
} from '../../src/AppModel/IAppModel';
import { AppSchema, EventHandlerMockSchema } from './mock';
import { produce } from 'immer';
import { get } from 'lodash';
import { registry } from '../services';

describe('ComponentModel test', () => {
  it('compute component property', () => {
    const appModel = new AppModel(AppSchema.spec.components, registry);
    const button1 = appModel.getComponentById('button1' as ComponentId)!;
    expect(button1.allComponents.length).toEqual(1);
    expect(button1.appModel).toEqual(appModel);
    expect(button1.id).toEqual('button1');
    expect(button1.methods.map(m => m.name)).toEqual(['click', 'setValue', 'reset']);
    expect(button1.events).toEqual(['onClick']);
    expect(button1.styleSlots).toEqual(['content']);
    expect(button1.parentId).toEqual('hstack2');
    expect(button1.parentSlot).toEqual('content');
    expect(button1.prevSibling).toBe(appModel.getComponentById('text2' as ComponentId));
    expect(button1.nextSibling).toBe(null);
    expect(button1.rawProperties.text).toEqual({ raw: 'text', format: 'plain' });
    const apiFetch = appModel.getComponentById('apiFetch' as ComponentId)!;
    expect([...Object.keys(apiFetch.stateExample)]).toEqual(['fetch']);
    expect(apiFetch.methods[0].name).toEqual('triggerFetch');
  });
});

describe('update component property', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const text1 = appModel.getComponentById('text1' as any);
  text1!.updateComponentProperty('value', { raw: 'hello', format: 'plain' });
  text1!.updateComponentProperty('newProperty', "a property that didn't exist before");
  const newSchema = appModel.toSchema();

  it('update component properties', () => {
    expect(newSchema[5].properties.value).toEqual({ raw: 'hello', format: 'plain' });
  });

  it("update a new property that component don't have", () => {
    expect(newSchema[5].properties.newProperty).toEqual(
      "a property that didn't exist before"
    );
  });

  it('keep immutable after updating component properties', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    expect(origin[5]).not.toBe(newSchema[5]);
  });
});

describe('update event trait handlers(array) property', () => {
  const appModel = new AppModel(EventHandlerMockSchema, registry);
  const button1 = appModel.getComponentById('button1' as any)!;
  const oldHandlers = button1.traits[0].rawProperties.handlers;
  const newHandlers = produce(oldHandlers, (draft: any) => {
    draft[1].method.parameters.value = 'hello';
  });
  button1.updateTraitProperties(button1.traits[0].id, { handlers: newHandlers });
  const newSchema = appModel.toSchema();

  it('update trait array properties', () => {
    expect(
      get(newSchema[0].traits[0].properties, 'handlers[1].method.parameters.value')
    ).toEqual('hello');
  });
});

describe('append to another component', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const newComponent = appModel.createComponent('core/v1/text' as ComponentType);
  const parent = appModel.getComponentById('vstack1' as any)!;
  newComponent.appendTo(parent, 'content' as SlotName);
  expect(newComponent.parent).toBe(parent);
  expect(newComponent.parentId).toEqual('vstack1');
  expect(newComponent.parentSlot).toEqual('content');

  it('create slot trait', () => {
    expect(newComponent.traits[0].type).toEqual('core/v2/slot');
    expect(newComponent.traits[0].rawProperties).toEqual({
      container: { id: 'vstack1', slot: 'content' },
      ifCondition: true,
    });
  });
  it('update parent children', () => {
    expect(parent.children['content' as any]).toContain(newComponent);
    expect(newComponent.traits[0].rawProperties).toEqual({
      container: { id: 'vstack1', slot: 'content' },
      ifCondition: true,
    });
  });
  it('is in right place in allComponents', () => {
    expect(appModel.allComponents[4]).toBe(newComponent);
  });
  it('keep immutable after create component', () => {
    const newSchema = appModel.toSchema();
    expect(origin).not.toBe(newSchema);
    expect(origin.length).toBe(newSchema.length - 1);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    const newComponentSchema = newSchema[4];
    expect(newComponentSchema.id).toBe('text10');
    expect(newComponentSchema.traits[0].properties).toEqual({
      container: { id: 'vstack1', slot: 'content' },
      ifCondition: true,
    });
  });

  describe('append component to top level', () => {
    const appModel = new AppModel(AppSchema.spec.components, registry);
    const origin = appModel.toSchema();
    const text1 = appModel.getComponentById('text1' as any)!;
    it('append component to top level', () => {
      text1.appendTo();
      const newSchema = appModel.toSchema();
      expect(newSchema[newSchema.length - 1].id).toBe('text1');
      expect(newSchema.length).toBe(origin.length);
    });
  });
});

describe('append component as child to self', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const hstack1 = appModel.getComponentById('hstack1' as any)!;
  const text1 = appModel.getComponentById('text1' as any)!;
  it('append component to top level', () => {
    hstack1.appendChild(text1, 'content' as SlotName);
    const newSchema = appModel.toSchema();
    expect(newSchema[8].id).toBe('text1');
    expect(newSchema.length).toBe(origin.length);
  });
  it('append top level component', () => {
    const apiFetch = appModel.getComponentById('apiFetch' as any)!;
    hstack1.appendChild(apiFetch, 'content' as SlotName);
    const children = hstack1.children['content'];
    expect(children[children.length - 1].id).toBe('apiFetch');
  });
});

describe('add trait', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const text1 = appModel.getComponentById('text1' as any);
  text1!.addTrait('core/v1/state' as TraitType, { key: 'value' });
  const newSchema = appModel.toSchema();

  it('add trait', () => {
    expect(newSchema[5].traits[1].properties.key).toEqual('value');
  });
  it('keep immutable after adding trait', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    expect(origin[5]).not.toBe(newSchema[5]);
  });
});

describe('remove trait', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const text1 = appModel.getComponentById('text1' as any)!;
  text1!.removeTrait(text1.traits[0].id);
  const newSchema = appModel.toSchema();
  it('remove trait', () => {
    expect(newSchema[5].traits.length).toEqual(0);
  });

  it('keep immutable after adding trait', () => {
    expect(origin).not.toBe(newSchema);
    expect(origin[0]).toBe(newSchema[0]);
    expect(origin[1]).toBe(newSchema[1]);
    expect(origin[5]).not.toBe(newSchema[5]);
  });
});

describe('change component id', () => {
  const newId = 'newHstack1' as ComponentId;
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const hStack1 = appModel.getComponentById('hstack1' as ComponentId)!;
  hStack1.changeId(newId);
  const newSchema = appModel.toSchema();
  it('change component id', () => {
    expect(newSchema[0].id).toEqual(newId);
  });
  it('change children slot trait', () => {
    expect(newSchema[1].traits[0].properties.container).toEqual({
      id: newId,
      slot: 'content',
    });
    expect(newSchema[4].traits[0].properties.container).toEqual({
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
    expect(origin[4]).not.toBe(newSchema[4]);
    expect(origin[8]).not.toBe(newSchema[8]);
    expect(origin[2]).toBe(newSchema[2]);
    expect(origin[3]).toBe(newSchema[3]);
  });
});

describe('move component', () => {
  const appModel = new AppModel(AppSchema.spec.components, registry);
  const origin = appModel.toSchema();
  const hstack1 = appModel.getComponentById('hstack1' as ComponentId)!;
  const text1 = appModel.getComponentById('text1' as ComponentId)!;

  it('can move component', () => {
    const text2 = appModel.getComponentById('text2' as ComponentId)!;
    text1.moveAfter(text2);
    const newSchema = appModel.toSchema();
    expect(text1.parent!.children['content' as SlotName][0].id).toEqual('text2');
    expect(text1.parent!.children['content' as SlotName][1].id).toEqual('text1');
    expect(newSchema[5].id).toEqual('text2');
    expect(newSchema[6].id).toEqual('text1');
  });

  describe('can move top level component', () => {
    const apiFetch = appModel.getComponentById('apiFetch' as ComponentId)!;

    it('can get the next sibling of the top-level component', () => {
      expect(hstack1.nextSibling).toBe(apiFetch);
    });

    it('can move top level component', () => {
      hstack1.moveAfter(apiFetch);
      const newSchema = appModel.toSchema();
      expect(appModel.topComponents[0].id).toEqual('apiFetch');
      expect(appModel.topComponents[1].id).toEqual('hstack1');
      expect(newSchema[0].id).toEqual('apiFetch');
      expect(newSchema[1].id).toEqual('hstack1');
    });
  });

  it('can move component to the first', () => {
    hstack1.moveAfter(null);
    const newSchema = appModel.toSchema();
    expect(appModel.topComponents[0].id).toEqual('hstack1');
    expect(newSchema[0].id).toEqual('hstack1');
  });

  it('keep immutable after moving component', () => {
    const text2 = appModel.getComponentById('text2' as ComponentId)!;
    text2.moveAfter(text1);
    const newSchema = appModel.toSchema();
    expect(origin).not.toBe(newSchema);
    expect(origin.every((v, i) => v === newSchema[i])).toBe(true);
  });
});
