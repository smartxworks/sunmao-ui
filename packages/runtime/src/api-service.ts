import mitt from 'mitt';

const emitter = mitt<{
  /**
   * @description: trigger component's method
   * @example: { componentId: "btn1", name: "click" }
   */
  uiMethod: {
    componentId: string;
    name: string;
    parameters?: any;
  };
}>();

export const apiService = {
  on: emitter.on,
  off: emitter.off,
  send: emitter.emit,
};
