import { use, useEffect, useState } from "react";
import { AvatarUploader } from "./components/AvatarUploader";
import { Form, FormikConfig, FormikProvider, useFormik } from "formik";
import useAuthStore from "../../store/auth-store";
import useFileStore from "../../store/file-store";
import { IFormikValues } from "./components/constants";
import { ProfileInfo } from "./components/ProfileInfo";
import { ProfileActions } from "./components/ProfileActions";
import { ukraineLocations } from "../../constants/data";
import { UserBooksTable } from "./components/userBooksTable";

export const ProfilePage = () => {
  const getUser = useAuthStore((state) => state.getUser);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stateList, setStateList] = useState<any>([]);
  const [cityList, setCitiesList] = useState<any>([]);

  const uploadFile = useFileStore((state) => state.uploadFile);
  const response = useFileStore((state) => state.response);
  const resetFileStore = useFileStore((state) => state.reset);
  const [photoId, setPhotoId] = useState<number | null>(null);

  const [currentState, setCurrentState] = useState<{
    stateId: string | null;
    stateName: string | undefined;
  }>({
    stateId: null,
    stateName: undefined,
  });
  const [currentCity, setCurrentCity] = useState<{
    cityId: string | null;
    cityName: string | undefined;
  }>({
    cityId: null,
    cityName: undefined,
  });

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (response) {
      // formik.setFieldValue("photo", response.id);
      setPhotoId(response.id);
    }
  }, [response]);

  const formikProps: FormikConfig<IFormikValues> = {
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      birth_date: "",
      avatar: null,
      region: "",
      city: "",
    },
    validationSchema: null,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  };

  const formik = useFormik(formikProps);

  const handleSubmit = (values: IFormikValues) => {
    const updatedValues = {
      ...values,
      avatar: photoId,
    };
    updateUser(updatedValues, () => {
      setIsEditing(false);
    });

    setPhotoId(null);
    resetFileStore();
  };

  const handleCancel = () => {
    formik.setValues({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      birth_date: user.birth_date,
      avatar: null,
      region: user.region,
      city: user.city,
    });
    setAvatarPreview(user.avatar);
    setIsEditing(false);
  };

  useEffect(() => {
    if (user && stateList.length > 0) {
      formik.setValues({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone_number,
        birth_date: user.birth_date,
        avatar: null,
        region: user.region,
        city: user.city,
      });

      // Находим нужную область по названию
      const matchedRegion = stateList.find((r: any) => r.name === user.region);

      setCurrentState({
        stateId: matchedRegion?.id ?? null,
        stateName: matchedRegion?.name ?? user.region,
      });

      // Городов у тебя пока нет в списке (cityList), так что просто устанавливаем как есть
      setCurrentCity({
        cityId: null,
        cityName: user.city,
      });

      setAvatarPreview(
        user.avatar?.image ? `http://127.0.0.1:8000/${user.avatar.image}` : null
      );
    }
  }, [user, stateList]);

  useEffect(() => {
    // при загрузке компонента — загружаем список областей
    const states = ukraineLocations.map((region, index) => ({
      id: index.toString(), // можешь использовать uuid, если хочешь
      name: region.name,
    }));
    setStateList(states);
  }, []);

  useEffect(() => {
    if (!currentState.stateName) return;
    currentCity.cityName = undefined;
    // при загрузке компонента — загружаем список областей
    const cities = ukraineLocations.find(
      (region) => region.name === currentState.stateName
    )?.cities;
    setCitiesList(cities);
  }, [currentState]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row gap-10">
        <FormikProvider value={formik}>
          <Form className="flex flex-col md:flex-row gap-10 w-full">
            <div className="flex flex-col items-center md:items-start w-full md:w-[300px] gap-4">
              <AvatarUploader
                avatarPreview={avatarPreview}
                setAvatarPreview={setAvatarPreview}
                formik={formik}
                uploadFile={uploadFile}
              />
              <ProfileActions
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleCancel={handleCancel}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <ProfileInfo
                isEditing={isEditing}
                stateList={stateList}
                cityList={cityList}
                currentState={currentState}
                currentCity={currentCity}
                setCurrentState={setCurrentState}
                setCurrentCity={setCurrentCity}
              />
            </div>
          </Form>
        </FormikProvider>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Мої оголощення</h2>
      <UserBooksTable id={user?.id} />
    </div>
  );
};
