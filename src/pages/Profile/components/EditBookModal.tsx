import { FC, useEffect, useState } from "react";
import useBookStore from "../../../store/auth-books";
import Modal from "../../../components/Modal";
import useFileStore from "../../../store/file-store";
import { instance } from "../../../services/api-client";
import { Form, FormikProvider, useFormik } from "formik";
import { AvatarUploader } from "./AvatarUploader";
import { RenderFormFields } from "../../../components/RenderFormFields";
import { LISTING_UPDATE_FORM_FIELDS } from "./constants";
import { CategorySelect } from "../../CreateBook/components/CategorySelect";
import { GenreSelect } from "../../CreateBook/components/GenreSelect";
import { ConditionSelect } from "../../CreateBook/components/ConditionSelect";
import { Button } from "../../../components/ui/Button";
import { ButtonVariants } from "../../../components/ui/Button/types";
import { Sizes } from "../../../@types/sizes";

interface Category {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface IEditBookForm {
  title: string;
  description: string;
  price: string;
  category_id: number | null;
  genre_id: number | null;
  photo: File | null;
  condition: string | null;
}

interface Props {
  bookId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CONDITIONS = [
  { label: "Нова", value: "new" },
  { label: "Б/у", value: "used" },
];

export const EditBookModal: FC<Props> = ({ bookId, isOpen, onClose }) => {
  const updateBook = useBookStore((state) => state.updateBook);
  const detailBook = useBookStore((state) => state.detailBook);
  const getDetailBook = useBookStore((state) => state.getDetailBook);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadFile = useFileStore((state) => state.uploadFile);
  const response = useFileStore((state) => state.response);

  useEffect(() => {
    if (isOpen) {
      getDetailBook(String(bookId));
      fetchCategories();
      fetchGenres();
    }
  }, [isOpen, bookId]);

  const getConditionValue = (condition: string) => {
    const lower = condition.toLowerCase();
    if (["нова", "new"].includes(lower)) return "new";
    if (["б/у", "used", "вживана", "вживаний"].includes(lower)) return "used";
    return "";
  };

  const fetchCategories = async () => {
    const { data } = await instance.get<Category[]>("/books/categories/");
    setCategories(data);
  };

  const fetchGenres = async () => {
    const { data } = await instance.get<Genre[]>("/books/genres/");
    setGenres(data);
  };

  useEffect(() => {
    if (response) {
      setPhotoId(response.id);
    }
  }, [response]);

  const formik = useFormik<IEditBookForm>({
    enableReinitialize: true,
    initialValues: {
      title: detailBook?.title || "",
      description: detailBook?.description || "",
      price: detailBook ? String(detailBook.price) : "",
      category_id: detailBook?.category?.id || null,
      genre_id: detailBook?.genre?.id || null,
      photo: null,
      condition: detailBook ? getConditionValue(detailBook.condition) : null,
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

        await updateBook(bookId, formData);
        await getDetailBook(String(bookId)); // 🔁 получить свежие данные после обновления
      } catch (error) {
        console.error(error);
        alert("Помилка редагування оголошення");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (detailBook?.photo_detail?.id) {
      setPhotoId(detailBook.photo_detail.id);
      setAvatarPreview(detailBook.photo_detail.image);
    }
  }, [detailBook]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редагувати книгу">
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
            <RenderFormFields fields={LISTING_UPDATE_FORM_FIELDS} />
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

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant={ButtonVariants.PRIMARY}
              size={Sizes.M}
              isDisabled={isSubmitting}
              className="transition-all hover:scale-105"
            >
              {isSubmitting ? "Завантаження..." : "Редагувати оголошення"}
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </Modal>
  );
};
