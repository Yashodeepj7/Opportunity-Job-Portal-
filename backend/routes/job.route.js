import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import { FilterOptions } from "../models/filterOptions.model.js";
import { Job } from "../models/job.model.js";
const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get( getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get( getJobById);

// ✅ Filter options route
// GET UNIQUE DESIGNATIONS / LOCATIONS
router.get("/options", async (req, res) => {
  try {
    const { query = "", type } = req.query;

    let field = "";
    if (type === "designation") field = "title";
    if (type === "location") field = "location";

    if (!field) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    // DISTINCT = Unique values directly from Job collection
    let items = await Job.distinct(field);

    // Apply search filter
    if (query) {
      const regex = new RegExp(query, "i");
      items = items.filter((v) => regex.test(v));
    }

    // Show latest 4 when no typing
    const list = !query ? items.slice(-4) : items;

    return res.json({
      success: true,
      items: list,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export default router;
