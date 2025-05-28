import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CalendarIcon, MapPinIcon, BookmarkIcon } from "lucide-react";
import parse from "html-react-parser";


const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/job/posts/${id}/`)
      .then((res) => {
        setJob(res?.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch job:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!job) return <div className="p-6 text-center text-red-600">Job not found.</div>;

  return (
    <PageTemplate>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills?.map((skill) => (
                <Badge key={skill.id} variant="outline">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location + Deadline */}
            <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <MapPinIcon size={16} className="text-blue-500" />
                {job.location || "Not specified"} {job.is_remote === "true" && <Badge className="ml-2">Remote</Badge>}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon size={16} className="text-green-500" />
                Apply before: <strong className="ml-1">{new Date(job.deadline).toLocaleDateString()}</strong>
              </span>
            </div>

            {/* Salary */}
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              Salary: NPR {job.salary}
            </div>

            {/* Description */}
            <div className="prose max-w-none dark:prose-invert">
              {parse(job.description.replace(/\r\n/g, "<br />"))}
            </div>

            {/* Bookmark / Apply */}
            <div className="flex gap-4 mt-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Now</Button>
              <Button variant="outline">
                <BookmarkIcon className="mr-2" size={18} />
                Save Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default JobDetail;
