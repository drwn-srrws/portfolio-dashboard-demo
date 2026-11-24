import { useEffect, useState, JSX } from "react";
import { Input } from "../input";
import { Button } from "../button";

interface OnInputChange {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRowEditable?: boolean;
}

export interface EditableFieldProps {
  value: string | number | JSX.Element;
  isEditing?: boolean;
  isFieldEditable?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  formattingFunction?: (value: string | number) => string;
  id?: string | number;
}

const isAnEditableValue = (value: string | number | JSX.Element): boolean =>
  typeof value === "string" || typeof value === "number";

export const EditableField = ({
  value,
  onChange,
  isEditing = false,
  isFieldEditable = false,
  isRowEditable = false,
  inputProps,
  formattingFunction,
}: EditableFieldProps & OnInputChange) => {
  const isAllowedToEdit = isFieldEditable && isRowEditable;
  // Value is editable if the value is a string or boolean, or if it is currently undefined
  const isValueEditable = isAnEditableValue(value) || !value;
  const showInputs = isEditing && isAllowedToEdit && isValueEditable;

  return showInputs ? (
    <Input
      value={value as string | number}
      onChange={(e) => onChange(e)}
      className="mt-1 block"
      {...inputProps}
      data-testid="editable-field/input"
    />
  ) : (
    <div className="content-center">
      {formattingFunction && isAnEditableValue(value)
        ? formattingFunction(value as string | number)
        : value}
    </div>
  );
};

type OnChange = (newValues: EditableFieldProps[], index: number) => void;

export const EditableFieldGroup = ({
  fields,
  isRowEditable = false,
  onChange,
  index,
  gridColumns,
}: {
  fields: EditableFieldProps[];
  isRowEditable: boolean;
  index: number;
  onChange: OnChange;
  gridColumns?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copyOfFields, setCopyOfFields] = useState(fields);
  const [values, setValues] = useState<(string | number)[]>([]);

  useEffect(() => {
    setValues(fields.map((field) => field.value) as (string | number)[]);
  }, [fields]);

  return (
    <section
      className={`grid gap-2 py-1.5 ${gridColumns || "auto-cols-auto"}`}
      style={{ gridTemplateColumns: gridColumns }}
    >
      {fields.map((field, i) => (
        <EditableField
          key={JSON.stringify(field)}
          {...field}
          value={isEditing ? values[i] : field.value}
          isEditing={isEditing}
          isRowEditable={isRowEditable}
          onChange={(e) => {
            const newValues = [...values];
            newValues[i] = e.target.value;
            setValues(newValues);
          }}
          data-testid="editable-field-group/input"
        />
      ))}
      {isRowEditable && (
        <div className="flex items-end gap-2 h-fit mt-[5px]">
          <Button
            variant="outline"
            className="h-6 p-2 w-16"
            onClick={() => {
              if (isEditing) {
                const updatedFields = copyOfFields.map((field, i) => ({
                  ...field,
                  value: values[i],
                }));
                onChange(updatedFields, index);
                setIsEditing(false);
              } else setIsEditing(true);
            }}
            data-testid="editable-field-group/save"
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          {isRowEditable && isEditing && (
            <Button
              variant="outline"
              className="h-6 p-2 w-16"
              onClick={() => {
                setIsEditing(false);
                setCopyOfFields(fields);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export const EditableFieldGroups = ({
  fields,
  isRowEditable,
  labels,
  onChange,
  gridColumns,
}: {
  fields: EditableFieldProps[][];
  isRowEditable: boolean[];
  labels: string[];
  onChange: OnChange;
  gridColumns?: string;
}) => (
  <section className="flex flex-col">
    <header className="grid" style={{ gridTemplateColumns: gridColumns }}>
      {labels.map((label, i) => (
        <h4 className="text-sm font-semibold" key={label || i}>
          {label}
        </h4>
      ))}
    </header>
    <div>
      {fields.map((currFields, index) => (
        <EditableFieldGroup
          key={JSON.stringify(currFields)}
          index={index}
          isRowEditable={isRowEditable[index]}
          onChange={onChange}
          fields={currFields}
          gridColumns={gridColumns}
        />
      ))}
    </div>
  </section>
);
