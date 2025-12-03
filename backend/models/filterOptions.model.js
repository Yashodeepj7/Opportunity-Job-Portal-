// models/filterOptions.model.js
import mongoose from "mongoose";

const filterOptionsSchema = new mongoose.Schema({
  designations: [String],
  experiences: [String],
  locations: [String],
  skills: [String] // NEW - store skill suggestions
});

export const FilterOptions = mongoose.model("FilterOptions", filterOptionsSchema);
