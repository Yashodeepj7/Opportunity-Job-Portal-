import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  // 🔥 Cache to prevent repeated API calls
  const cacheRef = useRef({});
  const debounceRef = useRef(null);

  useEffect(() => {
    // Convert query object → key string for caching
    const queryKey = JSON.stringify(searchedQuery);

    // ✔ If same query exists in cache → use cached result
    if (cacheRef.current[queryKey]) {
      dispatch(setAllJobs(cacheRef.current[queryKey]));
      return;
    }

    const fetchAllJobs = async () => {
      try {
        const params = new URLSearchParams();

        if (searchedQuery.designation) params.append("designation", searchedQuery.designation);
        if (searchedQuery.experience) params.append("experience", searchedQuery.experience);
        if (searchedQuery.location) params.append("location", searchedQuery.location);
        if (searchedQuery.jobType) params.append("jobType", searchedQuery.jobType);
        if (searchedQuery.skills) params.append("skills", searchedQuery.skills);
        if (searchedQuery.sort) params.append("sort", searchedQuery.sort);
        if (searchedQuery.category) params.append("category", searchedQuery.category);

        const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, {
          withCredentials: true
        });

        if (res.data.success) {
          // 🔥 Cache the result
          cacheRef.current[queryKey] = res.data.jobs;

          dispatch(setAllJobs(res.data.jobs));
        } else {
          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.log("useGetAllJobs error:", error);
        dispatch(setAllJobs([]));
      }
    };

    //  Debounce API calls → avoid spam until typing stops
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchAllJobs, 300);

    return () => clearTimeout(debounceRef.current);

  }, [searchedQuery, dispatch]);
};

export default useGetAllJobs;
