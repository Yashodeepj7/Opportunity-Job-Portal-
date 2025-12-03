import React, { useRef, useState, useEffect } from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from "lucide-react";
import '../App.css'
const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const scrollRef = useRef(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -350, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 350, behavior: "smooth" });
    };

    // Update button states when scrolling
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        const atLeft = el.scrollLeft <= 0;
        const atRight = el.scrollWidth - el.clientWidth - el.scrollLeft <= 5;

        setCanScrollLeft(!atLeft);
        setCanScrollRight(!atRight);
    };

    // Initial update after first render
    useEffect(() => {
        handleScroll();
    }, [allJobs]);

    return (
        <div className="max-w-7xl mx-auto my-20">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className='text-4xl font-bold'>
                    <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
                </h1>

                <button
                    onClick={() => window.location.href = "/browse"}
                    className="text-[#6A38C2] font-medium hover:underline"
                >
                    View All
                </button>
            </div>

            {/* Scroll Wrapper */}
            <div className="relative">

                {/* Left Button */}
                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`
                        hidden md:flex
                        absolute -left-6 top-1/2 -translate-y-1/2 z-20
                        bg-white dark:bg-[#1e293b] shadow-md p-3 rounded-full border
                        border-gray-200 dark:border-gray-700 transition
                        ${canScrollLeft ? "opacity-100" : "opacity-30 cursor-default"}
                    `}
                >
                    <ChevronLeft size={22} />
                </button>

                {/* Scrollable Cards */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="
                        flex gap-4 overflow-x-auto scroll-smooth py-2 px-3
                        hide-scrollbar
                    "
                >
                    {allJobs.slice(0, 6).map(job => (
                        <div key={job._id} className="min-w-[300px]">
                            <LatestJobCards job={job} />
                        </div>
                    ))}
                </div>

                {/* Right Button */}
                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`
                        hidden md:flex
                        absolute -right-6 top-1/2 -translate-y-1/2 z-20
                        bg-white dark:bg-[#1e293b] shadow-md p-3 rounded-full border
                        border-gray-200 dark:border-gray-700 transition
                        ${canScrollRight ? "opacity-100" : "opacity-30 cursor-default"}
                    `}
                >
                    <ChevronRight size={22} />
                </button>
            </div>
        </div>
    );
};

export default LatestJobs;
