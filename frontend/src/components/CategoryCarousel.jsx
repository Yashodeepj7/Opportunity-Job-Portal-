import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import {
  Code,
  Layers,
  Database,
  Palette,
  Cpu,
  PenTool,
  BarChart,
  Wrench,
  FileCode2,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./CategoryCarousel.css";

const categories = [
  { label: "Frontend Developer", icon: <Code size={22} /> },
  { label: "Backend Developer", icon: <Layers size={22} /> },
  { label: "FullStack Developer", icon: <Cpu size={22} /> },
  { label: "Data Science", icon: <Database size={22} /> },
  { label: "Graphic Designer", icon: <Palette size={22} /> },
  { label: "UI/UX Designer", icon: <PenTool size={22} /> },
  { label: "Business Analyst", icon: <BarChart size={22} /> },
  { label: "Software Tester", icon: <Wrench size={22} /> },
  { label: "DevOps Engineer", icon: <Globe size={22} /> },
  { label: "Mobile Developer", icon: <FileCode2 size={22} /> },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const pos = useRef({ left: 0, x: 0 });

  // ⭐ FINAL CORRECTED LOGIC — category search
  const searchJobHandler = (query) => {
    dispatch(
      setSearchedQuery({
  designation: "",
  experience: "",
  location: "",
  skills: "",
  jobType: "",
  category: query,
})

    );
    navigate("/browse");
  };

  const scrollByAmount = (amt) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: amt, behavior: "smooth" });
  };

  const onMouseDown = (e) => {
    if (!scrollerRef.current) return;
    setIsDragging(true);
    scrollerRef.current.classList.add("dragging");
    pos.current = {
      left: scrollerRef.current.scrollLeft,
      x: e.clientX,
    };
  };

  const onMouseMove = (e) => {
    if (!isDragging || !scrollerRef.current) return;
    const dx = e.clientX - pos.current.x;
    scrollerRef.current.scrollLeft = pos.current.left - dx;
  };

  const endDrag = () => {
    setIsDragging(false);
    if (scrollerRef.current) scrollerRef.current.classList.remove("dragging");
  };

  const onWheel = (e) => {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="category-wrapper">
      <h2 className="category-heading">Explore Job Categories</h2>

      <div className="category-rail">
        <button
          aria-label="Scroll Left"
          className="nav-btn left"
          onClick={() => scrollByAmount(-320)}
          type="button"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="category-scroll"
          ref={scrollerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={endDrag}
          onMouseUp={endDrag}
          onWheel={onWheel}
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => searchJobHandler(cat.label)}
            >
              <div className="category-icon">{cat.icon}</div>
              <p className="category-text">{cat.label}</p>
            </div>
          ))}
        </div>

        <button
          aria-label="Scroll Right"
          className="nav-btn right"
          onClick={() => scrollByAmount(320)}
          type="button"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CategoryCarousel;
