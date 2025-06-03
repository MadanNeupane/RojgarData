import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Pagination } from "@/src/components/ui/pagination";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { MapPin, Users, Factory } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "@/src/components/SearchBar";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";

  const fetchCompanies = useCallback(async () => {
    if (searchQuery.length > 0 && searchQuery.length < 3) {
      setCompanies([]);
      setCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/company/companies/`, {
        params: { page, search: searchQuery },
      });
      setCompanies(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      toast.error("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const totalPages = Math.ceil(count / 10);

  const handleFollow = (companyId, companyName, isFollowing) => {
    // Placeholder: will implement actual follow logic here
    toast.success(isFollowing ? "Unfollowed " + companyName : "Followed " + companyName);
  };

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 space-y-4">
          <h1 className="text-xl font-semibold">Companies</h1>

          <div className="border border-gray-200 dark:border-gray-700 rounded-md">
            <SearchBar
              label="Company"
              live={true}
              placeholder="Search companies by name, industry, location..."
              endpoint="/company/companies/"
              onSearchResults={(results) => {
                setCompanies(results);
                setCount(results.length);
              }}
              onSearch={(query) => {
                setSearchParams({ page: "1", search: query });
              }}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No companies found.</p>
        ) : (
          <div className="space-y-4">
            {companies.map(
              ({
                id,
                name,
                logo,
                location,
                company_size,
                industry_name,
                view_count,
                is_followed,
              }) => (
                <Card key={id} className="hover:shadow-md transition duration-200">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Link to={`/companies/${id}`} className="flex-shrink-0">
                      <img
                        src={logo}
                        alt={`${name} logo`}
                        className="w-20 h-20 object-contain rounded-md border"
                      />
                    </Link>

                    <div className="flex-1 w-full">

                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                        <Link to={`/companies/${id}`}>{name}</Link>
                      </h3>

                      <div className="mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                          <span className="mx-2">|</span>
                          <Users className="w-4 h-4" />
                          <span>{company_size} employees</span>
                          <span className="mx-2">|</span>
                          <Factory className="w-4 h-4" />
                          <span>{industry_name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Views: {view_count}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        variant={is_followed ? "secondary" : "default"}
                        onClick={() => handleFollow(id, name, is_followed)}
                      >
                        {is_followed ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) =>
                setSearchParams({ page: String(newPage), search: searchQuery })
              }
            />
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default CompanyList;
