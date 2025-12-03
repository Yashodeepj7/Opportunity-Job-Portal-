import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    // ⭐ PROFILE COMPLETION SYSTEM
    const profileFields = {
        resume: !!user?.profile?.resume,
        skills: user?.profile?.skills?.length > 0,
        bio: !!user?.profile?.bio,
    };

    const totalFields = 3;
    const completedFields = Object.values(profileFields).filter(Boolean).length;
    const profileCompletionPercentage = Math.floor((completedFields / totalFields) * 100);

    const strengthLabel =
        profileCompletionPercentage < 40
            ? "Weak"
            : profileCompletionPercentage < 75
            ? "Good"
            : "Strong";

    return (
        <div className="min-h-screen bg-background text-foreground transition-all">
            <Navbar />

            {/* ⭐ COVER PHOTO (LinkedIn Style) */}
            <div className="w-full h-40 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 shadow-lg"></div>

            {/* ⭐ PROFILE CARD */}
            <div className="
                max-w-4xl mx-auto -mt-16 p-8 rounded-2xl relative
                bg-white border border-gray-200 shadow-xl
                dark:bg-[#0d1117] dark:border-gray-700 dark:text-gray-200
            ">

                {/* PROFILE HEADER */}
                <div className="flex justify-between items-start">

                    <div className="flex items-center gap-5">

                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                            <Avatar className="w-full h-full">
                                <AvatarImage
                                    src={
                                        user?.profile?.profilePhoto ||
                                        "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                                    }
                                    alt="profile"
                                />
                            </Avatar>
                        </div>

                        <div>
                            <h1 className="font-semibold text-2xl dark:text-white">{user?.fullname}</h1>

                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                                {user?.profile?.bio || "No bio added yet"}
                            </p>

                            {/* ⭐ PROFILE STRENGTH */}
                            <div className="mt-3">
                                <p className="text-sm font-medium dark:text-gray-300">
                                    Profile Strength: <span className="font-bold">{strengthLabel}</span>
                                </p>

                                {/* Progress Bar */}
                                <div className="w-56 h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                                    <div
                                        className="h-full bg-green-600 dark:bg-green-400 transition-all"
                                        style={{ width: `${profileCompletionPercentage}%` }}
                                    ></div>
                                </div>

                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                    {profileCompletionPercentage}% Completed
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => setOpen(true)}
                        className="shadow-md"
                        variant="outline"
                    >
                        <Pen size={18} />
                    </Button>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-5"></div>

                {/* EMAIL + PHONE */}
                <div className="my-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Mail className="text-gray-600 dark:text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{user?.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Contact className="text-gray-600 dark:text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{user?.phoneNumber}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-5"></div>

                {/* SKILLS */}
                <div className="my-5">
                    <h1 className="font-semibold mb-2 dark:text-white">Skills</h1>

                    <div className="flex flex-wrap gap-2">
                        {user?.profile?.skills?.length > 0 ? (
                            user.profile.skills.map((item, index) => (
                                <Badge
                                    key={index}
                                    className="
                                        px-3 py-1 text-white text-sm shadow-sm 
                                        bg-gradient-to-r from-purple-500 to-blue-600 
                                        dark:from-purple-700 dark:to-blue-700 
                                        rounded-full
                                    "
                                >
                                    {item}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">No skills added</span>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-5"></div>

                {/* ⭐ RESUME SECTION */}
                <div className="grid w-full max-w-sm items-start gap-2">
                    <p className="text-md font-semibold dark:text-white">Resume</p>

                    {user?.profile?.resume ? (
                        <div className="flex flex-col items-start">
                            <a
                                target="_blank"
                                href={user?.profile?.resume}
                                className="
                                    flex items-center gap-2 px-4 py-2 
                                    bg-blue-600 hover:bg-blue-700 text-white
                                    rounded-lg shadow-sm transition
                                "
                            >
                                <FileText size={18} /> View Resume
                            </a>

                            {/* Filename Show */}
                            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                                {user?.profile?.resumeOriginalName}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                            No resume uploaded
                        </span>
                    )}
                </div>
            </div>

            {/* APPLIED JOBS */}
            <div className="
                max-w-4xl mx-auto my-10 p-6 rounded-2xl 
                bg-white dark:bg-[#0d1117] dark:text-gray-200 dark:border-gray-700
                shadow-lg
            ">
                <h1 className="font-bold text-lg my-5 dark:text-white">Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
