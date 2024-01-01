export type Transform = { x: number; y: number; width: number; height: number };
export type Source<O extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  label: string;
  tag: string;
  editor: {
    locked: boolean;
  };
  transform: Transform;
  options: O;
};
export type Sources = Source[];
