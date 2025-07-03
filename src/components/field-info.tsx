import type { AnyFieldApi, FieldApi } from "@tanstack/react-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="font-medium text-[0.8rem] text-destructive">{field.state.meta.errors.join(", ")}</p>
      ) : null}
    </>
  );
}
