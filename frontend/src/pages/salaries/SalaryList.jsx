import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CalendarDays, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Pagination } from "@/src/components/ui/pagination";
import { toast } from "sonner";

// Optional: placeholder filter/search bar
function SearchFilterBar() {
  return (
    <div className="mb-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Salary Submissions</h2>
      {/* Future: Search, Sort, Filter */}
    </div>
  );
}

export default function SalaryList() {
  const [salaries, setSalaries] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/salary/salaries/?page=${page}`);
      setSalaries(res.data.results);
      setCount(res.data.count);
    } catch (error) {
      toast.error("Failed to load salary data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [page]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4">
        <SearchFilterBar />
        {loading ? (
          <p className="text-muted text-center py-10">Loading salaries...</p>
        ) : salaries.length === 0 ? (
          <p className="text-muted text-center py-10">No salaries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salaries.map((salary) => (
              <Link to={`/salaries/${salary.id}`} key={salary.id}>
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{salary.job_title}</h3>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-3 mt-1">
                        <span>{salary.work_status}</span>
                        <span>{salary.seniority}</span>
                        <span>{salary.years_of_experience} yrs</span>
                        <span>{salary.currency} {salary.salary_amount.toLocaleString()} / {salary.payment_period}</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(salary.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {salary.is_verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <ShieldCheck className="w-4 h-4 mr-1 inline-block" />
                          Verified
                        </Badge>
                      )}
                      <Button size="icon" variant="ghost">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
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
