import { fieldEditors } from "./editors/index.js";

export type Fields = typeof fieldEditors;
export type FieldKeys = keyof Fields;
export type FieldComponents = Fields[FieldKeys];
export type FieldValues = NonNullable<
  ConstructorParameters<Fields[FieldKeys]>[0]["props"]
>["value"];

export type Field<K extends FieldKeys = FieldKeys> = {
  type: K;
  value: NonNullable<ConstructorParameters<Fields[K]>[0]["props"]>["value"];
  props:
    | Omit<NonNullable<ConstructorParameters<Fields[K]>[0]["props"]>, "label" | "value">
    | object;
};

type FieldOptions<K extends FieldKeys = FieldKeys> = Field<K>["props"];

export const field = <K extends FieldKeys>(
  typeId: K,
  defaultValue: NonNullable<ConstructorParameters<Fields[K]>[0]["props"]>["value"],
  options?: FieldOptions<K>,
): Field<K> => {
  const f: Partial<Field<K>> = {
    type: typeId,
    value: defaultValue,
  };

  const { ...props } = options ?? {};

  f.props = props;

  return f as NonNullable<Field<K>>;
};
