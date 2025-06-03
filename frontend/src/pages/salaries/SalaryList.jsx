import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Pagination } from "@/src/components/ui/pagination";
import { toast } from "sonner";
import {
  CalendarDays,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Clock,
} from "lucide-react";
import SearchBar from "@/src/components/SearchBar";

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const page = parseInt(searchParams.get("page") || "1");

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/salary/salaries/?page=${page}&search=${query}`);
      setSalaries(res.data.results);
      setCount(res.data.count);
    } catch (error) {
      toast.error("Failed to load salary data.");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 space-y-4">
          <h1 className="text-xl font-semibold">Salary Submissions</h1>

          <div className="border border-gray-200 dark:border-gray-700 rounded-md">
            <SearchBar
              className="w-full"
              label="Salary"
              placeholder="Search by company, job title, etc..."
              endpoint="/salary/salaries/"
              onSearch={(q) => setQuery(q)}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-10">Loading salaries...</p>
        ) : salaries.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No salaries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salaries.map((salary) => (
              <Card key={salary.id}>
                <CardContent className="p-4 flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                        <Link to={`/salaries/${salary.id}`}>
                          {salary.job_title}
                        </Link>
                      </h3>
                      {salary.is_verified && <ShieldCheck className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Briefcase className="w-4 h-4" /> <span>{salary.work_status}</span>
                        <UserCheck className="w-4 h-4" /> <span>{salary.seniority}</span>
                        <Clock className="w-4 h-4" /> <span>{salary.years_of_experience} yrs</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{salary.currency} {salary.salary_amount.toLocaleString()} / {salary.payment_period}</span>
                        <CalendarDays className="w-4 h-4" /> <span>{new Date(salary.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/salaries/${salary.id}`}>
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
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
              onPageChange={(newPage) => setSearchParams({ page: newPage })}
            />
          </div>
        )}
      </div>
    </PageTemplate>
  );
}

export default SalaryList