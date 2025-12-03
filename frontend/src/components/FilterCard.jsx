import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://localhost:8000/api/v1/job/options";

const filterConfig = [
  { id: "designation", type: "Designation", quick: ["Frontend Developer", "React Developer", "Backend Developer"] },
  { id: "location", type: "Location", quick: ["Pune", "Mumbai", "Bangalore"] },
  { id: "experience", type: "Experience", quick: ["Fresher", "1 Year", "2+ Years"] },
  { id: "skills", type: "Skills", quick: ["React.js", "Node.js", "MongoDB", "JavaScript"] },
];

const FilterCard = () => {
  const dispatch = useDispatch();

  // Selected Filters
  const [filters, setFilters] = useState({
    designation: [],
    location: [],
    experience: [],
    skills: []
  });

  const [searchText, setSearchText] = useState("");
  const [openSection, setOpenSection] = useState("");
  const [liveOptions, setLiveOptions] = useState([]);

  // 🔍 Fetch LIVE options for skill / location / designation
  const fetchOptions = async (type, text) => {
    if (!text.trim()) return setLiveOptions([]);

    try {
      const res = await axios.get(`${API}?query=${text}&type=${type}`);

      setLiveOptions(res.data.items || []);

    } catch (e) {
      console.log(e);
    }
  };

  // Add a selected value
const addFilter = (type, value) => {
  setFilters((prev) => ({
    ...prev,
    [type]: [...new Set([...prev[type], value])]
  }));

  // ⭐ FIX — clear search box
  setSearchText("");

  // ⭐ FIX — suggestion list bhi hide karo
  setLiveOptions([]);
};


  // Remove selected chip
  const removeFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((i) => i !== value)
    }));
  };

  // 🎯 CLEAR ALL BUTTON
  const clearAll = () => {
    setFilters({
      designation: [],
      location: [],
      experience: [],
      skills: []
    });

    dispatch(
      setSearchedQuery({
        designation: "",
        location: "",
        experience: "",
        skills: "",
      })
    );
  };

  // 🚀 UPDATE REDUX WHEN FILTER CHANGES
  useEffect(() => {
    dispatch(
      setSearchedQuery({
        designation: filters.designation.join(","),
        location: filters.location.join(","),
        experience: filters.experience.join(","),
        skills: filters.skills.join(","),
      })
    );
  }, [filters]);

  return (
<div className="w-full md:w-[250px] p-5 rounded-xl bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 shadow-lg">
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-white">Filters</h2>

        <button onClick={clearAll} className="text-red-500 text-sm hover:underline">
          Clear All
        </button>
      </div>

      {filterConfig.map((sec) => (
        <div key={sec.id} className="mb-5">
          
          {/* Section Header */}
          <button
            className="flex justify-between w-full py-2 font-semibold dark:text-gray-200"
            onClick={() => setOpenSection(openSection === sec.id ? "" : sec.id)}
          >
            {sec.type}
            <ChevronDown
              className={`transition-transform ${openSection === sec.id ? "rotate-180" : ""}`}
            />
          </button>

          {/* Content */}
          <AnimatePresence>
            {openSection === sec.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-3 space-y-3 mt-2"
              >
                
                {/* Quick Tags */}
                <div className="flex gap-2 flex-wrap">
                  {sec.quick.map((q) => (
                    <span
                      key={q}
                      onClick={() => addFilter(sec.id, q)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm cursor-pointer hover:opacity-80"
                    >
                      {q}
                    </span>
                  ))}
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder={`Search ${sec.type}...`}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    fetchOptions(sec.id, e.target.value);
                  }}
                  className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 focus:outline-none"
                />

                {/* Live Options */}
                {liveOptions.length > 0 && (
                  <div className="space-y-1">
                    {liveOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => addFilter(sec.id, opt)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters[sec.id].map((chip) => (
                    <span
                      key={chip}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-200 dark:bg-purple-700 text-sm rounded-full"
                    >
                      {chip}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => removeFilter(sec.id, chip)}
                      />
                    </span>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
