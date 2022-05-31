import { UIServices } from './application';
import { RuntimeUtilMethod } from '@sunmao-ui/core';

export type UtilMethodImpl<T = any> = (parameters: T, services: UIServices) => void;

export type ImplementedUtilMethod<T = any> = RuntimeUtilMethod & {
  impl: UtilMethodImpl<T>;
};

export type UtilMethodFactory = () => ImplementedUtilMethod<any>[];
