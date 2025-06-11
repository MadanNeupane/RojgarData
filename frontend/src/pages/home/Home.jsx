import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/src/api";
import { Card, CardContent } from "@/src/components/ui/card";

import {
  CalendarDays, CalendarClock, MapPin, IndianRupee,
  User, ShieldCheck, Building, ArrowRight
} from "lucide-react";
import Navbar from "@/src/components/Navbar";
import Newsletter from "@/src/components/Newsletter";
import Footer from "@/src/components/Footer";
import HeroSection from "@/src/components/HeroSection";
import SearchBar from "@/src/components/SearchBar";

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-40 rounded-md" />
);

const SectionHeader = ({ title, link }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    <Link
      to={link}
      className="group inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      Explore more
      <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  </div>
);

const Home = () => {
  const [jobs, setJobs] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [salaries, setSalaries] = useState(null);
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, salariesRes, blogsRes] = await Promise.all([
          api.get("/job/posts/?limit=10"),
          api.get("/company/companies/?order_by=view_count&limit=5"),
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

  return (
    <>
      <Navbar />
      <div className="space-y-12">
        <HeroSection
          title="Find Your Dream Job"
          subtitle="Explore hundreds of job opportunities from top companies."
          buttonLabel="Browse Jobs"
          buttonLink="/jobs"
        />

        <section className="px-4 md:px-12 lg:px-24">
          <SearchBar
            label="Jobs, Companies, Salaries, Blogs"
            live={true}
            onSearchResults={async (q) => {
              try {
                const [jobsRes, companiesRes, blogsRes, salariesRes] = await Promise.all([
                  api.get(`/job/posts/?search=${q}`),
                  api.get(`/company/companies/?search=${q}`),
                  api.get(`/blog/posts/?search=${q}`),
                  api.get(`/salary/salaries/?search=${q}`),
                ]);
                setJobs(jobsRes.data?.results || []);
                setCompanies(companiesRes.data?.results || []);
                setBlogs(blogsRes.data?.results || []);
                setSalaries(salariesRes.data?.results || []);
              } catch (err) {
                console.error("Multi-search failed:", err);
              }
            }}
          />
        </section>

        {/* Jobs */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Recent Jobs" link="/jobs" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(jobs ? jobs : Array(4).fill(null)).map((job, idx) =>
              job ? (
                <Card key={job.id} className="rounded-md hover:shadow-md transition">
                  <CardContent className="p-4">
                    <h3 className="text-md font-medium">
                      <Link to={`/jobs/${job.id}`} className="text-blue-600">
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Building className="inline-block w-4 h-4 mr-1" />{job.company_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                      <MapPin className="inline-block w-4 h-4 mr-1" />{job.location} • <CalendarClock className="inline-block w-4 h-4 mr-1" />{job.deadline}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      <IndianRupee className="inline-block w-4 h-4 mr-1" />{job.salary}
                    </p>
                    <Link to={`/jobs/${job.id}`} className="text-blue-600 text-sm mt-2 inline-block">
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <SkeletonCard key={idx} />
              )
            )}
          </div>
        </section>

        {/* Companies */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Top Companies" link="/companies" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(companies ? companies : Array(5).fill(null)).map((company, idx) =>
              company ? (
                <Card key={company.id} className="text-center rounded-md hover:shadow-md transition">
                  <CardContent className="p-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      draggable={false}
                      className="w-12 h-12 mx-auto rounded-full mb-2 border border-gray-300 dark:border-gray-600 select-none"
                    />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{company.name}</h3>
                    <Link to={`/companies/${company.id}`} className="text-blue-500 text-xs mt-2 inline-block">
                      View Profile
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <SkeletonCard key={idx} />
              )
            )}
          </div>
        </section>

        {/* Salaries */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Salary Insights" link="/salaries" />
          <div className="space-y-2">
            {(salaries ? salaries : Array(2).fill(null)).map((salary, idx) =>
              salary ? (
                <div key={salary.id} className="border p-4 rounded-md">
                  <h3 className="font-medium">
                    <Link to={`/salaries/${salary.id}`} className="hover:underline text-blue-500">
                      {salary.job_title}
                    </Link>{" "}
                    {salary.is_verified && <ShieldCheck className="inline-block w-4 h-4" />}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {salary.currency} {salary.salary_amount}/{salary.payment_period} • {salary.work_type} • {salary.seniority}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                    <Building className="inline-block w-4 h-4 mr-1" />{salary.company_name}
                  </p>
                </div>
              ) : (
                <SkeletonCard key={idx} />
              )
            )}
          </div>
        </section>

        {/* Blogs */}
        <section className="px-4 md:px-12 lg:px-24">
          <SectionHeader title="Latest Blogs" link="/blogs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(blogs ? blogs : Array(3).fill(null)).map((blog, idx) =>
              blog ? (
                <Card key={blog.id} className="rounded-md hover:shadow-md transition">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold text-lg">
                      <Link to={`/blogs/${blog.id}`} className="text-blue-500">
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {blog.content.length > 100 ? `${blog.content.slice(0, 100)}...` : blog.content}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-2">
                      <User className="w-4 h-4" /><span>{blog.author_name}</span>
                      <CalendarDays className="w-4 h-4 ml-4" /><span>{new Date(blog.created_at).toDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-300">
                      {blog.tags.map(tag => (
                        <span key={tag.id} className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">#{tag.name}</span>
                      ))}
                    </div>
                    <Link to={`/blogs/${blog.id}`} className="text-blue-600 text-sm inline-block">
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <SkeletonCard key={idx} />
              )
            )}
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

export default Home;
