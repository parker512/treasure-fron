import { JSX } from "react";
import {
  ComponentValue,
  ImageValue,
  Row,
  StyledValue,
} from "../../@types/table";

export const getKeyValue = (
  obj: Row,
  key: string
): string | JSX.Element | number => {
  const value = obj[key];

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (isImageValue(value)) {
    const borderClass = value.boost
      ? "border-[#DEE883] border-[5px]"
      : "border-none";

    return (
      <div className="h-20 w-20">
        <img
          className={`h-full w-full rounded-md border ${borderClass}`}
          src={value.src}
          alt={value.alt}
        />
      </div>
    );
  }

  if (isComponentValue(value)) {
    const Component = value.component;

    return <Component {...(value.props || {})} />;
  }

  if (isStyledValue(value)) {
    return (
      <span className="w-max" style={value.style}>
        {value.value}
      </span>
    );
  }

  return <></>;
};

const isImageValue = (value: any): value is ImageValue => {
  return value?.type === "image";
};

const isComponentValue = (value: any): value is ComponentValue => {
  return value?.type === "component";
};

const isStyledValue = (value: any): value is StyledValue => {
  return value && "value" in value && "style" in value;
};
