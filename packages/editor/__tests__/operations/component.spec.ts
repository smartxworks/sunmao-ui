import { AppModel } from '../../src/AppModel/AppModel';
import { ComponentId } from '../../src/AppModel/IAppModel';
import { registry } from '../services';
import {
  AppSchema,
  PasteComponentWithChildrenSchema,
  PasteComponentWithCopyComponent,
} from './mock';
import { genOperation } from '../../src/operations';
import { RootId } from '../../src/constants';

describe('Component operations', () => {
  it('Change component id', () => {
    const appModel = new AppModel(AppSchema.spec.components, registry);

    expect(appModel.getComponentById('text1' as ComponentId)?.id).toBe('text1');
    const operation = genOperation(registry, 'modifyComponentId', {
      componentId: 'text1',
      newId: 'text2',
    });
    operation.do(appModel);
    expect(appModel.getComponentById('text2' as ComponentId)?.id).toBe('text2');
  });

  it(`Paste component with children and the children's slot trait is correct`, () => {
    const appModel = new AppModel(
      PasteComponentWithChildrenSchema.spec.components,
      registry
    );

    const pasteComponent = [
      appModel.getComponentById('stack5' as ComponentId)!.toSchema(),
      appModel.getComponentById('text6' as ComponentId)!.toSchema(),
    ];
    const operation = genOperation(registry, 'pasteComponent', {
      parentId: 'stack3',
      slot: 'content',
      component: new AppModel(pasteComponent, registry).getComponentById(
        'stack5' as ComponentId
      )!,
    });
    operation.do(appModel);
    expect(appModel.getComponentById('text6_copy0' as ComponentId)?.parent?.id).toBe(
      'stack5_copy0'
    );
    expect(
      appModel.getComponentById('text6_copy0' as ComponentId)?.traits[0].rawProperties
        .container.id
    ).toBe('stack5_copy0');
  });

  it(`Paste toplevel component with children and the children's slot trait is correct`, () => {
    const appModel = new AppModel(
      PasteComponentWithChildrenSchema.spec.components,
      registry
    );

    const pasteComponent = [
      appModel.getComponentById('stack3' as ComponentId)!.toSchema(),
      appModel.getComponentById('stack5' as ComponentId)!.toSchema(),
      appModel.getComponentById('text6' as ComponentId)!.toSchema(),
    ];
    const operation = genOperation(registry, 'pasteComponent', {
      parentId: RootId,
      slot: '',
      component: new AppModel(pasteComponent, registry).getComponentById(
        'stack3' as ComponentId
      )!,
    });
    operation.do(appModel);
    expect(appModel.getComponentById('stack3_copy0' as ComponentId)?.parent).toBeNull();
    expect(appModel.getComponentById('text6_copy0' as ComponentId)?.parent?.id).toBe(
      'stack5_copy0'
    );
    expect(
      appModel.getComponentById('text6_copy0' as ComponentId)?.traits[0].rawProperties
        .container.id
    ).toBe('stack5_copy0');
  });

  // issue #679
  it(`Unique ids can be generated and components can be copied correctly when it contain copied components`, () => {
    const appModel = new AppModel(
      PasteComponentWithCopyComponent.spec.components,
      registry
    );

    const pasteComponent = [
      appModel.getComponentById('stack5' as ComponentId)!.toSchema(),
      appModel.getComponentById('text6' as ComponentId)!.toSchema(),
    ];
    const operation = genOperation(registry, 'pasteComponent', {
      parentId: 'stack3',
      slot: 'content',
      component: new AppModel(pasteComponent, registry).getComponentById(
        'stack5' as ComponentId
      )!,
    });
    operation.do(appModel);
    const allComponentIds = appModel.allComponents.map(c => c.id);

    expect(allComponentIds.length).toEqual(new Set(allComponentIds).size);
  });
});
