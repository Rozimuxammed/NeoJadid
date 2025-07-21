import { toast } from "sonner";
import { getMeInformation } from "../request";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../lib/redux/slices/auth-slice";
import { useEffect, useState } from "react";
import { ImageDown } from "lucide-react";
import { Button } from "../components/ui/button";
export default function Profile() {
  const [image, setImage] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex items-start flex-col gap-10 justify-start p-10">
      <div className="flex flex-col mx-auto items-center">
        {/* Circular image preview */}
        <label className="relative cursor-pointer mb-2.5">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden hover:opacity-80">
            {user.userFile?.imageUrl || image ? (
              <img
                src={user.userFile?.imageUrl || image}
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
        <h1 className="text-xl font-bold text-[#121417]">{user.name}</h1>
        <p className="text-[14px] text-[#61758A]">{user.email}</p>
        <div className="flex items-center gap-2 mt-2.5 text-[#61758A]">
          <span>Account Status:</span>
          <span
            className={`px-3 py-[2px] rounded-full text-sm font-medium ${
              user.isVerified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.isVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
        <Button
          variant={"outline"}
          className={"cursor-pointer mt-5 rounded-3xl w-full"}
        >
          Edit
        </Button>
      </div>
      <div className="mt-5">
        <h1 className="text-3xl font-semibold mb-5">About</h1>
        <div className="flex items-center gap-12 mb-5">
          <div className="flex items-center gap-10 border-t-2 pt-2.5">
            <h1 className="text-[18px] ">Location</h1>
          </div>
          <p className="border-t-2 pt-2.5">
            {user?.location || "location not specified"}
          </p>
        </div>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-10">
            <h1 className="text-[18px]">Skills</h1>
          </div>
          {user.skills && user.skills.length > 0 ? (
            <ul>
              {user.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
