import { apiService } from './api-service';

export function mountUtilMethods() {
  apiService.on('uiMethod', ({ componentId, name, parameters }) => {
    if (componentId !== '$utils') {
      return;
    }

    switch (name) {
      case 'alert':
        window.alert(parameters);
        break;
      default:
        break;
    }
  });
}
