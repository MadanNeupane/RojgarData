import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/accounts/Login';
import Logout from './pages/accounts/Logout';
import EmployerRegister from './pages/accounts/EmployerRegister';
import JobseekerRegister from './pages/accounts/JobseekerRegister';
import Home from './pages/home/Home';
import About from './pages/home/About';
import NotFound from './pages/NotFound';
import JobsList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetails';
import CompanyList from './pages/companies/CompanyList';
import CompanyDetails from './pages/companies/CompanyDetails';
import BlogList from './pages/blogs/BlogList';
import BlogPosts from './pages/blogs/BlogPosts';
import SalaryList from './pages/salaries/SalaryList';
import SalaryDetails from './pages/salaries/SalaryDetails';


const routes = [
  { path: '/', element: <Home /> },
  { path: '/About', element: <About /> },
  { path: '/login', element: <Login /> },
  { path: '/logout', element: <Logout /> },
  { path: '/employer/register', element: <EmployerRegister /> },
  { path: '/jobseeker/register', element: <JobseekerRegister /> },
  { path: '/jobs', element: <JobsList /> },
  { path: '/jobs/:id', element: <JobDetail /> },
  { path: '/companies', element: <CompanyList /> },
  { path: '/companies/:id', element: <CompanyDetails /> },
  { path: '/blogs', element: <BlogList /> },
  { path: '/blogs/:id', element: <BlogPosts /> },
  { path: '/salaries', element: <SalaryList /> },
  { path: '/salaries/:id', element: <SalaryDetails /> },
  { path: '*', element: <NotFound /> }
];

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      <Toaster richColors position="bottom-center" />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
