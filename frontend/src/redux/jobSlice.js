import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
  allAdminJobs: [],
  singleJob: null,
  searchJobByText: "",
  allAppliedJobs: [],
  savedJobs: [],
  searchedQuery: {
    designation: "",
    experience: "",
    location: "",
    jobType: "",
    skills: "",
    sort: "",
  },
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },

    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },

    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },

    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },

    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },

    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },

    addSavedJob: (state, action) => {
      state.savedJobs.push(action.payload);
    },

    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(
        (item) => item?.job?._id !== action.payload
      );
    },

    // ⭐ RESET when logout
    resetJobState: (state) => {
      state.savedJobs = [];
      state.allAppliedJobs = [];
      state.singleJob = null;
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  resetJobState,
} = jobSlice.actions;

export default jobSlice.reducer;
