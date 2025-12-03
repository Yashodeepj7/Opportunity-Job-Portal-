import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Briefcase, MapPin, Users, IndianRupeeIcon } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  // PROFILE COMPLETION CHECK
  const profileFields = {
    resume: !!user?.profile?.resume,
    skills: user?.profile?.skills?.length > 0,
    bio: !!user?.profile?.bio,
  };
  const totalFields = 3;
  const completedFields = Object.values(profileFields).filter(Boolean).length;
  const isProfileIncomplete = completedFields < totalFields;

  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          if (user) {
            setIsApplied(
              res.data.job.applications?.some((app) => app.applicant === user._id)
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Login karo pehle — tabhi apply kar paoge.");
      navigate("/login");
      return;
    }
    if (isProfileIncomplete) {
      toast.error("Profile complete karo pehle.");
      navigate("/profile");
      return;
    }

    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsApplied(true);
        const updated = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user._id }],
        };
        dispatch(setSingleJob(updated));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying job");
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-6 px-4 md:px-0">

      {/* PROFILE INCOMPLETE WARNING */}
      {user && isProfileIncomplete && (
        <div className="mb-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200">
            ⚠ Complete your profile to apply.
          </p>

          <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full mt-2">
            <div
              className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
              style={{ width: `${Math.floor((completedFields / totalFields) * 100)}%` }}
            ></div>
          </div>

          <p className="text-sm mt-1 dark:text-gray-300">
            {Math.floor((completedFields / totalFields) * 100)}% completed
          </p>

          <Button
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/profile")}
          >
            Complete Profile
          </Button>
        </div>
      )}

      {/* HEADER SECTION — RESPONSIVE */}
      <div className="
          bg-white dark:bg-[#0d1117] p-4 md:p-6 rounded-xl shadow-md 
          border border-gray-200 dark:border-gray-700
      ">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">

          {/* LOGO + TEXT */}
          <div className="flex gap-4 items-center md:items-start">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={singleJob?.company?.logo}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold dark:text-white">
                {singleJob?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {singleJob?.company?.name}
              </p>

              {/* BADGES MOBILE WRAP */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge className="bg-blue-400 dark:bg-blue-900 dark:text-blue-300 text-xs md:text-sm">
                  <Users size={15} /> {singleJob?.position} Positions
                </Badge>

                <Badge className="bg-orange-400 dark:bg-orange-900 dark:text-orange-300 text-xs md:text-sm">
                  <Briefcase size={15} /> {singleJob?.jobType}
                </Badge>

                <Badge className="bg-purple-400 dark:bg-purple-900 dark:text-purple-300 text-xs md:text-sm">
                  <IndianRupeeIcon size={15} /> {singleJob?.salary} LPA
                </Badge>
              </div>
            </div>
          </div>

          {/* APPLY BUTTON — RESPONSIVE */}
          {user ? (
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`
                w-full md:w-auto px-6 py-3 text-sm md:text-lg rounded-lg shadow-md
                ${isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad] text-white"
                }
              `}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          ) : (
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={() => navigate("/login")}
                className="w-full md:w-auto px-6 py-3 text-sm md:text-lg rounded-lg bg-[#7209b7] text-white"
              >
                Login to Apply
              </Button>

              <Button
                onClick={() => navigate("/signup")}
                className="w-full md:w-auto px-6 py-3 text-sm md:text-lg rounded-lg bg-[#7209b7] text-white"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="mt-6 bg-white dark:bg-[#0d1117] p-4 md:p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">

        <h2 className="text-lg md:text-xl font-bold mb-4 dark:text-white">Job Details</h2>

        <div className="space-y-3 text-sm md:text-base">

          <p>
            <span className="font-semibold dark:text-gray-200">Role: </span>
            <span className="text-gray-700 dark:text-gray-300">{singleJob?.title}</span>
          </p>

          <p>
            <span className="font-semibold dark:text-gray-200">Location: </span>
            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <MapPin size={16} /> {singleJob?.location}
            </span>
          </p>

          <p>
            <span className="font-semibold dark:text-gray-200">Experience: </span>
            <span className="text-gray-700 dark:text-gray-300">
              {singleJob?.experienceLevel}
            </span>
          </p>

          <p>
            <span className="font-semibold dark:text-gray-200">Salary: </span>
            <span className="text-gray-700 dark:text-gray-300">
              {singleJob?.salary} LPA
            </span>
          </p>

          <p>
            <span className="font-semibold dark:text-gray-200">Applicants: </span>
            <span className="text-gray-700 dark:text-gray-300">
              {singleJob?.applications?.length || 0}
            </span>
          </p>

          {/* SKILLS LIST */}
          {singleJob?.skills?.length > 0 && (
            <div className="mt-3">
              <h3 className="font-semibold mb-2 dark:text-gray-200">Required Skills:</h3>
              <div className="flex gap-2 flex-wrap">
                {singleJob.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-green-500 dark:bg-green-900 dark:text-green-300 px-3 py-1 text-xs md:text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 dark:text-gray-200">Job Description</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {singleJob?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
