import { fieldEditors } from "./editors/index.js";
import type { FieldEditor } from "./types.js";

type FieldOptions = {
  editor?: FieldEditor;
};

export type Field = {
  type: keyof FieldEditor | string;
  value: any;
  editor: FieldEditor;
};

export const field = (
  typeId: keyof FieldEditor | string,
  defaultValue: any,
  options?: FieldOptions,
): Field => {
  let f: Partial<Field> = {
    type: typeId,
    value: defaultValue,
    ...options,
  };

  if (!f.editor) f.editor = fieldEditors[typeId];
  if (!f.editor) throw new Error(`No editor found for field type ${typeId as string}`);

  return f as NonNullable<Field>;
};
