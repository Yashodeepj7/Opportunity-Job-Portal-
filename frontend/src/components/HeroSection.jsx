import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import "./HeroSection.css";

const HeroSection = () => {
  const [designation, setDesignation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [location, setLocation] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load Designations
// Load Designations
const loadDesignations = async (inputValue) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/job/options?query=${inputValue}&type=designation`
    );

    // ⭐ Unique results
    let list = [...new Set(data.items)];

    // ⭐ Latest 4 when user not typing
    if (!inputValue) {
      list = list.slice(-4);
    }

    return list.map((d) => ({ value: d, label: d }));
  } catch {
    return [];
  }
};

const loadLocations = async (inputValue) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/job/options?query=${inputValue}&type=location`
    );

    let list = [...new Set(data.items)];

    if (!inputValue) {
      list = list.slice(-4);
    }

    return list.map((l) => ({ value: l, label: l }));
  } catch {
    return [];
  }
};




  // Experience defaults
  const experienceOptions = [
    "Fresher",
    "1 Year",
    "2 Years",
    "3 Years",
    "4+ Years",
  ];

  const loadExperience = async (inputValue) => {
    return experienceOptions
      .filter((exp) => exp.toLowerCase().includes(inputValue.toLowerCase()))
      .map((exp) => ({ value: exp, label: exp }));
  };

  // Search Handler
  const searchJobHandler = () => {
    dispatch(
      setSearchedQuery({
        designation: designation.map((d) => d.value).join(",") || "",
        experience: experience.map((e) => e.value).join(",") || "",
        location: location.map((l) => l.value).join(",") || "",
      })
    );

    navigate("/browse?fromSearch=true");
  };

  return (
    <div className="hero-container">
      <div className="hero-text">
        <span className="badge">Your Shortcut to New Jobs</span>
        <h1>
          Search, Apply & <br /> Get Your <span className="highlight">Dream Jobs</span>
        </h1>
        <p>Find the best job based on your experience, designation, and location.</p>
      </div>

      <div className="search-bar">
        <div className="input-group">
          <AsyncSelect
            cacheOptions
            loadOptions={loadDesignations}
            defaultOptions
            value={designation}
            onChange={setDesignation}
            placeholder="Select Designation(s)"
            isClearable
            isMulti
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="input-group">
          <AsyncSelect
            cacheOptions
            loadOptions={loadExperience}
            defaultOptions={experienceOptions.map((exp) => ({
              value: exp,
              label: exp,
            }))}
            value={experience}
            onChange={setExperience}
            placeholder="Select Experience"
            isMulti
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="input-group">
          <AsyncSelect
            cacheOptions
            loadOptions={loadLocations}
            defaultOptions
            value={location}
            onChange={setLocation}
            placeholder="Select Location(s)"
            isClearable
            isMulti
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <Button onClick={searchJobHandler} className="search-btn">
          <Search className="search-icon" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
