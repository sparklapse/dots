import { fieldEditors } from "./editors/index.js";
import type { FieldEditor } from "./editors/index.js";

export type Fields = typeof fieldEditors;
export type FieldKeys = keyof Fields;
export type FieldComponents = Fields[FieldKeys];
export type FieldValues = NonNullable<
  ConstructorParameters<Fields[FieldKeys]>[0]["props"]
>["value"];

type FieldOptions = {
  editor?: FieldEditor;
};

export type Field<K extends FieldKeys = FieldKeys> = {
  type: K;
  value: NonNullable<ConstructorParameters<Fields[K]>[0]["props"]>["value"];
  editor: FieldEditor;
};

export const field = <K extends FieldKeys>(
  typeId: K,
  defaultValue: NonNullable<ConstructorParameters<Fields[K]>[0]["props"]>["value"],
  options?: FieldOptions,
): Field<K> => {
  const f: Partial<Field<K>> = {
    type: typeId,
    value: defaultValue,
    ...options,
  };

  if (!f.editor) f.editor = fieldEditors[typeId];
  if (!f.editor) throw new Error(`No editor found for field type ${typeId as string}`);

  return f as NonNullable<Field<K>>;
};
