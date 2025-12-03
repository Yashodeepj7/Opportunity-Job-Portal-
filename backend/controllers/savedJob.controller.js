import { SavedJob } from "../models/savedJob.model.js";

export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        // Already saved?
        const existing = await SavedJob.findOne({ user: userId, job: jobId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Job already saved",
            });
        }

        await SavedJob.create({ user: userId, job: jobId });

        return res.status(200).json({
            success: true,
            message: "Job Saved Successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        await SavedJob.findOneAndDelete({ user: userId, job: jobId });

        return res.status(200).json({
            success: true,
            message: "Job Unsaved Successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const saved = await SavedJob.find({ user: userId })
            .populate({
                path: "job",
                populate: { path: "company" }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            savedJobs: saved,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
