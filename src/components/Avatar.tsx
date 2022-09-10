import { useEffect, useState } from "react";
import uploadSvg from "../assets/upload.svg";
import { useAppContext } from "../context/appContext";

export default function Avatar(props: {
  url: string;
  size: string | number;
  onUpload: (path: string) => void;
}) {
  const { supabase } = useAppContext();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const downloadImage = async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    };

    if (props.url) downloadImage(props.url);
  }, [props.url, supabase]);

  function clickUpload() {
    document.getElementById("single")?.click();
  }

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      props.onUpload(filePath);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`flex flex-col max-w-fit not-prose items-center`}
      aria-live="polite"
    >
      <div className="rounded-lg avatar w-36 aspect-square overflow-clip">
        <img
          src={
            avatarUrl
              ? avatarUrl
              : `https://place-hold.it/${props.size}x${props.size}`
          }
          alt={avatarUrl ? "Avatar" : "No image"}
          className={` !w-[${props.size}px] !h-[${props.size}px]`}
        />
      </div>
      {
        <>
          <div
            onClick={clickUpload}
            className={`btn btn-secondary btn-square  mt-2 ${
              uploading && "loading"
            } `}
          >
            <img
              className={`${uploading && "hidden"} !fill-current !text-white`}
              src={uploadSvg}
              alt="upload"
            />
          </div>

          <input
            type="file"
            id="single"
            title="avatar"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
        </>
      }
    </div>
  );
}
