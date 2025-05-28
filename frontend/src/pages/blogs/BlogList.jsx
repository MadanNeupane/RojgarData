import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Badge } from "@/src/components/ui/badge";
import { Pagination } from "@/src/components/ui/pagination";
import { toast } from "sonner";
import { CalendarIcon, EyeIcon, ThumbsUpIcon } from "lucide-react";


export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blog/posts/?page=${page}`);
        setPosts(res.data.results);
        setCount(res.data.count);
      } catch (err) {
        toast.error("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Latest  Blog Posts</h1>

        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {posts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group">
                <div className="bg-white dark:bg-muted p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-200 h-full flex flex-col justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                      {post.content.replace(/\r?\n|\r/g, " ")}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <EyeIcon size={14} />
                        <span>{post.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUpIcon size={14} />
                        <span>{post.total_claps}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
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
