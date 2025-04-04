import React, { FC } from "react";
import cn from "classnames";
import { IRenderFormField } from "../../@types/form";

interface Props
  extends Pick<
    IRenderFormField,
    "className" | "fieldClassName" | "labelClassName" | "variant"
  > {
  disabled?: boolean;
  fields: IRenderFormField[];
}

export const RenderFormFields: FC<Props> = ({
  fields = [],
  className,
  fieldClassName,
  labelClassName,
  ...props
}) => (
  <>
    {fields.map(({ component: Field, ...field }) => (
      <Field
        key={field.name}
        className={cn(className, field.className)}
        fieldClassName={cn(fieldClassName, field.fieldClassName)}
        labelClassName={cn(labelClassName, field.labelClassName)}
        {...field}
        {...props}
      />
    ))}
  </>
);
