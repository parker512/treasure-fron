import { IRenderFormField } from "../../../@types/form";
import { TextInput } from "../../../components/Form/TextInput";

const LABEL_CLASSNAME = "font-bold text-gray-dark text-xl";
const TEXT_INPUT_CLASSNAME = " py-2";

export const LISTING_CREATE_FORM_FIELDS: IRenderFormField[] = [
  {
    name: "title",
    label: "Назва книги *",
    placeholder: "Введіть назву",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    fieldClassName: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "price",
    label: "Ціна *",
    placeholder: "Введіть ціну",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    fieldClassName: TEXT_INPUT_CLASSNAME,
  },
];
