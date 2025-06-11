import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import {
  Eye,
  ThumbsUp,
  Bookmark,
  BookmarkCheck,
  UserCircle,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

import Sidebar from "@/src/components/layout/Sidebar";

const BlogPosts = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/blog/posts/${id}`);
      setPost(res.data);
      setBookmarked(res.data?.bookmarked || false);
    } catch (error) {
      if (error.response.status === 404) {
        window.location.href = "/404";
      } else {
        toast.error("Failed to fetch post.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await api.delete(`/blog/posts/${id}/bookmark`);
        toast.success("Removed from saved posts");
      } else {
        await api.post(`/blog/posts/${id}/bookmark`);
        toast.success("Saved post");
      }
      setBookmarked(!bookmarked);
    } catch (error) {
      toast.error("Failed to update bookmark.");
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post(`/blog/posts/${id}/comments/`, {
        content: commentText,
      });
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data],
      }));
      setCommentText("");
      toast.success("Comment added.");
    } catch (error) {
      toast.error("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  return (
    <PageTemplate>
      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : !post ? (
        <div className="p-6 text-center">Post not found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blog Post Content */}
          <div className="md:col-span-2 space-y-6 order-1 md:order-none">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.view_count} views
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.total_claps} claps
                  </span>
                  <span className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-1" />
                    {post.total_bookmarks} bookmarks
                  </span>
                </div>

                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {post.content}
                </div>

                {post.tags?.length > 0 && (
                  <div className="mt-4">
                    <strong>Tags:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag.id}>{tag.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comments ({post.comments?.length || 0})
                </h2>

                {/* Add comment */}
                <div className="space-y-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 border border-muted rounded-md text-sm bg-background"
                    rows={3}
                  />
                  <Button
                    size="sm"
                    onClick={submitComment}
                    disabled={submitting}
                    className="bg-primary text-white"
                  >
                    {submitting ? "Submitting..." : "Post Comment"}
                  </Button>
                </div>

                {/* Show comments */}
                {post.comments?.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No comments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 bg-muted/40 rounded-lg"
                      >
                        <div className="text-sm text-foreground mb-1">
                          {comment.content}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          By User #{comment.author} on{" "}
                          {new Date(comment.created_at).toLocaleDateString()}
                        </div>

                        {comment.replies?.length > 0 && (
                          <div className="ml-4 mt-2 space-y-2">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="p-2 bg-muted rounded text-sm text-foreground"
                              >
                                <p>{reply.content}</p>
                                <div className="text-xs text-muted-foreground">
                                  By User #{reply.author} on{" "}
                                  {new Date(reply.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar for author and actions */}
          <div className="order-2 md:order-none">
            <Sidebar position="left">
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <UserCircle className="w-16 h-16 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">{post.author_name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center">
                    Author
                  </p>

                  <div className="mt-4 w-full">
                    <Button
                      variant="outline"
                      onClick={toggleBookmark}
                      className="w-full flex items-center justify-center bg-primary gap-1"
                    >
                      {bookmarked ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Save Post
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Sidebar>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default BlogPosts;