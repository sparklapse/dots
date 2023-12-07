type Props = object & { x: number; y: number; width: number; height: number };
export type Sources = { tag: string; props: Props }[];

export const buildScene = (sources: Sources) => {
  let scene = "<dots-screen>";

  for (const source of sources) {
    const props = Object.entries(source.props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
    scene += `<${source.tag} ${props}></${source.tag}>`;
  }

  scene += "</dots-screen>";

  return scene;
};
