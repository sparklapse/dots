import Text from "./Text.svelte";
import Image from "./Image.svelte";

export const SOURCES = {
  text: Text,
  image: Image,
};

export const SOURCE_LABELS: Record<keyof typeof SOURCES, string> = {
  text: "Text",
  image: "Image",
};

export type SourceType = keyof typeof SOURCES;

export type Source<T extends SourceType = SourceType> = {
  type: T;
  options: NonNullable<ConstructorParameters<(typeof SOURCES)[T]>[0]["props"]>["options"];
};

export type Scene = Array<Source<SourceType>>;
