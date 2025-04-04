import cn from "classnames";
import { ButtonVariants } from "./types";
import { Sizes } from "../../../@types/sizes";

const DEFAULT_BUTTON_CLASSNAME = "rounded-30 font-bold";

export const BUTTON_STYLE_VARIANTS = {
  [ButtonVariants.PRIMARY]: cn(
    "border-[1px] border-black rounded-full px-1 px-1 cursor-pointer",
    DEFAULT_BUTTON_CLASSNAME
  ),
  [ButtonVariants.SECONDARY]: cn(
    "bg-[#4e9ee9] rounded-full px-1 cursor-pointer text-white",
    DEFAULT_BUTTON_CLASSNAME
  ),
};

export const BUTTON_STYLE_SIZE = {
  [Sizes.S]: "text-sm py-[14px] px-6",
  [Sizes.M]: "text-base py-5 px-8",
};
