import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSavedJobs } from "@/redux/jobSlice";
import Job from "./Job";
import { Link, useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // agar user logged-out hai, redirect ya koi prompt
      navigate("/login");
      return;
    }
    const fetchSaved = async () => {
      try {
        const res = await axios.get("https://opportunity-backend-f608.up.railway.app/api/v1/saved/saved", {
          withCredentials: true,
        });
        dispatch(setSavedJobs(res.data.savedJobs));
      } catch (err) {
        console.error("Error fetching saved jobs", err);
        dispatch(setSavedJobs([]));
      }
    };
    fetchSaved();
  }, [user, dispatch, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Please <Link to="/login" className="text-blue-600">Login</Link> to view your saved jobs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-5 grid grid-cols-3 gap-5">
        {savedJobs.length > 0 ? (
          savedJobs.map((item) => <Job key={item._id} job={item.job} />)
        ) : (
          <p>No saved jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
