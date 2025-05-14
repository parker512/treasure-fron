import { IRenderFormField } from "../../../@types/form";
import { Column } from "../../../@types/table";
import { TextInput } from "../../../components/Form/TextInput";
import { ActionButtons } from "./ActionButtons";

const LABEL_CLASSNAME = "font-bold text-gray-dark text-xl";
const TEXT_INPUT_CLASSNAME = " py-2";

export enum BookCondition {
  NEW = "new",
  USED = "used",
}

export const BookConditionLabels: Record<BookCondition, string> = {
  [BookCondition.NEW]: "Нова",
  [BookCondition.USED]: "Вживана",
};

export interface IFormikValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birh_date: string;
  avatar: any;
  region: string;
  city: string;
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

export const USER_BOOKS_TABLE_COLUMN: Column[] = [
  { key: "image", label: "Фото" },
  { key: "title", label: "Назва" },
  { key: "price", label: "Ціна" },
  { key: "condition", label: "Стан" },
  { key: "category", label: "Обкладинка" },
  { key: "genre", label: "Жанр" },
  { key: "actions", label: "Дії" },
];

export const getTableItems = (books: any[]) => {
  return books.map((book) => {
    return {
      image: {
        type: "image",
        src: book?.photo_detail?.image
          ? `http://127.0.0.1:8000${book?.photo_detail?.image}`
          : "https://via.placeholder.com/150",
      },
      title: book.title,
      price: book.price,
      condition:
        BookConditionLabels[book.condition as BookCondition] ?? "Невідомо",

      category: book.category.name,
      genre: book.genre.name,
      actions: {
        type: "component",
        component: ActionButtons,
        props: {
          id: book.id,
        },
      },
    };
  });
};

export const LISTING_UPDATE_FORM_FIELDS: IRenderFormField[] = [
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
