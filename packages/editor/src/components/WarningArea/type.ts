import { EditorServices } from '../../types';

export type Props = {
  services: EditorServices;
};

export type Event = {
  componentId: string;
  name: string;
  parameters: any;
  triggerId: string;
};
export type EventLog = {
  time: string;
  type: string;
  target: string;
  methodName: string;
  triggerId: string;
  parameters: any;
};
