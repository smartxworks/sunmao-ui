export type Metadata<
  TAnnotations = Record<string, unknown>,
  TExample = Record<string, any>
> = {
  name: string;
  description?: string;
  annotations?: Record<string, any> & TAnnotations;
  exampleProperties?: TExample;
  isDataSource?: boolean;
};

type ComponentCategory =
  | (string & {})
  | 'Layout'
  | 'Input'
  | 'Display'
  | 'Advance'
  | undefined;

export type ComponentMetadata<TExample = Record<string, any>> = Metadata<
  { category?: ComponentCategory },
  TExample
> & {
  // TODO:(yanzhen): move to annotations
  displayName: string;
  icon?: string;
};
