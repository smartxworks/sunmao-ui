import { ApiService } from './apiService';
// import { createStandaloneToast } from '@chakra-ui/react';
// import {
//   ToastCloseParameterSchema,
//   ToastOpenParamterSchema,
// } from '../components/chakra-ui/Types/Toast';
// import { pickProperty } from '../utils/pickProperty';

export function mountUtilMethods(apiService: ApiService) {
  // let toast: ReturnType<typeof createStandaloneToast> | undefined = undefined;
  apiService.on('uiMethod', ({ componentId, name, parameters }) => {
    if (componentId === '$utils') {
      switch (name) {
        case 'alert':
          window.alert(parameters);
          break;
        // case 'toast.open':
        //   if (!toast) {
        //     toast = createStandaloneToast();
        //   }
        //   if (parameters) {
        //     toast(pickProperty(ToastOpenParamterSchema, parameters));
        //   }
        //   break;
        // case 'toast.close':
        //   if (!toast) {
        //     break;
        //   }
        //   if (!parameters) {
        //     toast.closeAll();
        //   } else {
        //     const closeParameters = pickProperty(ToastCloseParameterSchema, parameters);
        //     if (closeParameters.id !== undefined) {
        //       toast.close(closeParameters.id);
        //     } else {
        //       toast.closeAll(closeParameters);
        //     }
        //   }
        //   break;
        default:
          break;
      }
      if (name in window) {
        const method = window[name as keyof Window];
        if (typeof method === 'function') {
          method(parameters);
        }
      }
    }

    if (componentId === '$module') {
      apiService.send('moduleEvent', {
        fromId: parameters.moduleId,
        eventType: name,
      });
    }
  });
}
