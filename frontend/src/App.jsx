import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/accounts/Login'
import EmployerRegister from './pages/accounts/EmployerRegister'
import JobseekerRegister from './pages/accounts/JobseekerRegister'
import Home from './pages/home/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'


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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
