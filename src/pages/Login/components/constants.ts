import { IFormikValues, IRegisterFormikValues } from "./types";

import * as Yup from "yup";
import { PasswordInput } from "../../../components/Form/PasswordInput";
import { TextInput } from "../../../components/Form/TextInput";
import { IRenderFormField } from "../../../@types/form";

const LABEL_CLASSNAME = "font-semibold text-gray-dark colspan-2";
const TEXT_INPUT_CLASSNAME = "px-6 py-4";

export const AUTH_INITIAL_VALUES: IFormikValues = {
  email: "",
  password: "",
};

export const REGISTER_INITIAL_VALUES: IRegisterFormikValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  confirm_password: "",
};

export const AUTH_FORM_FIELDS: IRenderFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email *",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter your email id",
    className: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "password",

    label: "Password *",
    component: PasswordInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter password",
    className: TEXT_INPUT_CLASSNAME,
  },
];

export const REGISTER_FORM_FIELDS: IRenderFormField[] = [
  {
    name: "first_name",
    label: "First Name *",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter your full name",
    className: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "last_name",
    label: "Last Name *",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter your full name",
    className: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "email",
    type: "email",
    label: "Email *",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter your email id",
    className: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "phone_number",
    label: "Phone Number *",
    component: TextInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter your phone number",
    className: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "password",
    label: "Password *",
    component: PasswordInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Enter password",
    className: TEXT_INPUT_CLASSNAME,
  },
  {
    name: "confirm_password",
    label: "Repeat Password *",
    component: PasswordInput,
    labelClassName: LABEL_CLASSNAME,
    placeholder: "Repeat password",
    className: TEXT_INPUT_CLASSNAME,
  },
];

export const AUTH_FORM_VALIDATION_SCHEMA = Yup.object().shape({
  // email: EMAIL_VALIDATION_SCHEMA,
  // phone: PHONE_VALIDATION_SCHEMA,
  // password: MIN_LENGTH_VALIDATION(4),
});
