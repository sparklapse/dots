export type Transform = { x: number; y: number; width: number; height: number };
export type Sources = { tag: string; transform: Transform; options: any }[];

export const buildScene = (sources: Sources) => {
  let scene = "<dots-screen>";

  for (const source of sources) {
    const props = Object.entries({ ...source.transform, ...source.options })
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
    scene += `<${source.tag} ${props}></${source.tag}>`;
  }

  scene += "</dots-screen>";

  return scene;
};
