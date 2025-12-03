import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [showFilter, setShowFilter] = useState(false); // MOBILE POPUP STATE

  useEffect(() => {
    const sq = searchedQuery || {};
    const designation = (sq.designation || "").toLowerCase();
    const experienceCSV = (sq.experience || "").toLowerCase();
    const location = (sq.location || "").toLowerCase();
    const skillsCSV = (sq.skills || "").toLowerCase();

    const designations = designation ? designation.split(",").map(s => s.trim()).filter(Boolean) : [];
    const experiences = experienceCSV ? experienceCSV.split(",").map(s => s.trim()).filter(Boolean) : [];
    const locations = location ? location.split(",").map(s => s.trim()).filter(Boolean) : [];
    const skills = skillsCSV ? skillsCSV.split(",").map(s => s.trim()).filter(Boolean) : [];

    const filtered = allJobs.filter((job) => {
      const title = (job?.title || "").toLowerCase();
      const exp = (job?.experienceLevel || "").toLowerCase();
      const loc = (job?.location || "").toLowerCase();
      const reqs = (job?.requirements || []).map((r) => (r || "").toLowerCase());

      const matchDesignation = designations.length
        ? designations.some((d) => title.includes(d))
        : true;

      const matchLocation = locations.length
        ? locations.some((l) => loc.includes(l))
        : true;

      const matchSkills = skills.length
        ? skills.some((s) => reqs.some((r) => r.includes(s)))
        : true;

      const matchExperience = experiences.length
        ? experiences.some((uExp) => exp.includes(uExp.split(" ")[0]))
        : true;

      return matchDesignation && matchLocation && matchSkills && matchExperience;
    });

    setFilterJobs(filtered);
  }, [allJobs, searchedQuery]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* --- TOP FILTER BUTTON FOR MOBILE --- */}
      <div className="md:hidden flex justify-end mx-4 mt-4">
        <button
          onClick={() => setShowFilter(true)}
          className="px-4 py-2 bg-[#6A38C2] text-white rounded-lg shadow-md"
        >
          Filters
        </button>
      </div>

      {/* --- PAGE LAYOUT --- */}
      <div className="max-w-7xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-5">

        {/* DESKTOP SIDEBAR FILTER */}
        <div className="hidden md:block">
          <FilterCard />
        </div>

        {/* JOB GRID */}
        <div className="flex-1 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-3 md:px-0">
            {filterJobs.length > 0 ? (
              filterJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Job job={job} />
                </motion.div>
              ))
            ) : (
              <span>No matching jobs found</span>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE FILTER POPUP (MODAL) --- */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start p-4">
          <div className="bg-white dark:bg-[#0d1117] w-full max-w-md rounded-xl shadow-xl p-4 mt-10 animate-slideDown">

            {/* CLOSE BUTTON */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={() => setShowFilter(false)}
                className="text-red-500 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            {/* FULL FILTER UI */}
            <FilterCard />

            {/* APPLY BUTTON */}
            <button
              onClick={() => setShowFilter(false)}
              className="mt-4 w-full py-2 bg-[#6A38C2] text-white rounded-lg shadow"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
