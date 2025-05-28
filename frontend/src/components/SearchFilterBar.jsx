import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";

const SearchFilterBar = ({
  type = "jobs",                     // e.g., 'jobs', 'companies', 'salaries'
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  filters = [],
  onFilterChange,
}) => {
  const sortOptions = {
    jobs: ["Newest", "Oldest", "Highest Salary", "Lowest Salary"],
    companies: ["A-Z", "Z-A", "Most Employees", "Top Rated"],
    salaries: ["Highest Avg", "Lowest Avg", "Most Reported"],
    blogs: ["Newest", "Oldest", "Most Liked"],
  };

  return (
    <section className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Input */}
        <Input
          placeholder={`Search ${type}...`}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="md:w-1/3"
        />

        {/* Sort Dropdown */}
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions[type].map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Optional Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Select
                key={filter.id}
                value={filter.value}
                onValueChange={(val) => onFilterChange(filter.id, val)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchFilterBar;
