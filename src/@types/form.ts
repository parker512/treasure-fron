import { FC } from "react";
import { FormFieldVariants } from "../components/Form/types";

export interface IOptionSelect {
  value: string | number;
  label: string;
}

export type SetOptionSelect = (option: IOptionSelect) => void;

export interface IFormField {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  isTextArea?: boolean;
  mask?: string | (string | RegExp)[];
  placeholder?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  variant?: FormFieldVariants;
  disabled?: boolean;
  options?: IOptionSelect[];

  rows?: number;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  autoComplete?: string;
}

export interface IRenderFormField extends IFormField {
  component: FC<IFormField>;
}
