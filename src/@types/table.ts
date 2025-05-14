import { Image } from ".";

export interface Column {
  key: string;
  label: string;
}

export interface StyledValue {
  style: {
    color: string;
    backgroundColor?: string;
  };
  value: string;
}

export interface ImageValue extends Image {
  type: "image";
  alt: string;
  boost?: boolean;
}

export interface ComponentValue {
  type: "component";
  component: React.FC<{ [key: string]: any }>;
  props?: {
    [key: string]: string | number | Image;
  };
}

export type RowValue =
  | Date
  | string
  | number
  | StyledValue
  | ImageValue
  | ComponentValue;

export interface Row {
  id: number;
  [key: string]: RowValue;
}
