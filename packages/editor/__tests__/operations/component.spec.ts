import { AppModel } from '../../src/AppModel/AppModel';
import { ComponentId } from '../../src/AppModel/IAppModel';
import { registry } from '../sevices';
import { AppSchema } from './mock';
import { genOperation } from '../../src/operations';

describe('Component operations', ()=> {
    it('Change component id', ()=> {
        const appModel = new AppModel(AppSchema.spec.components, registry);

        expect(appModel.getComponentById('text1' as ComponentId).id).toBe('text1');
        const operation = genOperation(registry, 'modifyComponentId', {
            componentId: 'text1',
            newId: 'text2',
        });
        operation.do(appModel);
        expect(appModel.getComponentById('text2' as ComponentId).id).toBe('text2');
    })
})
