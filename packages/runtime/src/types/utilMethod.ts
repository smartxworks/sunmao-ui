import { Static } from '@sinclair/typebox';
import { JSONSchema7 } from 'json-schema';
import { UIServices } from './application';

export interface UtilMethod<T extends JSONSchema7> {
  name: string;
  method: (parameters: Static<T>, services: UIServices) => void;
  parameters: T;
}

export type UtilMethodFactory = () => UtilMethod<any>[];
