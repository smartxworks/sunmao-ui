import { apiService } from './api-service';
import { createStandaloneToast } from '@chakra-ui/react';
import {
  ToastCloseParameterSchema,
  ToastOpenParamterSchema,
} from './components/chakra-ui/Types/Toast';
import { pickProperty } from './utils/pickProperty';

export function mountUtilMethods() {
  let toast: ReturnType<typeof createStandaloneToast> | undefined = undefined;
  apiService.on('uiMethod', ({ componentId, name, parameters }) => {
    if (componentId !== '$utils') {
      return;
    }
    switch (name) {
      case 'alert':
        window.alert(parameters);
        break;
      case 'toast.open':
        if (!toast) {
          toast = createStandaloneToast();
        }
        if (parameters) {
          toast(pickProperty(ToastOpenParamterSchema, parameters));
        }
        break;
      case 'toast.close':
        if (!toast) {
          break;
        }
        if (!parameters) {
          toast.closeAll();
        } else {
          const closeParameters = pickProperty(
            ToastCloseParameterSchema,
            parameters
          );
          if (closeParameters.id !== undefined) {
            toast.close(closeParameters.id);
          } else {
            toast.closeAll(closeParameters);
          }
        }
        break;
      default:
        break;
    }
  });
}
