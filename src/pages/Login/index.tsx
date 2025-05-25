import { FC, useState } from "react";
import bg from "../../assets/bg.jpeg";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "./components/LoginForm";
import { RegistrationForm } from "./components/RegisterForm";
import { useNavigate } from "react-router-dom";

export const LoginPage: FC = () => {
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <div
        className="lg:block hidden flex-1 h-full"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="flex-1 flex flex-col items-start justify-start px-5 lg:px-0 lg:pl-24 pt-10 overflow-y-auto h-full">
        <div className="w-full flex justify-start items-center gap-2">
          <div className="p-2 bg-[#4e9ee9] rounded-full">
            <ArrowLeft color="white" onClick={() => navigate(-1)} />
          </div>
          Back
        </div>

        <div className="w-full flex justify-center gap-2">
          {activeForm === "login" ? (
            <LoginForm setActiveForm={setActiveForm} />
          ) : (
            <>
              <RegistrationForm setActiveForm={setActiveForm} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
