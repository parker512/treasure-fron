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
  full_name: "",
  email: "",
  phone: "",
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
    name: "full_name",
    label: "Full Name *",
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
    name: "phone",
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
