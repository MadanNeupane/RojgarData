import { useState } from "react";
import SearchFilterBar from "@/src/components/SearchFilterBar";
import PageTemplate from "@/src/components/PageTemplate";
import JobCard from "@/src/components/JobCard";
import HeroSection from "@/src/components/HeroSection";


const JobsList = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filters, setFilters] = useState([
    { id: "location", label: "Location", value: "", options: ["Kathmandu", "Remote", "Pokhara"] },
    { id: "type", label: "Job Type", value: "", options: ["Full-time", "Part-time", "Internship"] },
  ]);

  const handleFilterChange = (id, value) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  return (

    <PageTemplate>
      <HeroSection
        title="Job Listings"
        subtitle="Find Your Dream Job"
        description="Discover a world of opportunities and make a difference in your career with our job listings."
      />
      <SearchFilterBar
        type="jobs"
        searchValue={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={setSort}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* List of Jobs (filter logic not shown yet) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 py-6">
        <JobCard />
        <JobCard />
      </div>
    </PageTemplate>
  );
};

export default JobsList;
