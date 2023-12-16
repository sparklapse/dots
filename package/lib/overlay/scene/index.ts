export type Transform = { x: number; y: number; width: number; height: number };
export type Sources = { tag: string; transform: Transform; options: any }[];

// TODO: Rename to build web scenes
export const buildScene = (sources: Sources) => {
  let scene = "<dots-screen>";

  for (const source of sources) {
    const props = Object.entries({ ...source.transform, ...source.options })
      .map(([key, value]) => {
        if (typeof value === "boolean" && !value) return "";
        return `${key}="${value}"`;
      })
      .join(" ");
    scene += `<${source.tag} ${props}></${source.tag}>`;
  }

  scene += "</dots-screen>";

  return scene;
};

// TODO: Create more abstract and feature rich scene management
// Scene are a JSON structure that can be built into a format, usually html.
// There will also be an OBS scene builder that will build smaller web scenes and define OBS sources
// Builders can be run in realtime to update and change scenes in realtime.