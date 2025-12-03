// RoleLogin.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import { useNavigate, Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const animUrls = {
  recruiter: "https://lottie.host/12a592e3-62ed-4513-b144-b6cabcd6abb7/A85DdWzZdY.lottie",
  student: "https://lottie.host/78f7889d-f724-45e6-932c-8b6fe01e4cb3/Qqbb133Ops.lottie"
}; 

const RoleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useSelector((store) => store.auth);

  const [role, setRole] = useState("student");
  const [input, setInput] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRoleClick = (r) => {
    setRole(r);
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        { ...input, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed, please try again");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
      <Navbar className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#111827]" />
      <div className="pt-20 flex items-center justify-center w-full px-4">
        <div className="flex w-full max-w-4xl bg-white dark:bg-[#111827] rounded-xl overflow-hidden shadow-lg">
          {/* Left side animation */}
          <div className="w-1/2 bg-gray-100 dark:bg-[#1f2937] items-center justify-center hidden md:flex">
            <DotLottieReact
              src={animUrls[role]}
              loop
              autoplay
              style={{ width: "100%", height: "100%", maxWidth: "320px" }}
            />
          </div>

          {/* Right side form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold dark:text-white">
                Login as {role === "student" ? "Student" : "Recruiter"}
              </h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleRoleClick("student")}
                  className={`px-4 py-2 rounded-full ${
                    role === "student"
                      ? "bg-[#6A38C2] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleClick("recruiter")}
                  className={`px-4 py-2 rounded-full ${
                    role === "recruiter"
                      ? "bg-[#6A38C2] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full py-3 mt-4">
                {loading ? "Please wait…" : "Login"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;
