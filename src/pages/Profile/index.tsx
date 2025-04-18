import { useEffect, useState } from "react";
import { AvatarUploader } from "./components/AvatarUploader";
import { Form, FormikConfig, FormikProvider, useFormik } from "formik";
import useAuthStore from "../../store/auth-store";
import useFileStore from "../../store/file-store";
import { IFormikValues } from "./components/constants";
import { ProfileInfo } from "./components/ProfileInfo";
import { ProfileActions } from "./components/ProfileActions";

export const ProfilePage = () => {
  const getUser = useAuthStore((state) => state.getUser);
  const user = useAuthStore((state) => state.user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const uploadFile = useFileStore((state) => state.uploadFile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const formikProps: FormikConfig<IFormikValues> = {
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      birh_date: "",
      avatar: undefined,
    },
    validationSchema: null,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  };

  const formik = useFormik(formikProps);

  const handleSubmit = (values: IFormikValues) => {
    console.log("Submitted form:", values);
  };

  const handleCancel = () => {
    formik.setValues({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      birh_date: user.birh_date,
      avatar: undefined,
    });
    setAvatarPreview(user.avatar);
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      formik.setValues({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        birh_date: user.birh_date,
        avatar: undefined,
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

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
              <ProfileInfo isEditing={isEditing} />
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};
