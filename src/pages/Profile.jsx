import { toast } from "sonner";
import { getMeInformation, upDate, updateImage } from "../request";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../lib/redux/slices/auth-slice";
import { useEffect, useRef, useState } from "react";
import { ImageDown, Pencil, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
export default function Profile() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    getMeInformation().then(
      (res) => {
        dispatch(setUser(res));
      },
      ({ message }) => {
        toast.error(message);
      }
    );
  }, []);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (
    file,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
  ) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setImage(URL.createObjectURL(compressed));

    const formData = new FormData();
    formData.append("file", compressed); // ← To‘g‘ri nom: file

    updateImage(formData);
  };
  const hundleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = {};
    for (const [key, value] of formData.entries()) {
      if (key === "skills") {
        res[key] = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        res[key] = value;
      }
    }
    upDate(res);
  };
  return (
    <div className="flex flex-col items-center justify-start px-4 md:px-10 py-10">
      <Button
        variant={"outline"}
        size={"icon"}
        className="absolute top-5 right-5 cursor-pointer"
      >
        <NavLink to={"/"}>
          <X />
        </NavLink>
      </Button>
      <div className="flex flex-col items-start gap-4 w-full max-w-3xl">
        {/* Avatar */}
        <label className="relative cursor-pointer">
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden hover:opacity-80 transition">
            {image || user.userFile?.imageUrl ? (
              <img
                src={image || user.userFile?.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 bg-gray-100">
                <ImageDown />
              </div>
            )}
          </div>
        </label>

        {/* Edit Avatar Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            <Pencil className="w-4 h-4" />
            Edit Avatar
          </Button>
          <Badge
            className={
              user.isVerified
                ? "bg-blue-600 text-white"
                : "bg-red-700 text-white"
            }
            variant={user.isVerified ? "secondary" : "destructive"}
          >
            {user.isVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={hundleSubmit}
        className="w-full max-w-3xl mt-8 flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Label className="flex items-start flex-col gap-2">
            <span>First name</span>
            <Input
              defaultValue={user.name}
              name="name"
              placeholder="Your name..."
            />
          </Label>
          <Label className="flex items-start flex-col gap-2">
            <span>Email</span>
            <Input defaultValue={user.email} placeholder="Your email..." />
          </Label>
        </div>

        <Label className="flex items-start flex-col gap-2">
          <span>Bio</span>
          <Textarea
            name="bio"
            defaultValue={user.bio ?? "Tell us something about yourself..."}
            placeholder="Bio..."
          />
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Label className="flex items-start flex-col gap-2">
            <span>Location</span>
            <Input
              defaultValue={user.location ?? "Enter your current location..."}
              name="location"
              placeholder="Your location..."
            />
          </Label>

          <Label className="flex items-start flex-col gap-2">
            <span>Skills</span>
            <Input
              name="skills"
              defaultValue={
                Array.isArray(user.skills)
                  ? user.skills.join(", ")
                  : "e.g. JavaScript, React"
              }
              placeholder="Your skills..."
            />
          </Label>
        </div>

        <Button
          type="submit"
          variant="outline"
          className="w-full mt-4 cursor-pointer"
        >
          Update
        </Button>
      </form>
    </div>
  );
}
