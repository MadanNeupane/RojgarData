import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import {
  Eye,
  ThumbsUp,
  Bookmark,
  UserCircle,
  CalendarDays,
  MessageCircle,
} from "lucide-react";


export default function BlogPosts() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/blog/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      toast.error("Failed to fetch blog post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-muted">Loading...</div>;
  if (!post) return <div className="p-6 text-center text-muted">Post not found.</div>;

  return (
    <PageTemplate>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Author Card */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <h2 className="text-lg font-semibold">{post.author_name}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center">
                <UserCircle className="w-4 h-4 mr-1" />
                Author
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Blog Post */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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

              <div className="prose max-w-none whitespace-pre-line text-sm text-gray-800">
                {post.content}
              </div>

              {post.tags?.length > 0 && (
                <div className="mt-4">
                  <strong>Tags:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} className="bg-blue-100 text-blue-800">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" /> Comments ({post.comments?.length || 0})
              </h2>

              {post.comments?.length === 0 ? (
                <p className="text-muted-foreground text-sm">No comments yet.</p>
              ) : (
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-muted/40 rounded-lg">
                      <div className="text-sm text-gray-800 mb-1">{comment.content}</div>
                      <div className="text-xs text-muted-foreground">
                        By User #{comment.author} on{" "}
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>

                      {/* Replies (optional, extendable) */}
                      {comment.replies?.length > 0 && (
                        <div className="ml-4 mt-2 space-y-2">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-2 bg-muted rounded text-sm text-gray-700"
                            >
                              <div>{reply.content}</div>
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
      </div>
    </PageTemplate>
  );
}
