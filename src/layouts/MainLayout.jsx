import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { PanelRight, Plus, UserPen } from "lucide-react";
import { Button } from "../components/ui/button";
import yerImage from "../assets/setka.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { logoutUser, setUser } from "../lib/redux/slices/auth-slice";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clearInputValue } from "../lib/redux/slices/input-slice";
import { getMeInformation } from "../request";
import { toast } from "sonner";

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [showIcons, setShowIcons] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.clear();
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNewChat = () => {
    dispatch(clearInputValue());
  };

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

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${yerImage})` }}
    >
      <aside
        className={`transition-all border-r duration-500 bg-white/60 flex flex-col justify-between ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Yuqori qism */}
        <div>
          <div
            className={`flex items-center gap-2.5 p-4 ${
              isCollapsed ? "flex-col" : ""
            }`}
          >
            <Button
              onClick={handleNewChat}
              variant={"outline"}
              className={"cursor-pointer"}
            >
              <Plus />
              {isCollapsed ? "" : <span> New chat</span>}
            </Button>

            <Button
              variant={"outline"}
              onClick={handleToggle}
              className="focus:outline-none cursor-pointer"
            >
              <PanelRight />
            </Button>
          </div>

          {!isCollapsed && <Sidebar />}
        </div>

        {/* Pastki qism: avatar + email */}
        <div
          className={`flex items-center gap-2 px-4 py-4 ${
            isCollapsed ? "flex-col" : ""
          }`}
        >
          <div className="relative">
            <Avatar
              onClick={() => setShowIcons(!showIcons)}
              className="cursor-pointer"
            >
              <AvatarImage src={user.userFile?.imageUrl} />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <AnimatePresence>
              {showIcons && (
                <div className="absolute bottom-full mt-2 mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <Link to={"/profile"}>
                          <UserPen
                            size={20}
                            className="cursor-pointer w-9 h-9 p-2 border rounded-full"
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <LogOut
                          className="cursor-pointer w-9 h-9 p-2 border rounded-full"
                          onClick={logout}
                          size={15}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Log Out</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {!isCollapsed && (
            <span className="text-sm text-gray-700" title={user.email}>
              {user.email.split("@")[0].slice(0, 7) +
                "..." +
                "@" +
                user.email.split("@")[1]}
            </span>
          )}
        </div>
      </aside>

      <main className="p-10 bg-white/60 w-full">
        <Outlet />
      </main>
    </div>
  );
}
