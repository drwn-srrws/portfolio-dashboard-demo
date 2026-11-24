import { JSX } from "react";
import { Separator } from "../separator";
import { FieldContextProvider, useFieldContext } from "./field-provider";

export const FieldLabel = ({ children }: { children: string }) => {
  const { labelClasses } = useFieldContext();
  return <p className={`text-sm uppercase ${labelClasses}`}>{children}</p>;
};

export const FieldValue = ({ children }: { children: string }) => {
  const { fieldClasses } = useFieldContext();
  return <p className={`text-sm font-semibold ${fieldClasses}`}>{children}</p>;
};

export const Field = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col">
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value}</FieldValue>
    </div>
  );
};

export const FieldGroupContents = ({
  labels,
  values,
  labelClasses = "",
  fieldClasses = "",
}: {
  labels: string[];
  values: string[];
  labelClasses?: string;
  fieldClasses?: string;
}) => {
  const filteredLabelsAndValues = labels.filter((_, i) => !!values[i]);
  const filteredValues = values.filter((v) => !!v);

  return (
    <FieldContextProvider
      labelClasses={labelClasses}
      fieldClasses={fieldClasses}
    >
      <div>
        <div className="mb-4 flex w-full">
          {filteredLabelsAndValues.map((label, i) => (
            <div
              key={label}
              className="flex justify-between mr-2 last:mr-0 gap-2"
              style={{ width: 100 / filteredLabelsAndValues.length + "%" }}
            >
              <Field label={label} value={filteredValues[i]} />
              {i < filteredLabelsAndValues.length - 1 && (
                <Separator orientation="vertical" className="mr-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </FieldContextProvider>
  );
};

export const FieldGroupHeader = ({
  header,
  headerClasses,
  separatorClasses,
}: {
  header: JSX.Element | string;
  headerClasses?: string;
  separatorClasses?: string;
}) => (
  <section>
    <header
      className={`flex flex-row items-center gap-2 text-sm font-semibold ${headerClasses}`}
    >
      {header}
    </header>
    <Separator className={`my-2 ${separatorClasses}`} />
  </section>
);

export const FieldGroup = ({
  labels,
  values,
  header,
  labelClasses = "",
  fieldClasses = "",
}: {
  labels: string[] | string[][];
  values: string[] | string[][];
  header: JSX.Element;
  labelClasses?: string | string[];
  fieldClasses?: string | string[];
}) => (
  <>
    <FieldGroupHeader header={header} />
    {typeof labels[0] === "object" ? (
      (labels as string[][]).map((labelGroup: string[], i: number) => (
        <FieldGroupContents
          key={i}
          labels={labelGroup as string[]}
          values={values[i] as string[]}
          labelClasses={labelClasses[i]}
          fieldClasses={fieldClasses[i]}
        />
      ))
    ) : (
      <FieldGroupContents
        labels={labels as string[]}
        values={values as string[]}
        labelClasses={labelClasses as string}
        fieldClasses={fieldClasses as string}
      />
    )}
  </>
);
