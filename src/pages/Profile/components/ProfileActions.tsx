import { Sizes } from "../../../@types/sizes";
import { Button } from "../../../components/ui/Button";
import { ButtonVariants } from "../../../components/ui/Button/types";

interface ProfileActionsProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleCancel: () => void;
}

export const ProfileActions = ({
  isEditing,
  setIsEditing,
  handleCancel,
}: ProfileActionsProps) => {
  return (
    <div className="w-full flex justify-center md:justify-start mt-4">
      {!isEditing ? (
        <Button
          type="button"
          variant={ButtonVariants.SECONDARY}
          size={Sizes.M}
          className="transition-all hover:scale-105"
          onClick={() => setIsEditing(true)}
        >
          Змінити
        </Button>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="button"
            variant={ButtonVariants.SECONDARY}
            size={Sizes.M}
            className="transition-all hover:scale-105"
            onClick={() => {
              handleCancel();
              setIsEditing(false);
            }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant={ButtonVariants.PRIMARY}
            size={Sizes.M}
            className="transition-all hover:scale-105"
          >
            Зберегти
          </Button>
        </div>
      )}
    </div>
  );
};
