import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

const experienceOptions = [
  "Fresher",
  "1+ Years",
  "2+ Years",
  "3+ Years",
  "0–1 Years",
  "0–2 Years",
  "1–3 Years",
  "2–5 Years"
];

const categoryOptions = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Data Science",
  "Graphic Designer",
  "UI/UX Designer",
  "Business Analyst",
  "Software Tester",
  "DevOps Engineer",
  "Mobile Developer"
];

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    category: "",
    position: 0,
    companyId: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectCompany = (value) => {
    const selected = companies.find((comp) => comp.name.toLowerCase() === value);
    setInput({ ...input, companyId: selected._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center w-screen mt-8 mb-10">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl w-full bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl"
        >
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Post a New Job</h1>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label className="dark:text-gray-300">Job Title</Label>
              <Input name="title" value={input.title} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            <div>
              <Label className="dark:text-gray-300">Description</Label>
              <Input name="description" value={input.description} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            <div className="col-span-2">
              <Label className="dark:text-gray-300">Requirements (comma separated)</Label>
              <Input name="requirements" value={input.requirements} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            {/* ⭐ NEW — CATEGORY FIELD */}
            <div>
              <Label className="dark:text-gray-300">Category</Label>
              <Select onValueChange={(value) => setInput({ ...input, category: value })}>
                <SelectTrigger className="dark:bg-[#111827] dark:border-gray-700 dark:text-white my-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="col-span-2">
              <Label className="dark:text-gray-300">Skills (comma separated)</Label>
              <Input name="skills" value={input.skills} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            <div>
              <Label className="dark:text-gray-300">Salary (LPA)</Label>
              <Input name="salary" value={input.salary} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            <div>
              <Label className="dark:text-gray-300">Location</Label>
              <Input name="location" value={input.location} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            <div>
              <Label className="dark:text-gray-300">Job Type</Label>
              <Input name="jobType" value={input.jobType} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            <div>
              <Label className="dark:text-gray-300">Experience Level</Label>
              <Select onValueChange={(value) => setInput({ ...input, experience: value })}>
                <SelectTrigger className="dark:bg-[#111827] dark:border-gray-700 dark:text-white my-1">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {experienceOptions.map((exp) => (
                      <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dark:text-gray-300">Number of Positions</Label>
              <Input type="number" name="position" value={input.position} onChange={changeEventHandler}
                className="my-1 dark:bg-[#111827] dark:border-gray-700 dark:text-white" />
            </div>

            {companies.length > 0 && (
              <div className="col-span-2">
                <Label className="dark:text-gray-300">Select Company</Label>
                <Select onValueChange={selectCompany}>
                  <SelectTrigger className="w-full dark:bg-[#111827] dark:border-gray-700 dark:text-white my-1">
                    <SelectValue placeholder="Choose company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((comp) => (
                        <SelectItem key={comp._id} value={comp.name.toLowerCase()}>
                          {comp.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {loading ? (
            <Button className="w-full my-5">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Posting…
            </Button>
          ) : (
            <Button className="w-full my-5">Post Job</Button>
          )}

          {companies.length === 0 &&
            <p className="text-xs text-red-500 text-center mt-2">
              *Please register a company first before posting jobs*
            </p>}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
