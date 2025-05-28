import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Pagination } from "@/src/components/ui/pagination";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/company/companies/?page=${page}`);
      setCompanies(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      toast.error("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Companies</h1>

        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading...</p>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <Link to={`/company/${company.id}`} key={company.id}>
                <Card className="hover:shadow-md transition duration-200">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-14 h-14 object-contain rounded-md border"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{company.name}</h2>
                      <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                        <span>{company.location}</span>
                        <span>{company.company_size}</span>
                        <Badge variant="outline" className="text-xs">Views: {company.view_count}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
