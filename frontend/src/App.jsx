import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/accounts/Login'
import EmployerRegister from './pages/accounts/EmployerRegister'
import JobseekerRegister from './pages/accounts/JobseekerRegister'
import Home from './pages/home/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import JobsList from './pages/jobs/JobList'
import JobDetail from './pages/jobs/JobDetails'
import CompanyDetails from './pages/companies/CompanyDetails'

import { Toaster } from "sonner";
import BlogPosts from './pages/blogs/BlogPosts'
import SalaryDetails from './pages/salaries/SalaryDetails'



const Logout = () => {
  localStorage.clear()
  return <Navigate to="/login" />
}


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/employer/register" element={<EmployerRegister />} />
        <Route path="/jobseeker/register" element={<JobseekerRegister />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobsList /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>} />
        <Route path="/blogs/:id" element={<ProtectedRoute><BlogPosts /></ProtectedRoute>} />
        <Route path="/salaries/:id" element={<ProtectedRoute><SalaryDetails /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-center" />

    </BrowserRouter>
  )
}

export default App
