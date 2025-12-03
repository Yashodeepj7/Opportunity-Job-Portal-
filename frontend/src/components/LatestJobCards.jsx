import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Users } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="
        group cursor-pointer rounded-xl overflow-hidden 
        bg-white dark:bg-[#0d1117] shadow-md 
        border border-gray-200 dark:border-[#1f2937]
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
      "
    >
      {/* ==== TOP GRADIENT HEADER (CALM & PROFESSIONAL) ==== */}
      <div className="
        h-20 w-full 
        bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#9333ea]
        dark:from-[#1e3a8a] dark:via-[#6d28d9] dark:to-[#a21caf]
        relative
      ">
        {/* Logo Box */}
        <div className="
          absolute -bottom-6 left-4 
          h-14 w-17 bg-white dark:bg-[#111827] 
          rounded-xl shadow-md p-0 flex justify-center items-center
        ">
          <img
            src={job?.company?.logo}
            alt="Logo"
            className="h-full w-full object-contain rounded-lg"
          />
        </div>
      </div>

      {/* ==== CARD CONTENT ==== */}
      <div className="pt-8 px-4 pb-4">
        
        <h1 className="text-sm font-semibold flex items-center gap-1 dark:text-gray-300">
          <Building2 size={15} /> {job?.company?.name}
        </h1>

        <h2 className="font-bold text-lg mt-1 dark:text-white">
          {job?.title}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {job?.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3">
          <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {job?.jobType}
          </Badge>
          <Badge className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Actively Hiring
          </Badge>
        </div>

        {/* Extra Info (location + positions) */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users size={15} /> {job?.position} Positions
          </span>

          <span className="flex items-center gap-1">
            <MapPin size={15} /> {job?.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
