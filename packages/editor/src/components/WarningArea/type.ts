import { EditorServices } from '../../types';

export type Props = {
  services: EditorServices;
};

export type Log = {
  id: string;
  type: string;
  eventType: string;
  componentId: string;
  name: string;
  parameters: any;
  triggerId: string;
};
export type DisplayedLog = {
  time: string;
  type: string;
  eventType: string;
  target: string;
  methodName: string;
  triggerId: string;
  parameters: any;
};
