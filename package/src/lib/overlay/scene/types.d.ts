export type Transform = { x: number; y: number; width: number; height: number };
export type Source = {
  id: string;
  label: string;
  tag: string;
  transform: Transform;
  options: Record<string, unknown>;
};
export type Sources = Source[];
