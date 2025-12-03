import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { FilterOptions } from "../models/filterOptions.model.js";
import dotenv from "dotenv";
dotenv.config();

const rebuildFilters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");

    const jobs = await Job.find();

    const designations = [...new Set(jobs.map(j => j.title))];
    const locations = [...new Set(jobs.map(j => j.location))];
    const experiences = [...new Set(jobs.map(j => j.experienceLevel))];
    const categories = [...new Set(jobs.map(j => j.category))];

    // Extract all skills (array merge)
    const skills = [
      ...new Set(
        jobs
          .map(j => j.skills || [])
          .flat()
          .filter(Boolean)
      )
    ];

    await FilterOptions.deleteMany({});
    await FilterOptions.create({
      designations,
      locations,
      experiences,
      skills,
      categories
    });

    console.log("FilterOptions successfully rebuilt!");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

rebuildFilters();
