import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { saveJob, unsaveJob, getSavedJobs } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.get("/save/:id", isAuthenticated, saveJob);
router.get("/unsave/:id", isAuthenticated, unsaveJob);
router.get("/saved", isAuthenticated, getSavedJobs);

export default router;
