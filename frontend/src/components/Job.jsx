import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck, MapPin, CalendarDays, Briefcase } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { SAVED_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addSavedJob, removeSavedJob } from "@/redux/jobSlice";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const locationPath = useLocation().pathname;

  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);

  const jobId = job?._id;

  // ⭐ Check if this job is already saved (from redux)
  const isAlreadySaved = savedJobs?.some((item) => item?.job?._id === jobId || item?._id === jobId);

  const [saved, setSaved] = useState(isAlreadySaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(isAlreadySaved);
  }, [isAlreadySaved]);

  const saveUnsaveHandler = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!saved) {
        // SAVE JOB
        const res = await axios.get(`${SAVED_API_END_POINT}/save/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setSaved(true);
          dispatch(addSavedJob(job));
          toast.success("Job Saved");
        }
      } else {
        // UNSAVE JOB
        const res = await axios.get(`${SAVED_API_END_POINT}/unsave/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setSaved(false);
          dispatch(removeSavedJob(jobId));
          toast.success("Removed from Saved Jobs");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something Went Wrong");
    }

    setLoading(false);
  };

  const daysAgo = (time) => {
    if (!time) return "";
    const diff = new Date() - new Date(time);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="
      group p-5 rounded-xl shadow-md 
      bg-white dark:bg-[#0d1117] 
      border border-gray-200 dark:border-gray-700 
      transition-all duration-300 
      hover:shadow-xl hover:-translate-y-1
    ">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarDays size={14} />
          {daysAgo(job?.createdAt) === 0 ? "Today" : `${daysAgo(job?.createdAt)} days ago`}
        </p>

        {/* Bookmark Icon */}
        <button onClick={saveUnsaveHandler} disabled={loading}>
          {saved ? (
            <BookmarkCheck className="text-purple-600" size={20} />
          ) : (
            <Bookmark size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* COMPANY */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 border rounded-xl overflow-hidden p-1 dark:border-gray-600">
          <Avatar className="h-full w-full">
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </div>

        <div>
          <h2 className="font-semibold text-[17px]">{job?.company?.name}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin size={14} /> {job?.location}
          </p>
        </div>
      </div>

      {/* JOB TITLE */}
      <div className="mt-4">
        <h1 className="font-bold text-lg">{job?.title}</h1>
        <p className="text-sm text-muted-foreground line-clamp-2">{job?.description}</p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200">
          <Briefcase size={14} className="mr-1" /> {job?.jobType}
        </Badge>

        <Badge variant="secondary">{job?.position} Positions</Badge>

        <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-5">
        <Button
          onClick={() => navigate(`/description/${jobId}`)}
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          View Details
        </Button>

        {/* ⭐ CHANGE BUTTON TEXT AUTOMATICALLY */}
        <Button
          onClick={saveUnsaveHandler}
          disabled={loading}
          className={`bg-[#6A38C2] hover:bg-[#582fa7] text-white`}
        >
          {loading ? "..." : saved ? "Saved" : "Save Job"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
