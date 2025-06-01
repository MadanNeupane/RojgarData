import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/src/api";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Search, CalendarDays, CalendarClock, MapPin, IndianRupee,
  User, ShieldCheck, Building
} from "lucide-react";
import Navbar from "@/src/components/Navbar";
import Newsletter from "@/src/components/Newsletter";
import Footer from "@/src/components/Footer";
import HeroSection from "@/src/components/HeroSection";

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-40 rounded-md" />
);

const Home = () => {
  const [jobs, setJobs] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [salaries, setSalaries] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, salariesRes, blogsRes] = await Promise.all([
          api.get("/job/posts/?limit=10"),
          api.get("/company/companies/?limit=5"),
          api.get("/salary/salaries/?limit=2"),
          api.get("/blog/posts/?limit=3"),
        ]);

        setJobs(jobsRes.data?.results || []);
        setCompanies(companiesRes.data?.results || []);
        setSalaries(salariesRes.data?.results || []);
        setBlogs(blogsRes.data?.results || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);

  return (
    <>
      <Navbar isAuthenticated={true} onLogout={() => { localStorage.clear(); window.location.reload(); }} />
      <div className="space-y-12">
        <HeroSection
          title="Find Your Dream Job"
          subtitle="Explore hundreds of job opportunities from top companies."
          buttonLabel="Browse Jobs"
          buttonLink="/jobs"
        />

        <section className="px-4 md:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto">
            <Label htmlFor="search">Search Jobs, Companies, Blogs</Label>
            <div className="relative mt-2">
              <Input
                id="search"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search anything..."
              />
              <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Jobs */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Recent Jobs" link="/jobs" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(jobs || Array(4).fill(null)).map((job, idx) => (
              job ? (
                <Card key={job.id} className="rounded-md hover:shadow-md transition">
                  <CardContent className="p-4">
                    <h3 className="text-md font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{job.company__name}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      <MapPin className="inline-block w-4 h-4 mr-1" />{job.location} •
                      <CalendarClock className="inline-block w-4 h-4 mr-1" />{job.deadline}
                    </p>
                    <p className="text-xs text-gray-500">
                      <IndianRupee className="inline-block w-4 h-4 mr-1" />{job.salary}
                    </p>
                    <Link to={`/jobs/${job.id}`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ) : <SkeletonCard key={idx} />
            ))}
          </div>
        </section>

        {/* Companies */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Top Companies" link="/companies" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(companies || Array(5).fill(null)).map((company, idx) => (
              company ? (
                <Card key={company.id} className="text-center rounded-md hover:shadow-md transition">
                  <CardContent className="p-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 mx-auto rounded-full mb-2"
                    />
                    <h3 className="text-sm font-semibold">{company.name}</h3>
                    <Link to={`/companies/${company.id}`} className="text-blue-600 hover:underline text-xs mt-2 inline-block">
                      View Profile
                    </Link>
                  </CardContent>
                </Card>
              ) : <SkeletonCard key={idx} />
            ))}
          </div>
        </section>

        {/* Salaries */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Salary Insights" link="/salaries" />
          <div className="space-y-2">
            {(salaries || Array(2).fill(null)).map((salary, idx) => (
              salary ? (
                <div key={salary.id} className="border p-4 rounded-md">
                  <h3 className="font-medium">
                    {salary.job_title} {salary.is_verified && <ShieldCheck className="inline-block w-4 h-4" />}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {salary.currency} {salary.salary_amount}/{salary.payment_period} • {salary.work_type} • {salary.seniority}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <Building className="inline-block w-4 h-4 mr-1" />{salary.company}
                  </p>
                </div>
              ) : <SkeletonCard key={idx} />
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Latest Blogs" link="/blogs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(blogs || Array(3).fill(null)).map((blog, idx) => (
              blog ? (
                <Card key={blog.id} className="rounded-md hover:shadow-md transition">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold text-lg">{blog.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <User className="w-4 h-4" /><span>{blog.author}</span>
                      <CalendarDays className="w-4 h-4 ml-4" /><span>{new Date(blog.created_at).toDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                      {blog.tags.map(tag => (
                        <span key={tag.id} className="bg-gray-200 rounded-full px-2 py-0.5">#{tag.name}</span>
                      ))}
                    </div>
                    <Link to={`/blogs/${blog.id}`} className="text-blue-600 hover:underline text-sm inline-block">
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              ) : <SkeletonCard key={idx} />
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 lg:px-24 py-12 bg-gray-100 dark:bg-gray-800">
          <Newsletter />
        </section>

        <Footer />
      </div>
    </>
  );
};

const SectionHeader = ({ title, link }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    <Link to={link} className="text-blue-600 hover:underline text-sm">Explore more</Link>
  </div>
);

export default Home;