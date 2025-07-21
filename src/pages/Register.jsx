import { useState } from "react";
import yerImage from "../assets/setka.svg";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { validation } from "../validations";
import { toast } from "sonner";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { signUp } from "../request";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../lib/redux/slices/auth-slice";
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hundleSumbit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = {};
    for (const [key, value] of formData.entries()) {
      res[key] = value;
    }

    const result = validation(res);
    if (result) {
      const { target, message } = result;
      e.target[target].focus();
      toast.error(message);
    } else {
      dispatch(setLoading(true));
      signUp(res)
        .then((data) => {
          dispatch(setUser(data));
          toast.success("Registration successful");
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col gap-5 items-center justify-center"
      style={{ backgroundImage: `url(${yerImage})` }}
    >
      <h1 className="text-4xl font-bold">Register</h1>
      <form
        onSubmit={hundleSumbit}
        className="bg-white/60 p-6 rounded-md shadow-sm space-y-4 max-w-md w-[90%]"
      >
        <div className="space-y-2">
          <Label htmlFor="name">
            <span>Name</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter..."
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            <span>Email</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter..."
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">
            <span>Password</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter..."
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <TooltipProvider>
          <div className="grid grid-cols-3 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                >
                  <AiOutlineGoogle size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login with Google</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  type="submit"
                  className="cursor-pointer"
                >
                  {loading ? (
                    <RefreshCcw className="animate-spin" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login with Email</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                >
                  <AiOutlineGithub size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login with GitHub</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </form>
      <p className="text-gray-900 text-end text-sm">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="text-blue-400 hover:text-blue-600 underline"
        >
          Login
        </NavLink>
      </p>
    </div>
  );
}
