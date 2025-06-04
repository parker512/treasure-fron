import { FC, useEffect, useState } from "react";

import { Form, FormikConfig, FormikProvider, useFormik } from "formik";
import { IRegisterFormikValues } from "./types";
import {
  AUTH_FORM_VALIDATION_SCHEMA,
  REGISTER_FORM_FIELDS,
  REGISTER_INITIAL_VALUES,
} from "./constants";
import { RenderFormFields } from "../../../components/RenderFormFields";
import { Button } from "../../../components/ui/Button";
import { ButtonVariants } from "../../../components/ui/Button/types";
import { Sizes } from "../../../@types/sizes";
// import { useRegisterMutation } from "../../../stores/api/authApi";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/auth-store";
import { GetCity, GetState } from "react-country-state-city";
import { CustomSelectLocation } from "../../../components/customSelectLocation";
import { ukraineLocations } from "../../../constants/data";

interface Props {
  setActiveForm: (form: "login" | "register") => void;
}

export const RegistrationForm: FC<Props> = ({ setActiveForm }) => {
  const register = useAuthStore((state) => state.register);
  const [country, setCountry] = useState("230");
  const [stateList, setStateList] = useState<any>([]);
  const [cityList, setCitiesList] = useState<any>([]);
  const [currentCity, setCurrentCity] = useState<{
    cityId: string | null;
    cityName: string | undefined;
  }>({
    cityId: null,
    cityName: undefined,
  });

  const [currentState, setCurrentState] = useState<{
    stateId: string | null;
    stateName: string | undefined;
  }>({
    stateId: null,
    stateName: undefined,
  });

  useEffect(() => {
    const states = ukraineLocations.map((region, index) => ({
      id: index.toString(),
      name: region.name,
    }));
    setStateList(states);
  }, []);

  useEffect(() => {
    if (currentState.stateId) {
      const region = ukraineLocations[parseInt(currentState.stateId)];
      if (region) {
        const cities = region.cities.map((city, index) => ({
          id: index.toString(),
          name: city.name,
        }));
        setCitiesList(cities);
      }
    }
  }, [currentState]);

  const navigate = useNavigate();

  const formikProps: FormikConfig<IRegisterFormikValues> = {
    initialValues: REGISTER_INITIAL_VALUES,

    onSubmit: async (values) => {
      try {
        const fullValues = {
          ...values,
          region: currentState.stateName || "",
          city: currentCity.cityName || "",
        };

        const response = await register(fullValues, () => {
          setActiveForm("login");
        });
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  };

  const formik = useFormik(formikProps);

  return (
    <div className="w-full flex flex-col gap-5 items-center justify-center mt-10">
      <h1 className="font-manrope font-semibold text-3xl leading-[130%] tracking-normal">
        Welcome!
      </h1>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {REGISTER_FORM_FIELDS.map((field) => (
              <div
                key={field.name}
                className={
                  field.name === "email" || field.name === "phone_number"
                    ? "col-span-1"
                    : "md:col-span-2"
                }
              >
                <RenderFormFields fields={[field]} />
              </div>
            ))}

            <div>
              <h6>Область</h6>
              <CustomSelectLocation
                locations={stateList}
                placeholder="Select State"
                selectedLocation={currentState.stateName}
                onSelect={setCurrentState}
              />
            </div>
            <div>
              <h6>Місто</h6>
              <CustomSelectLocation
                locations={cityList}
                placeholder="Select City"
                selectedLocation={currentCity.cityName}
                onSelect={setCurrentCity}
                isState={false}
              />
            </div>
          </div>

          <Button
            variant={ButtonVariants.SECONDARY}
            size={Sizes.M}
            className="w-full mt-5"
            type="submit"
          >
            Sign In
          </Button>
          <p
            className="font-poppins font-normal text-sm leading-[150%] tracking-normal text-center"
            onClick={() => setActiveForm("login")}
          >
            Already have an account?
            <span className="font-poppins font-semibold text-sm leading-[150%] tracking-normal text-center text-[#4e9ee9] mt-2 cursor-pointer">
              Log in
            </span>
          </p>
        </Form>
      </FormikProvider>
    </div>
  );
};
