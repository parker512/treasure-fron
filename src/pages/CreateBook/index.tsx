import { useEffect, useState } from "react";
import { instance } from "../../services/api-client";
import { Form, FormikProvider, useFormik } from "formik";
import { GenreSelect } from "./components/GenreSelect";
import { CategorySelect } from "./components/CategorySelect";
import { TextInput } from "../../components/Form/TextInput";
import { Button } from "../../components/ui/Button";
import { ButtonVariants } from "../../components/ui/Button/types";
import { Sizes } from "../../@types/sizes";
import { RenderFormFields } from "../../components/RenderFormFields";
import { LISTING_CREATE_FORM_FIELDS } from "./components/constants";
import useBookStore from "../../store/auth-books";
import { AvatarUploader } from "../Profile/components/AvatarUploader";
import useFileStore from "../../store/file-store";
import { ConditionSelect } from "./components/ConditionSelect";

interface Category {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ICreateBookForm {
  title: string;
  description: string;
  price: string;
  category_id: number | null;
  genre_id: number | null;
  photo: File | null;
  condition: string | null;
}

export const CreateBookPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadFile = useFileStore((state) => state.uploadFile);
  const response = useFileStore((state) => state.response);

  const { createBook } = useBookStore();

  const fetchCategories = async () => {
    const { data } = await instance.get<Category[]>("/books/categories/");
    setCategories(data);
  };

  const fetchGenres = async () => {
    const { data } = await instance.get<Genre[]>("/books/genres/");

    setGenres(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (response) {
      // formik.setFieldValue("photo", response.id);
      setPhotoId(response.id);
    }
  }, [response]);

  const formik = useFormik<ICreateBookForm>({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category_id: null,
      genre_id: null,
      photo: null,
      condition: null, // ← добавлено
    },

    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("category_id", String(values.category_id));
        formData.append("genre_id", String(values.genre_id));
        formData.append("photo", String(photoId));
        formData.append("condition", values.condition || "");

        await createBook(formData);

        alert("Оголошення успішно створено!");
        formik.resetForm();
        setAvatarPreview(null);
      } catch (error) {
        console.error(error);
        alert("Помилка створення оголошення");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const CONDITIONS = [
    { label: "Нова", value: "new" },
    { label: "Б/у", value: "used" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
          Створити оголошення
        </h2>
        <FormikProvider value={formik}>
          <Form className="flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <AvatarUploader
                avatarPreview={avatarPreview}
                setAvatarPreview={setAvatarPreview}
                formik={formik}
                uploadFile={uploadFile}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RenderFormFields fields={LISTING_CREATE_FORM_FIELDS} />
              {/* <TextInput
                name="title"
                label="Назва книги *"
                placeholder="Введіть назву"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.errors.title}
              />
              <TextInput
                name="price"
                label="Ціна *"
                placeholder="Введіть ціну"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.errors.price}
              /> */}
              <CategorySelect
                name="category_id"
                label="Категорія *"
                options={categories}
                value={formik.values.category_id}
                onChange={(value) => formik.setFieldValue("category_id", value)}
              />
              <GenreSelect
                name="genre_id"
                label="Жанр *"
                options={genres}
                value={formik.values.genre_id}
                onChange={(value) => formik.setFieldValue("genre_id", value)}
              />
              <ConditionSelect
                name="condition"
                label="Стан *"
                options={CONDITIONS}
                value={formik.values.condition}
                onChange={(value) => formik.setFieldValue("condition", value)}
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-gray-700 mb-2">
                Опис *
              </label>
              <textarea
                name="description"
                className="w-full border-gray-300 rounded-xl p-4 min-h-[150px]"
                placeholder="Введіть опис книги..."
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>

            {/* Кнопка */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                variant={ButtonVariants.PRIMARY}
                size={Sizes.M}
                isDisabled={isSubmitting}
                className="transition-all hover:scale-105"
              >
                {isSubmitting ? "Завантаження..." : "Розмістити оголошення"}
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};
