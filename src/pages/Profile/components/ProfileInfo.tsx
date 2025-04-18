import { RenderFormFields } from "../../../components/RenderFormFields";
import { PROFILE_CREATE_FORM_FIELDS } from "./constants";

interface ProfileInfoProps {
  isEditing: boolean;
}

export const ProfileInfo = ({ isEditing }: ProfileInfoProps) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Мій Профіль</h2>
      </div>
      <RenderFormFields
        fields={PROFILE_CREATE_FORM_FIELDS}
        disabled={!isEditing}
      />
    </div>
  );
};
