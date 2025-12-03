// controllers/job.controller.js
import { Job } from "../models/job.model.js";
import { FilterOptions } from "../models/filterOptions.model.js";

// ⭐ Convert Experience String -> Numeric Range (Industry Standard)
function parseExperience(exp) {
  if (!exp) return { min: 0, max: 99 };
  exp = exp.toLowerCase();

  if (exp.includes("fresher"))
    return { min: 0, max: 0 };

  const range = exp.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (range)
    return { min: parseInt(range[1]), max: parseInt(range[2]) };

  const plus = exp.match(/(\d+)\s*\+/);
  if (plus)
    return { min: parseInt(plus[1]), max: 99 };

  const single = exp.match(/(\d+)/);
  if (single)
    return { min: parseInt(single[1]), max: parseInt(single[1]) };

  return { min: 0, max: 99 };
}

// ⭐ Check if User Experience Range Overlaps Job Range
function isExperienceMatch(userExp, jobExp) {
  const { min: uMin, max: uMax } = parseExperience(userExp);
  const { min: jMin, max: jMax } = parseExperience(jobExp);

  return uMin <= jMax && uMax >= jMin;
}


// ADMIN POST JOB
// controllers/job.controller.js
export const postJob = async (req, res) => {
  try {
    const { 
      title, description, requirements, salary, location, jobType,
      experience, position, companyId, skills, category
    } = req.body;

    const userId = req.id;

    if (
      !title || !description || !requirements || !salary ||
      !location || !jobType || !experience || !position ||
      !companyId || !category
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false
      });
    }

    const reqArr = typeof requirements === "string"
      ? requirements.split(",").map(s => s.trim()).filter(Boolean)
      : Array.isArray(requirements) ? requirements : [];

    const skillsArr = (() => {
      if (!skills) return [];
      if (Array.isArray(skills)) return skills.map(s => s.trim()).filter(Boolean);
      if (typeof skills === "string") return skills.split(",").map(s => s.trim()).filter(Boolean);
      return [];
    })();

    const job = await Job.create({
      title,
      description,
      requirements: reqArr,
      skills: skillsArr,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      category,
      company: companyId,
      created_by: userId,
    });

    // ⭐ DUPLICATE SAFE PUSH HELPER
    const pushUnique = (arr, val) => {
      if (val && !arr.includes(val)) arr.push(val);
    };

    // 👉 UPDATE FILTER OPTIONS
    let filters = await FilterOptions.findOne();
    if (!filters) {
      filters = await FilterOptions.create({
        designations: [title],
        experiences: [experience],
        locations: [location],
        skills: skillsArr,
        categories: [category]
      });
    } else {
      pushUnique(filters.designations, title);
      pushUnique(filters.experiences, experience);
      pushUnique(filters.locations, location);

      if (!filters.categories) filters.categories = [];
      pushUnique(filters.categories, category);

      skillsArr.forEach(s => pushUnique(filters.skills, s));

      await filters.save();
    }

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// STUDENT - GET ALL JOBS (FILTER ENABLED)
// STUDENT - GET ALL JOBS (IMPROVED & PRODUCTION LEVEL)
export const getAllJobs = async (req, res) => {
  try {
    const {
      designation = "",
      experience = "",
      location = "",
      skills = "",
      category = ""
    } = req.query;

    // MONGO QUERY (INITIAL — non-experience filters)
    const mongoQuery = {};

    // -------------------------------------------
    // 1) KEYWORD SEARCH (Designation)
    // -------------------------------------------
    if (designation) {
      const keywords = designation.split(",").map(k => k.trim()).filter(Boolean);

      mongoQuery.$or = [
        ...keywords.map(k => ({ title: { $regex: k, $options: "i" } })),
        ...keywords.map(k => ({ description: { $regex: k, $options: "i" } })),
        ...keywords.map(k => ({ skills: { $elemMatch: { $regex: k, $options: "i" } } })),
        ...keywords.map(k => ({ requirements: { $elemMatch: { $regex: k, $options: "i" } } }))
      ];
    }

    // -------------------------------------------
    // 2) CATEGORY FILTER
    // -------------------------------------------
    if (category) {
      const cats = category.split(",").map(c => c.trim());
      mongoQuery.category = { $in: cats.map(c => new RegExp(c, "i")) };
    }

    // -------------------------------------------
    // 3) LOCATION FILTER
    // -------------------------------------------
    if (location) {
      const locs = location.split(",").map(l => l.trim());
      mongoQuery.location = { $in: locs.map(l => new RegExp(l, "i")) };
    }

    // -------------------------------------------
    // 4) SKILLS FILTER
    // -------------------------------------------
    if (skills) {
      const skillArr = skills.split(",").map(s => s.trim());

      mongoQuery.$or = mongoQuery.$or || [];
      mongoQuery.$or.push(
        { skills: { $in: skillArr.map(s => new RegExp(s, "i")) } },
        { requirements: { $in: skillArr.map(s => new RegExp(s, "i")) } }
      );
    }

    // -------------------------------------------
    // GET JOBS BEFORE EXPERIENCE FILTER
    // -------------------------------------------
    let jobs = await Job.find(mongoQuery)
      .populate("company")
      .sort({ createdAt: -1 });

    // -------------------------------------------
    // 5) EXPERIENCE MATCH (Naukri style)
    // -------------------------------------------
    if (experience) {
      const expFilters = experience.split(",").map(e => e.trim());

      jobs = jobs.filter(job =>
        expFilters.some(userExp =>
          isExperienceMatch(userExp, job.experienceLevel)
        )
      );
    }

    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error("❌ Job Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





// GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("company")
      .populate("applications");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


// ADMIN JOBS
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });

  } catch (error) {
    console.log(error);
  }
};
