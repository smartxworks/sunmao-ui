export type Metadata = {
  name: string;
  description?: string;
};

export type ComponentMetadata = Metadata & {
  isDraggable: boolean;
  isResizable: boolean;
  displayName: string;
  icon?: string;
  exampleProperties: Record<string, unknown>;
  exampleSize: [number, number];
};
