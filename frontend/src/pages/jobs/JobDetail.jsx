import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/components/ui/badge";


export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${jobId}/`);
        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job post", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!job) return <p className="text-center mt-10">Job not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-10">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
            <p className="text-gray-600">{job.company_name} • {job.location}</p>
          </div>
          <Button className="mt-4 md:mt-0">Apply Now</Button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Posted by: {job.posted_by}</p>
          <p className="text-sm text-gray-500">Deadline: {job.deadline}</p>
          <p className="text-sm text-gray-500">Views: {job.view_count}</p>
          <p className="text-sm text-gray-500">Bookmarks: {job.total_bookmarks}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <Badge key={idx}>{skill}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Salary</h2>
          <p className="text-gray-700">{job.salary}</p>
        </div>
      </div>
    </div>
  );
}
