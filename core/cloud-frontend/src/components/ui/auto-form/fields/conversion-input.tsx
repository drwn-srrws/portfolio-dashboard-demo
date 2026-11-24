import { Input } from "@components/ui/input";
import { useRef, useState } from "react";

interface CustomInputProps {
  "data-testid"?: string;
}

interface InputType {
  label: string;
  type: "number" | "text";
  min?: number;
  max?: number;
}

export interface ConversionInputProps<TContext> {
  isRequired?: boolean;
  classes?: string;
  inputA: InputType;
  inputB: InputType;
  context: TContext;
  convertAToB: (value: string, context: TContext) => string | number;
  convertBToA: (value: string, context: TContext) => string | number;
  value: string;
}

export default function AutoFormConversionInput<TContext>({
  fieldProps: { required, conversionInput },
  field: { onChange },
  fieldConfigItem: { inputProps },
}: {
  fieldProps: {
    required: boolean;
    conversionInput: ConversionInputProps<TContext>;
  };
  field: {
    onChange: (value: string | number) => void;
  };
  fieldConfigItem: {
    inputProps: CustomInputProps;
  };
}) {
  const { convertAToB, convertBToA, classes, inputA, inputB, context, value } =
    conversionInput;

  const isRequired = required;

  const lastTouched = useRef<"a" | "b">("a");
  const [valueOfB, setValueOfB] = useState<string | number>(
    convertAToB(value, context)
  );

  const { label, ...inputAProps } = inputA;
  const { label: labelB, ...inputBProps } = inputB;

  const isValueAOutsideOfMinMaxRange = (value: string) => {
    if (inputA.type === "number") {
      if (value === "") {
        onChange(inputA.min!);
        const v = convertAToB(inputA.min!.toString(), context);
        setValueOfB(v);
        return true;
      }
      const vAsNumber = parseInt(value);

      if (inputA.min !== undefined && vAsNumber <= inputA.min) {
        onChange(inputA.min!);
        const v = convertAToB(inputA.min!.toString(), context)?.toString();
        setValueOfB(v);
        return true;
      }

      if (inputA.max && vAsNumber > inputA.max) {
        onChange(inputA.max!);
        return true;
      }
    }
    return false;
  };

  const isValueBOutsideOfMinMaxRange = (value: string) => {
    if (inputB.type === "number") {
      const vAsNumber = parseInt(value);

      if (
        (inputB.min !== undefined && vAsNumber < inputB.min) ||
        isNaN(vAsNumber)
      ) {
        onChange(convertBToA(inputB.min!.toString(), context));
        setValueOfB(inputB.min!);
        return true;
      }

      if (inputB.max && vAsNumber > inputB.max) {
        onChange(convertBToA(inputB.max!.toString(), context));
        setValueOfB(inputB.max);
        return true;
      }
    }
    return false;
  };

  return (
    <div className={`flex justify-between space-x-2 ${classes}`}>
      <div>
        <label>
          {inputA.label}{" "}
          {isRequired && <span className="text-destructive">*</span>}
        </label>
        <Input
          required={isRequired}
          className="w-40"
          {...inputAProps}
          value={value}
          onBlur={(e) => isValueAOutsideOfMinMaxRange(e.target.value)}
          pattern=""
          data-testid={inputProps["data-testid"]}
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            lastTouched.current = "a";
            const v = e.target.value;

            if (isValueAOutsideOfMinMaxRange(v)) return;
            if (v === "" && inputA.type === "number") onChange(inputA.min!);

            const formValue = inputA.type === "number" ? Number(v) : v;
            onChange(formValue);
            const newB = convertAToB(v, context);
            setValueOfB(newB);
          }}
        />
      </div>
      <p className="self-center italic mt-6">or</p>
      <div>
        <label>{inputB.label}</label>
        <Input
          required={isRequired}
          className="w-40"
          {...inputBProps}
          // disabled={!context}
          disabled={true}
          value={!value.length ? "" : valueOfB}
          onBlur={(e) => isValueBOutsideOfMinMaxRange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            lastTouched.current = "b";
            let v = e.target.value;

            if (isValueBOutsideOfMinMaxRange(v)) return;

            setValueOfB(v);
            const underlying = convertBToA(v, context);
            const formValue =
              inputA.type === "number" ? Number(underlying) : underlying;

            onChange(formValue);
          }}
        />
      </div>
    </div>
  );
}
