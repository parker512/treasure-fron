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

  // Добавляем недостающие свойства
  rows?: number; // Количество строк для textarea
  maxLength?: number; // Максимальная длина
  minLength?: number; // Минимальная длина
  required?: boolean; // Обязательное поле
  autoComplete?: string; // Автозаполнение
}

export interface IRenderFormField extends IFormField {
  component: FC<IFormField>;
}
