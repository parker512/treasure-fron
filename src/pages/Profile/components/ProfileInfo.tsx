import { CustomSelectLocation } from "../../../components/customSelectLocation";
import { RenderFormFields } from "../../../components/RenderFormFields";
import { PROFILE_CREATE_FORM_FIELDS } from "./constants";

interface Location {
  id: number;
  name: string;
}

interface ProfileInfoProps {
  isEditing: boolean;
  stateList: Location[];
  cityList: Location[];
  currentState: { stateId: string | null; stateName: string | undefined };
  currentCity: { cityId: string | null; cityName: string | undefined };
  setCurrentState: (value: {
    stateId: string | null;
    stateName: string | undefined;
  }) => void;
  setCurrentCity: (value: {
    cityId: string | null;
    cityName: string | undefined;
  }) => void;
}

export const ProfileInfo = ({
  isEditing,
  stateList,
  cityList,
  currentState,
  currentCity,
  setCurrentState,
  setCurrentCity,
}: ProfileInfoProps) => {
  console.log("State list:", stateList);
  console.log("Current state:", currentState);
  console.log("Current city:", currentCity);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Мій Профіль</h2>
      </div>
      <RenderFormFields
        fields={PROFILE_CREATE_FORM_FIELDS}
        disabled={!isEditing}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h6>Область</h6>
          <CustomSelectLocation
            locations={stateList}
            placeholder="Оберіть область"
            selectedLocation={currentState.stateName}
            onSelect={setCurrentState}
            disabled={!isEditing}
          />
        </div>
        <div>
          <h6>Місто</h6>
          <CustomSelectLocation
            locations={cityList}
            placeholder="Оберіть місто"
            selectedLocation={currentCity.cityName}
            onSelect={setCurrentCity}
            isState={false}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};
