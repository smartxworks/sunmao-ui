import { Type } from '@sinclair/typebox';
import { UtilMethod } from '../types/utilMethod';

const ScrollToComponentMethodParameters = Type.Object({
  componentId: Type.String(),
});

const ScrollToComponentMethod: UtilMethod<typeof ScrollToComponentMethodParameters> = {
  name: 'scrollToComponent',
  method(parameters, services) {
    if (!parameters) return;
    const ele = services.eleMap.get(parameters?.componentId);
    if (ele) {
      ele.scrollIntoView({ behavior: 'smooth' });
    }
  },
  parameters: ScrollToComponentMethodParameters,
};

export default ScrollToComponentMethod;
