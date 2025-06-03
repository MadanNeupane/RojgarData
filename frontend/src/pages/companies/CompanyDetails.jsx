import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/src/api";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import defaultAvatar from "../../assets/company.svg";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  MapPin,
  Users,
  Factory,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Mail,

} from "lucide-react";
import PageTemplate from "@/src/components/PageTemplate";
import Sidebar from "@/src/components/layout/Sidebar";
import { toast } from "sonner";

const SocialPlatformIcons = {
  facebook: <Facebook />,
  twitter: <Twitter />,
  linkedin: <Linkedin />,
  instagram: <Instagram />,
  youtube: <Youtube />,
  tiktok: <Globe />,
  website: <Globe />,
};

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [jobs, setJobs] = useState([]);

  const [review, setReview] = useState({
    review_headline: "",
    rating: 0,
    pros: "",
    cons: "",
    advice_for_management: "",
    recommended: false,
  });

  const [question, setQuestion] = useState({
    question_text: "",
  });

  const fetchCompany = async () => {
    try {
      const res = await api.get(`/company/companies/${id}`);
      const data = res.data.results ? res.data.results[0] : res.data;
      setCompany(data);
    } catch (error) {
      if (error.response.status === 404) {
        window.location.href = "/404";
      } else {
        toast.error("Failed to fetch company.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/job/posts/?company_id=${id}`);
      setJobs(res.data?.results);
    } catch (error) {
      toast.error("Failed to fetch jobs.");
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchJobs();
  }, [id]);

  const handleFollow = async () => {
    try {
      await api.post(`/company/companies/${id}/follow/`);
      toast.success("Followed company");
      fetchCompany();
    } catch (error) {
      toast.error("Follow failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/company/companies/${id}/review`, review);
      setReview({
        review_headline: "",
        rating: 0,
        pros: "",
        cons: "",
        advice_for_management: "",
        recommended: false,
      });
      toast.success("Review submitted");
      fetchCompany();
    } catch (err) {
      toast.error("Review submission failed");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/company/companies/${id}/question`, question);
      setQuestion({ question_text: "" });
      toast.success("Question submitted");
      fetchCompany();
    } catch (err) {
      toast.error("Question submission failed");
    }
  };

  return (
    <PageTemplate>
      {loading ? (
        <div className="p-6 text-center text-muted">Loading...</div>
      ) : !company ? (
        <div className="p-6 text-center text-destructive">Company not found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
          {/* Sidebar */}
          <Sidebar position="left">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <img
                  src={company.logo || "/assets/company.svg"}
                  alt={company.name}
                  className="w-24 h-24 mb-2 rounded-full object-cover border border-gray-300 dark:border-gray-600 select-none"
                />
                <h2 className="text-lg font-semibold">{company.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.location}
                </p>
                <p className="text-sm flex items-center justify-center text-muted-foreground">
                    <Factory className="h-4 w-4 mr-1" />{company.industry_name} • <Users className="h-4 w-4 mx-1" /> {company.company_size}
                </p>
                {company.phone_number && (
                  <p className="text-sm flex items-center justify-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1" />
                    {company.phone_number}
                  </p>
                )}
                <Button onClick={handleFollow} className="rounded-md mt-2">
                  Follow
                </Button>
              </CardContent>
            </Card>

            {company.social_links?.length > 0 && (
              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="font-semibold">Social Links</p>
                  <div className="flex gap-4">
                    {company.social_links.map((link) => (
                      SocialPlatformIcons[link.platform] && (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {SocialPlatformIcons[link.platform]}
                        </a>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </Sidebar>

          {/* Main content */}
          <div className="md:col-span-2 border rounded-md p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="w-1/4 px" value="about">About</TabsTrigger>
                <TabsTrigger className="w-1/4 px" value="jobs">Jobs</TabsTrigger>
                <TabsTrigger className="w-1/4 px" value="reviews">Reviews</TabsTrigger>
                <TabsTrigger className="w-1/4 px" value="questions">Questions</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <div className="mt-4 space-y-2">
                  {company.cover_image && (
                    <img
                      src={company.cover_image}
                      className="rounded-md max-h-64 object-cover w-full"
                    />
                  )}
                  <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {company.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="jobs">
                <div className="space-y-3 mt-4">
                  {jobs?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No job posts available.
                    </p>
                  ) : (
                    jobs?.map((job) => (
                      <Card key={job.id}>
                        <CardContent className="p-4 space-y-1">
                          <h4 className="text-base font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Posted: {new Date(job.created_at).toLocaleDateString()} • Apply before: {job.deadline}
                          </p>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Job
                          </Link>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <form onSubmit={handleReviewSubmit} className="space-y-4 my-4">
                  <h4 className="font-semibold text-lg">Submit a Review</h4>
                  <Input
                    placeholder="Headline"
                    value={review.review_headline}
                    onChange={(e) =>
                      setReview({ ...review, review_headline: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rating (1-5)"
                    value={review.rating}
                    onChange={(e) =>
                      setReview({ ...review, rating: parseInt(e.target.value) })
                    }
                  />
                  <Textarea
                    placeholder="Pros"
                    value={review.pros}
                    onChange={(e) => setReview({ ...review, pros: e.target.value })}
                  />
                  <Textarea
                    placeholder="Cons"
                    value={review.cons}
                    onChange={(e) => setReview({ ...review, cons: e.target.value })}
                  />
                  <Textarea
                    placeholder="Advice for Management"
                    value={review.advice_for_management}
                    onChange={(e) =>
                      setReview({ ...review, advice_for_management: e.target.value })
                    }
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={review.recommended}
                      onChange={(e) =>
                        setReview({ ...review, recommended: e.target.checked })
                      }
                    />
                    <span className="text-sm">Recommended</span>
                  </label>
                  <Button type="submit">Submit Review</Button>
                </form>

                <div className="space-y-4">
                  {company.reviews.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{r.review_headline}</h4>
                        <p className="text-sm">⭐ {r.rating} / 5</p>
                        <p className="text-sm">
                          <strong>Pros:</strong> {r.pros}
                        </p>
                        <p className="text-sm">
                          <strong>Cons:</strong> {r.cons}
                        </p>
                        <p className="text-sm">
                          <strong>Advice:</strong> {r.advice_for_management}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.recommended ? "Recommended" : "Not Recommended"} •{" "}
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="questions">
                <form onSubmit={handleQuestionSubmit} className="space-y-4 my-4">
                  <h4 className="font-semibold text-lg">Ask a Question</h4>
                  <Textarea
                    placeholder="Write your question here..."
                    value={question.question_text}
                    onChange={(e) =>
                      setQuestion({ ...question, question_text: e.target.value })
                    }
                  />
                  <Button type="submit">Submit Question</Button>
                </form>

                <div className="space-y-4">
                  {company.questions.map((q) => (
                    <Card key={q.id}>
                      <CardContent className="p-4 space-y-2">
                        <h5 className="font-medium">{q.question_text}</h5>
                        <p className="text-sm">
                          👍 {q.upvote_count} • 👎 {q.downvote_count}
                        </p>
                        {q.answers?.length ? (
                          <ul className="text-sm list-disc ml-5 space-y-1">
                            {q.answers.map((a) => (
                              <li key={a.id}>
                                {a.answer_text}{" "}
                                <span className="text-xs text-muted-foreground">
                                  ({new Date(a.created_at).toLocaleDateString()})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            No answers yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </PageTemplate>
  );
}

export default CompanyDetails;