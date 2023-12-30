export type Transform = { x: number; y: number; width: number; height: number };
export type Source = {
  id: string;
  label: string;
  tag: string;
  editor: {
    locked: boolean;
  };
  transform: Transform;
  options: Record<string, unknown>;
};
export type Sources = Source[];
