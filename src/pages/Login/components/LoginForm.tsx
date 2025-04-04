import { Form, FormikConfig, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IFormikValues } from "./types";
import {
  AUTH_FORM_FIELDS,
  AUTH_FORM_VALIDATION_SCHEMA,
  AUTH_INITIAL_VALUES,
} from "./constants";
import { RenderFormFields } from "../../../components/RenderFormFields";
import { Button } from "../../../components/ui/Button";
import { ButtonVariants } from "../../../components/ui/Button/types";
import { Sizes } from "../../../@types/sizes";
import useAuthStore from "../../../store/auth-store";

interface Props {
  setActiveForm: (form: "login" | "register") => void;
}

export const LoginForm: FC<Props> = ({ setActiveForm }) => {
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const formikProps: FormikConfig<IFormikValues> = {
    initialValues: AUTH_INITIAL_VALUES,
    validationSchema: AUTH_FORM_VALIDATION_SCHEMA,
    onSubmit: (values) => {
      handleSubmitAsync(values);
    },
  };

  const handleSubmitAsync = async (values: IFormikValues) => {
    try {
      console.log("Values:", values);
      await login(values, () => {
        navigate("/");
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const formik = useFormik(formikProps);

  return (
    <div className="w-full flex flex-col gap-5 items-center justify-center mt-30">
      <h1 className="font-manrope font-semibold text-[30px] lg:text-3xl leading-[130%] tracking-normal">
        Welcome!
      </h1>
      {/* <AuthGoogleButton /> */}
      <div className="relative w-[400px] lg:w-[500px] flex items-center">
        <div
          className="w-full border-t-3 border-dashed border-gray-400"
          style={{ borderSpacing: "4px" }}
        ></div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 text-sm">
          Or, Sign in with email
        </span>
      </div>
      <FormikProvider value={formik}>
        <Form className="w-[400px] lg:w-[500px]">
          <div className="flex flex-col gap-6 w-full">
            <RenderFormFields fields={AUTH_FORM_FIELDS} />
          </div>
          <div className="w-full flex items-center justify-end">
            <p className="font-inter font-semibold text-sm leading-[150%] tracking-normal">
              Forget Password?
            </p>
          </div>
          <Button
            variant={ButtonVariants.SECONDARY}
            size={Sizes.M}
            className="w-full mt-5"
          >
            Sign In
          </Button>
          <p
            className="font-poppins font-normal text-sm leading-[150%] tracking-normal text-center"
            onClick={() => setActiveForm("register")}
          >
            Don't have an account yet?{" "}
            <span className="font-poppins font-semibold text-sm leading-[150%] tracking-normal text-center text-[#4e9ee9] mt-2 cursor-pointer">
              Create Account
            </span>
          </p>
        </Form>
      </FormikProvider>
    </div>
  );
};
