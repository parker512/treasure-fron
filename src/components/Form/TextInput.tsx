import React, { FC, KeyboardEvent, useMemo } from "react";
import PhoneInput from "react-phone-number-input/input";
import { InputMask as MaskedInput } from "react-input-mask";
import cn from "classnames";
import { useField, useFormikContext } from "formik";

import { TEXT_INPUT_STYLE_VARIANTS } from "./constants";
import { FormFieldVariants } from "./types";
import { FormField } from ".";
import { IFormField } from "../../@types/form";

export const TextInput: FC<IFormField> = ({
  className,
  fieldClassName,
  labelClassName,
  id,
  label,
  variant = FormFieldVariants.PRIMARY,
  placeholder,
  isTextArea = false,
  type,
  mask,
  rows,
  maxLength,
  minLength,
  required,
  autoComplete,
  disabled,
  ...props
}) => {
  const fieldId = id || props.name;
  const { handleSubmit } = useFormikContext();
  const [{ value, onChange, ...field }, { error, touched }, { setValue }] =
    useField(fieldId);
  const isShownError = Boolean((touched || value) && error);

  const onKeyDownEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isTextArea) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const combinedClassNames = cn(
    "w-full outline-none",
    TEXT_INPUT_STYLE_VARIANTS[variant],
    className,
    {
      "resize-y min-h-[120px]": isTextArea,
      "!border-red-base": isShownError,
      "opacity-50 cursor-not-allowed": disabled,
    }
  );

  const isTelField = type === "tel";

  const InputComponent = useMemo(() => {
    if (isTelField) {
      return PhoneInput;
    }
    if (mask) {
      return MaskedInput;
    }
    if (isTextArea) {
      return "textarea";
    }
    return "input";
  }, [mask, isTextArea, isTelField]);

  const onChangePhoneValue = (inputValue: string | undefined) => {
    if (inputValue) {
      setValue(inputValue);
    }
  };

  const textareaProps = isTextArea
    ? {
        rows: rows || 4,
        style: { whiteSpace: "pre-wrap" as const },
        maxLength,
        minLength,
      }
    : {};

  const inputProps = {
    id: fieldId,
    className: combinedClassNames,
    value: value || "",
    placeholder,
    onChange: isTelField ? onChangePhoneValue : onChange,
    onKeyDown: onKeyDownEnter,
    maxLength: isTelField ? 20 : maxLength,
    minLength,
    required,
    autoComplete,
    disabled,
    ...field,
    ...props,
    ...textareaProps,
    ...(mask && { mask }), // передаем маску только для MaskedInput
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
      <InputComponent {...inputProps} />
    </FormField>
  );
};
