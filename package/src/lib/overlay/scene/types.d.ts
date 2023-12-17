export type Transform = { x: number; y: number; width: number; height: number };
export type Sources = { tag: string; transform: Transform; options: Record<string, unknown> }[];
