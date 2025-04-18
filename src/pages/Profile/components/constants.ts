import { IRenderFormField } from "../../../@types/form";
import { TextInput } from "../../../components/Form/TextInput";

const LABEL_CLASSNAME = "font-bold text-gray-dark text-xl";
const TEXT_INPUT_CLASSNAME = " py-2";

export interface IFormikValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birh_date: string;
  avatar: any;
}

export const PROFILE_CREATE_FORM_FIELDS: IRenderFormField[] = [
  {
    name: "first_name",
    label: "Ім'я *",
    placeholder: "Введіть ім'я",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    fieldClassName: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "last_name",
    label: "Прізвище *",
    placeholder: "Введіть прізвище",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    fieldClassName: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "phone",
    label: "Телефон *",
    placeholder: "Введіть телефон",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    fieldClassName: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "birh_date",
    label: "Дата народження *",
    placeholder: "Введіть дату народження",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    fieldClassName: TEXT_INPUT_CLASSNAME,
  },
];
