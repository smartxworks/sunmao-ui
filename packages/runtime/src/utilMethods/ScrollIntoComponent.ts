import { Type } from '@sinclair/typebox';
import { implementUtilMethod } from '../utils/buildKit';

const ScrollToComponentMethodParameters = Type.Object({
  componentId: Type.String(),
});

export default implementUtilMethod({
  version: 'core/v1',
  metadata: {
    name: 'scrollToComponent',
  },
  spec: {
    parameters: ScrollToComponentMethodParameters,
  },
})((parameters, services) => {
  if (!parameters) return;
  const ele = services.eleMap.get(parameters?.componentId);
  if (ele) {
    ele.scrollIntoView({ behavior: 'smooth' });
  }
});
