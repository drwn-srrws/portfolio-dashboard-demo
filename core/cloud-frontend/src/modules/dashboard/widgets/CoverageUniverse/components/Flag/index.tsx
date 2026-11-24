import { cva, VariantProps } from "class-variance-authority";
import { Icon, IconNameType } from "@components/Icon/Icon";
import { Button, ButtonProps } from "@components/ui";

const variants = cva("", {
  variants: {
    color: { red: "", blue: "" },
    active: { true: "", false: "" },
  },
  compoundVariants: [
    {
      color: "red",
      active: true,
      className: "fill-red-500 text-red-500",
    },
    {
      color: "blue",
      active: true,
      className: "fill-blue-500 text-blue-500",
    },
    {
      color: "red",
      active: false,
      className: "text-neutral-500",
    },
    {
      color: "blue",
      active: false,
      className: "text-neutral-500",
    },
  ],
});

export interface FlagProps
  extends VariantProps<typeof variants>,
    Omit<ButtonProps, "color"> {
  active: boolean;
  icon: IconNameType;
}

export type FlagColor = NonNullable<FlagProps["color"]>;
export type FlagActive = NonNullable<FlagProps["active"]>;

export const Flag = ({ icon, active, color, ...props }: FlagProps) => {
  return (
    <Button {...props} variant="ghost" size="icon">
      <Icon name={icon} size="lg" className={variants({ active, color })} />
    </Button>
  );
};
