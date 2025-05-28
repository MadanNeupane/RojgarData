import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  Calendar,
  Eye,
  Bookmark,
  Building2,
  Mail,
  Phone,
} from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/job/posts/${id}`);
      setJob(res.data);
      fetchCompany(res.data.company);
    } catch (error) {
      toast.error("Failed to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async (companyId) => {
    try {
      const res = await api.get(`/company/companies/${companyId}`);
      const data = res.data.results ? res.data.results[0] : res.data;
      setCompany(data);
    } catch (error) {
      toast.error("Failed to fetch company details.");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-muted">Loading...</div>;
  if (!job) return <div className="p-6 text-center text-muted">Job not found.</div>;

  return (
    <PageTemplate>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company Card */}
        <div className="space-y-4">
          {company && (
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <img
                  src={company.avatar || "/assets/company.svg"}
                  alt={company.name}
                  className="w-24 h-24 mb-2 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold">{company.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  {company.industry} • {company.company_size}
                </p>
                {company.phone_number && (
                  <p className="text-sm flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {company.phone_number}
                  </p>
                )}
                {company.work_emails && (
                  <p className="text-sm flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {company.work_emails}
                  </p>
                )}
                <Link
                  to={`/companies/${company.id}`}
                  className="mt-3 inline-block text-blue-600 text-sm hover:underline"
                >
                  View Company Profile
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Job Details */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {job.view_count} views
                </span>
                <span className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-1" />
                  {job.total_bookmarks} bookmarks
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Salary:</strong> {job.salary}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Posted on:</strong>{" "}
                {new Date(job.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Status:</strong> {job.is_active ? "Active" : "Closed"}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Description:</strong>
                <p className="whitespace-pre-line mt-2">{job.description}</p>
              </div>
              {job.skills && job.skills.length > 0 && (
                <div className="mt-4">
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill.id}>{skill.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
}
