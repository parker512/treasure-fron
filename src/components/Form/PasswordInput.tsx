import React, { FC, useState, KeyboardEvent } from "react";
import { useField, useFormikContext } from "formik";
import cn from "classnames";

import { FormField } from ".";
import { Eye, EyeOff } from "lucide-react";

import { TEXT_INPUT_STYLE_VARIANTS } from "./constants";
import { FormFieldVariants } from "./types";
import { IFormField } from "../../@types/form";

export const PasswordInput: FC<IFormField> = ({
  className,
  fieldClassName,
  labelClassName,
  id,
  label,
  variant = FormFieldVariants.PRIMARY,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = id || props.name;
  const { handleSubmit } = useFormikContext();
  const [{ value, onChange, ...field }, { error, touched }] = useField(fieldId);
  const isShownError = Boolean((touched || value) && error);

  const onKeyDownEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const combinedClassNames = cn(
    "w-full outline-none",
    TEXT_INPUT_STYLE_VARIANTS[variant],
    className,
    {
      "!border-red-base": error,
    }
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <FormField
      className={fieldClassName}
      labelClassName={labelClassName}
      variant={variant}
      label={label}
      labelFor={fieldId}
      isShownError={isShownError}
      error={error}
    >
      <div className="relative">
        <input
          id={fieldId}
          type={showPassword ? "text" : "password"}
          className={combinedClassNames}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
          {...field}
          onKeyDown={onKeyDownEnter}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </FormField>
  );
};
