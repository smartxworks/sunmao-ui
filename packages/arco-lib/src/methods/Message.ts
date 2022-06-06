import { implementUtilMethod } from '@sunmao-ui/runtime';
import { Type } from '@sinclair/typebox';
import { Message as BaseMessage } from '@arco-design/web-react';
import { StringUnion } from '@sunmao-ui/shared';

const ParameterSpec = Type.Object({
  type: StringUnion(['info', 'success', 'warning', 'error', 'normal', 'loading'], {
    defaultValue: 'info',
  }),
  content: Type.String({
    defaultValue: 'info',
  }),
  position: StringUnion(['top', 'bottom'], {
    defaultValue: 'top',
  }),
  closable: Type.Boolean({
    defaultValue: false,
  }),
  duration: Type.Number({ defaultValue: 1000 }),
});

export const MessageUtilMethodFactory = () => {
  const Message = implementUtilMethod({
    version: 'arco/v1',
    metadata: {
      name: 'message',
    },
    spec: {
      parameters: ParameterSpec,
    },
  })(parameters => {
    const { type, content, duration, ...rest } = parameters;
    const Message = BaseMessage[type];

    Message({
      className: type,
      content,
      duration,
      ...rest,
    });
  });

  return [Message];
};
