import { useDropzone } from "react-dropzone";
// import { NotificationService } from "../../../helpers/notifications";

interface AvatarUploaderProps {
  avatarPreview: string | null;
  setAvatarPreview: (preview: string | null) => void;
  formik: any;
  uploadFile: any;
}

export const AvatarUploader = ({
  avatarPreview,
  setAvatarPreview,
  formik,
  uploadFile,
}: AvatarUploaderProps) => {
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const response = await uploadFile(file).unwrap();
        if (response.result.id) {
          formik.setFieldValue("avatar", { id: response.result.id });
        }
      } catch (err) {
        // NotificationService.error("Failed to upload file");
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`h-[180px] w-[180px] overflow-hidden rounded-lg border-2 ${
        isDragActive ? "border-blue-500" : "border-gray-300"
      } flex items-center justify-center bg-gray-100`}
    >
      <input {...getInputProps()} />
      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="User Avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="p-4 text-center text-gray-500">
          {isDragActive
            ? "Drop the image here..."
            : "Drag and drop an image, or click to select"}
        </div>
      )}
    </div>
  );
};
