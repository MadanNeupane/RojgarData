import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, User } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setJobs([
      {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Kathmandu",
        type: "Full-time",
        salary: "$800/month",
      },
      {
        id: 2,
        title: "Backend Developer",
        company: "DataWorks",
        location: "Remote",
        type: "Part-time",
        salary: "$600/month",
      },
    ]);
    setCompanies([
      { id: 1, name: "TechCorp" },
      { id: 2, name: "DataWorks" },
    ]);
    setSalaries([
      {
        id: 1,
        role: "Software Engineer",
        amount: "$80,000/year",
        location: "USA",
        experience: "2-4 years",
        company: "Google",
      },
      {
        id: 2,
        role: "Frontend Developer",
        amount: "Rs. 80,000/month",
        location: "Nepal",
        experience: "1-3 years",
        company: "TechCorp",
      },
    ]);
    setBlogs([
      {
        id: 1,
        title: "How to Nail Tech Interviews",
        author: "John Doe",
        date: "2025-05-25",
        excerpt: "Tips and tricks to master modern interviews.",
        tags: ["interview", "career"]
      },
      {
        id: 2,
        title: "Top 5 In-Demand Skills in 2025",
        author: "Jane Smith",
        date: "2025-05-24",
        excerpt: "Explore future-proof tech skills...",
        tags: ["skills", "future"]
      },
    ]);
  }, []);


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // In future: filter jobs, companies, and blogs here or call a search API
  };

  return (
    <>
      <Navbar isAuthenticated={true} onLogout={() => { localStorage.clear(); window.location.reload(); }} />
      <div className="space-y-12">
        <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="mb-6 text-lg">Explore thousands of job opportunities from top companies.</p>
          <Button asChild className="bg-emerald-600 text-white">
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </section>


        {/* Search */}
        <section className="px-4 md:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto">
            <Label htmlFor="search">Search Jobs, Companies, Blogs</Label>
            <Input
              id="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search anything..."
            />
          </div>
        </section>

        <section className="px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:underline text-sm">Explore more</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition">
                <CardContent className="p-4">
                  <h3 className="text-md font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500">{job.location} • {job.type} • {job.salary}</p>
                  <Link to={`/jobs/${job.id}`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                    View Details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Companies</h2>
            <Link to="/companies" className="text-blue-600 hover:underline text-sm">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {companies.map((company) => (
              <Card key={company.id} className="text-center hover:shadow-md transition">
                <CardContent className="p-4">
                  <img src={`https://ui-avatars.com/api/?name=${company.name}&background=random`} alt={company.name} className="w-12 h-12 mx-auto rounded-full mb-2" />
                  <h3 className="text-sm font-semibold">{company.name}</h3>
                  <Link to={`/companies/${company.id}`} className="text-blue-600 hover:underline text-xs mt-2 inline-block">
                    View Profile
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Salary Insights</h2>
            <Link to="/salaries" className="text-blue-600 hover:underline text-sm">View more</Link>
          </div>
          <div className="space-y-2">
            {salaries.map((salary) => (
              <div key={salary.id} className="border p-4 rounded-md">
                <h3 className="font-medium">{salary.role}</h3>
                <p className="text-sm text-gray-600">{salary.amount} • {salary.location} • {salary.experience}</p>
                <p className="text-xs text-gray-500 mt-1">Company: {salary.company}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Latest Blogs</h2>
            <Link to="/blogs" className="text-blue-600 hover:underline text-sm">Explore all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-md transition">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                    <CalendarDays className="w-4 h-4 ml-4" />
                    <span>{new Date(blog.date).toDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 rounded-full px-2 py-0.5">#{tag}</span>
                    ))}
                  </div>
                  <Link to={`/blogs/${blog.id}`} className="text-blue-600 hover:underline text-sm inline-block">
                    Read more →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 lg:px-24 py-12 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get weekly updates on latest jobs and industry trends.</p>
            <div className="flex items-center gap-2 justify-center">
              <Input placeholder="Enter your email" className="w-full max-w-sm rounded-md" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} RojgarData. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;
