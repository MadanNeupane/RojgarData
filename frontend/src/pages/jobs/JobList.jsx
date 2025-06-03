import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Pagination } from "@/src/components/ui/pagination";
import { Card, CardContent } from "@/src/components/ui/card";
import { CalendarDays, Eye, MapPin, Building2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "@/src/components/SearchBar";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";

  const fetchJobs = useCallback(async () => {
    if (searchQuery.length > 0 && searchQuery.length < 3) {
      // Don't search yet — let SearchBar debounce kick in
      setJobs([]);
      setCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/job/posts/`, {
        params: { page, search: searchQuery },
      });
      setJobs(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      toast.error("Failed to load job posts.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 space-y-4">
          <h1 className="text-xl font-semibold">Open Job Posts</h1>

          <div className="border border-gray-200 dark:border-gray-700 rounded-md">
            <SearchBar
              label="Job"
              live={true}
              placeholder="Search by title, skill, location..."
              endpoint="/job/posts/"
              onSearchResults={(results) => {
                setJobs(results);
                setCount(results.length);
              }}
              onSearch={(query) => {
                setSearchParams({ page: "1", search: query });
              }}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No job posts found.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map(({ id, title, location, company_name, salary, deadline, view_count, description, skills }) => (
              <Card key={id} className="hover:shadow-md transition">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                        <Link to={`/jobs/${id}`} className="hover:underline">
                          {title}
                        </Link>
                        <span className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4" />{company_name} <MapPin className="w-4 h-4" />{location}</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill.id} variant="primary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <span>NPR {salary.toLocaleString()}</span>
                      <span className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(deadline).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {view_count}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {description.replace(/\r?\n|\r/g, " ")}
                  </p>

                  <div className="mt-3">
                    <Link to={`/jobs/${id}`}>
                      <Button size="sm">
                        View Job
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setSearchParams({ page: String(newPage), search: searchQuery });
              }}
            />
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default JobList;
