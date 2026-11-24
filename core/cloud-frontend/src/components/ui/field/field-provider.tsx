import React, { createContext, JSX } from "react";

interface FieldContextProps {
  labelClasses?: string;
  fieldClasses?: string;
}
export const FieldContext = createContext<FieldContextProps>(
  {} as FieldContextProps
);

export const FieldContextProvider = ({
  children,
  labelClasses,
  fieldClasses,
}: {
  children: JSX.Element;
  labelClasses?: string;
  fieldClasses?: string;
}) => {
  return (
    <FieldContext.Provider value={{ labelClasses, fieldClasses }}>
      {children}
    </FieldContext.Provider>
  );
};

export const useFieldContext = () => {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error("useFieldContext must be used within a FieldProvider");
  }

  return context;
};
