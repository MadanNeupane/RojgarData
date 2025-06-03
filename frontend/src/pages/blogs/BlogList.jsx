import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/src/api";
import PageTemplate from "@/src/components/PageTemplate";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Pagination } from "@/src/components/ui/pagination";
import { Card, CardContent } from "@/src/components/ui/card";
import { CalendarDays, Eye, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "@/src/components/SearchBar";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";

  const fetchPosts = useCallback(async () => {
    if (searchQuery.length > 0 && searchQuery.length < 3) {
      setPosts([]);
      setCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/blog/posts/`, {
        params: { page, search: searchQuery },
      });
      setPosts(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      toast.error("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const totalPages = Math.ceil(count / 10);

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 space-y-4">
          <h1 className="text-xl font-semibold">Latest Blog Posts</h1>

          <div className="border border-gray-200 dark:border-gray-700 rounded-md">
            <SearchBar
              label="Blog"
              live={true}
              placeholder="Search by title, tag, or content..."
              endpoint="/blog/posts/"
              onSearchResults={(results) => {
                setPosts(results);
                setCount(results.length);
              }}
              onSearch={(query) => {
                setSearchParams({ page: "1", search: query });
              }}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-10">Loading blog posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No blog posts found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {posts.map(({ id, title, content, created_at, view_count, total_claps, tags }) => (
              <Card key={id} className="hover:shadow-md transition">
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      <Link to={`/blog/${id}`} className="hover:underline">
                        {title}
                      </Link>
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {content.replace(/\r?\n|\r/g, " ")}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" /> {view_count}
                      <ThumbsUp className="w-4 h-4" /> {total_claps}
                    </span>
                  </div>

                  <div className="mt-3">
                    <Link to={`/blogs/${id}`}>
                      <Button size="sm">Read More</Button>
                    </Link>
                  </div>
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
              onPageChange={(newPage) => {
                setSearchParams({ page: String(newPage), search: searchQuery });
              }}
            />
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default BlogList;
