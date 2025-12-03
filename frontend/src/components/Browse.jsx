import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";

const Browse = () => {
  const dispatch = useDispatch();
  useGetAllJobs();
  const location = useLocation();
  const isFromSearch = new URLSearchParams(location.search).get("fromSearch") === "true";

  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  // Auto clear filters on page leave
  useEffect(() => {
    return () => {
      dispatch(
        setSearchedQuery({
          designation: "",
          experience: "",
          location: "",
        })
      );
    };
  }, []);

  const clearFilters = () => {
    dispatch(
      setSearchedQuery({
        designation: "",
        experience: "",
        location: "",
      })
    );
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar hideJobs={isFromSearch} />

      <div className="max-w-7xl mx-auto my-6 px-4 md:px-0">
        
        {/* HEADER AREA RESPONSIVE */}
        <div className="flex flex-col md:flex-row justify-between md:items-center my-6 gap-4">
          <h1 className="font-bold text-lg md:text-xl">
            Search Results ({allJobs.length})
          </h1>

          {(searchedQuery?.designation ||
            searchedQuery?.experience ||
            searchedQuery?.location) && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 dark:text-white w-full md:w-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* JOB GRID RESPONSIVE */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 
          md:gap-6
        ">
          {allJobs.length > 0 ? (
            allJobs.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <p className="text-gray-500 dark:text-gray-300">
              No jobs found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
