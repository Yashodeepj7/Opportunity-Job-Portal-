import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, Moon, Sun, Heart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser, logoutUser } from "@/redux/authSlice";
import { resetJobState } from "@/redux/jobSlice";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ hideJobs = false }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(logoutUser());
        dispatch(resetJobState());
        dispatch({ type: "USER_LOGOUT" });

        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-background text-foreground border-b border-border">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/">Opport<span className="text-[#F83002]">unity</span></Link>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          {/* Nav Items */}
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li className="hover:text-[#F83002] transition">
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li className="hover:text-[#F83002] transition">
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li className="hover:text-[#F83002] transition">
                  <Link to="/">Home</Link>
                </li>

                {!hideJobs && (
                  <li className="hover:text-[#F83002] transition">
                    <Link to="/jobs">Jobs</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="p-2 rounded-full hover:bg-accent transition"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {/* Desktop Auth Section */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                </Avatar>
              </PopoverTrigger>

              {/* ⭐ FIXED DROPDOWN UI (RESTORED) */}
              <PopoverContent className="w-72 py-4 px-4 space-y-4">

                {/* Profile Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-300 dark:border-gray-700">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-3 text-gray-700 dark:text-gray-300">

                  {user.role === "student" && (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 hover:text-[#6A38C2]"
                      >
                        <User2 size={18} /> View Profile
                      </Link>

                      <Link
                        to="/saved-jobs"
                        className="flex items-center gap-3 hover:text-[#6A38C2]"
                      >
                        <Heart size={18} className="text-pink-600" />
                        Saved Jobs
                      </Link>
                    </>
                  )}

                  {/* Logout */}
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>

              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Header */}
        <div className="flex items-center md:hidden gap-4">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="p-2 rounded-full"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden p-5 border-t">
          <ul className="flex flex-col gap-4 font-medium">

            <li><Link to="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
            {!hideJobs && (
              <li><Link to="/jobs" onClick={() => setMobileOpen(false)}>Jobs</Link></li>
            )}

            {user?.role === "student" && (
              <>
                <li><Link to="/profile">View Profile</Link></li>
                <li><Link to="/saved-jobs">Saved Jobs ❤️</Link></li>
              </>
            )}

            {!user ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
              </>
            ) : (
              <li className="text-red-600" onClick={logoutHandler}>Logout</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(Navbar);
