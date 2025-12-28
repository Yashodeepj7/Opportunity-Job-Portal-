import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { ThemeProvider } from "./components/context/ThemeContext";
import SavedJobs from './components/SavedJobs'
import InitialLoader from './components/InitialLoader'

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/saved-jobs", element: <SavedJobs /> },
  { path: "/description/:id", element: <JobDescription /> },
  { path: "/browse", element: <Browse /> },
  { path: "/profile", element: <Profile /> },

  { path:"/admin/companies", element: <ProtectedRoute><Companies/></ProtectedRoute> },
  { path:"/admin/companies/create", element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> },
  { path:"/admin/companies/:id", element:<ProtectedRoute><CompanySetup/></ProtectedRoute> },
  { path:"/admin/jobs", element:<ProtectedRoute><AdminJobs/></ProtectedRoute> },
  { path:"/admin/jobs/create", element:<ProtectedRoute><PostJob/></ProtectedRoute> },
  { path:"/admin/jobs/:id/applicants", element:<ProtectedRoute><Applicants/></ProtectedRoute> }
]);

function App() {
  const [showReactLoader, setShowReactLoader] = useState(true);

  useEffect(() => {
    // HTML loader remove after all js is loaded
    const htmlLoader = document.getElementById("initial-loader");
    if (htmlLoader) {
      htmlLoader.style.opacity = "0";
      htmlLoader.style.transition = "opacity 0.3s ease";
      setTimeout(() => htmlLoader.remove(), 300);
    }

    // React loader ko short delay ke baad hatao
    const timer = setTimeout(() => {
      setShowReactLoader(false);
    }, 500); // small delay, smooth handoff from HTML loader to React app

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {showReactLoader && <InitialLoader />}
      {!showReactLoader && <RouterProvider router={appRouter} />}
    </ThemeProvider>
  );
}

export default App;
