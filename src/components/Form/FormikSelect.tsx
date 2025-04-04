import React, { FC } from "react";
import cn from "classnames";
import { useField } from "formik";
import { FormFieldVariants } from "./types";
import { TEXT_INPUT_STYLE_VARIANTS } from "./constants";
import { FormField } from ".";

export interface ISelectInputProps {
  id?: string;
  name: string;
  label?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  variant?: FormFieldVariants;
  isShownError?: boolean;
  error?: string;
}

export const SelectInput: FC<ISelectInputProps> = ({
  className,
  fieldClassName,
  labelClassName,
  id,
  label,
  variant = FormFieldVariants.PRIMARY,
  options,
  placeholder,
  disabled,
  isShownError,
  error,
  ...props
}) => {
  const [field, meta] = useField(props.name); // Подключаем Formik
  const fieldId = id || props.name;

  const combinedClassNames = cn(
    "w-full outline-none disabled:bg-[#D0D5DD33] disabled:cursor-default disabled:border-[#D0D5DD33]",
    TEXT_INPUT_STYLE_VARIANTS[variant],
    className
  );

  // Используем значения и обработчики из Formik
  const hasError = meta.touched && meta.error;

  return (
    <FormField
      className={fieldClassName}
      labelClassName={labelClassName}
      variant={variant}
      label={label}
      labelFor={fieldId}
      // isShownError={isShownError ?? hasError} // Показываем ошибку, если есть
      error={error || meta.error} // Используем ошибку из Formik, если она есть
    >
      <select
        id={fieldId}
        className={combinedClassNames}
        value={field.value || ""} // Значение из Formik
        onChange={field.onChange} // Обработчик из Formik
        onBlur={field.onBlur} // Для отслеживания touched
        disabled={disabled}
        {...props}
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};
