import React, { FC } from "react";
import cn from "classnames";
import { LABEL_STYLE_VARIANTS } from "./constants";
import { FormFieldVariants } from "./types";

interface Props {
  children: string;
  className?: string;
  variant?: FormFieldVariants;
  htmlFor?: string;
}

export const Label: FC<Props> = ({
  className,
  children,
  variant = FormFieldVariants.PRIMARY,
  htmlFor,
}) => {
  if (!children) return null;

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "whitespace-nowrap",
        LABEL_STYLE_VARIANTS[variant],
        className
      )}
    >
      {children}
    </label>
  );
};
