import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Pagination } from "@/src/components/ui/pagination";
import { toast } from "sonner";
import { CalendarDays, Eye } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";


// Optional placeholder for future filters/sorting
function SearchFilterBar() {
  return (
    <div className="mb-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Open Job Posts</h2>
    </div>
  );
}

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/job/posts/?page=${page}`);
      setJobs(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      toast.error("Failed to load job posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4">
        <SearchFilterBar />

        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No job posts found.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="text-sm text-muted-foreground mb-1">{job.location}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {job.skills.map((skill) => (
                            <Badge key={skill.id} variant="secondary">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-sm gap-1">
                        <span className="text-muted-foreground">
                          NPR {job.salary}
                        </span>
                        <span className="flex items-center text-muted-foreground gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          {job.view_count}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {job.description.replace(/\r?\n|\r/g, " ")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setSearchParams({ page: newPage });
              }}
            />
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
