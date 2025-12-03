import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

import { sendEmail } from "../utils/sendEmail.js";
import { welcomeStudentEmail } from "../emailTemplates/welcomeStudent.js";
import { welcomeRecruiterEmail } from "../emailTemplates/welcomeRecruiter.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Profile image file is missing. Please upload a file.",
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create new user
    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    // SEND WELCOME EMAIL (right here)
    try {
      if (role === "student") {
        await sendEmail(
          email,
          "Welcome to Opportunity 🎉",
          welcomeStudentEmail(fullname)
        );
      } else if (role === "recruiter") {
        await sendEmail(
          email,
          "Welcome Recruiter 🧑‍💼",
          welcomeRecruiterEmail(fullname)
        );
      }
    } catch (emailErr) {
      console.log("Email sending failed:", emailErr);
    }

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
        
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false
      });
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    const isProd = process.env.NODE_ENV === "production";

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProd,                            // ✅ prod me https required
        sameSite: isProd ? "none" : "lax",         // ✅ Vercel + Railway ke liye
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 0,
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // -------- UPDATE BASIC FIELDS --------
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        // -------- FILE HANDLING (optional) --------
        if (req.file) {
            const file = req.file;
            const fileUri = getDataUri(file);

            const isImage = file.mimetype.startsWith("image/");
            const isPDF = file.mimetype === "application/pdf";

            let cloudResponse;

            // ⭐ If image → upload as IMAGE
            if (isImage) {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "profile_photos",
                    resource_type: "image",
                });

                user.profile.profilePhoto = cloudResponse.secure_url;
            }

            // ⭐ If PDF → upload as RAW
            // If PDF → upload normally with resource_type: "auto"
if (isPDF) {
    cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "resumes",
        resource_type: "auto",  // ⭐ magic fix ⭐
        public_id: `${userId}_resume`,
        use_filename: true,
        unique_filename: false,
        format: "pdf"
    });

    user.profile.resume = cloudResponse.secure_url;
    user.profile.resumeOriginalName = file.originalname;
}
        }

        // SAVE UPDATED USER
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while updating profile",
            success: false
        });
    }
};
