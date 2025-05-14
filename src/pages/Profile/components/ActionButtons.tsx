import { FC, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { ButtonVariants } from "../../../components/ui/Button/types";
import useBookStore from "../../../store/auth-books";
import { EditBookModal } from "./EditBookModal";

interface Props {
  id: number;
}

export const ActionButtons: FC<Props> = ({ id }) => {
  const deleteBook = useBookStore((state) => state.deleteBook);
  const [isEditOpen, setEditOpen] = useState(false);

  const deleteBookHandler = () => {
    deleteBook(id);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant={ButtonVariants.PRIMARY}
          onClick={() => setEditOpen(true)}
        >
          Змінити
        </Button>
        <Button
          variant={ButtonVariants.SECONDARY}
          className="bg-red-500 text-white px-4 py-4 border-0"
          onClick={deleteBookHandler}
        >
          Видалити
        </Button>
      </div>

      <EditBookModal
        bookId={id}
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
};
