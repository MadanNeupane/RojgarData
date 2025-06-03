import { useEffect, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Search, Loader2, X } from "lucide-react";
import api from "@/src/api";

const SearchBar = ({
  label = "Search",
  placeholder = "Search anything...",
  endpoint = null,
  onSearchResults = null,
  live = false,
  minLength = 3,
  delay = 500,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchFired, setSearchFired] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const performSearch = async (q) => {
    if (!q || q.length < minLength) {
      onSearchResults?.([]);
      return;
    }

    setLoading(true);
    setSearchFired(true);

    try {
      if (endpoint) {
        const res = await api.get(`${endpoint}?search=${q}`);
        onSearchResults?.(res.data?.results || []);
      } else {
        await onSearchResults?.(q);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchFired(false);

    if (live) {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => performSearch(value), delay);
      setDebounceTimer(timer);
    }

    if (!value) {
      onSearchResults?.([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length >= minLength) performSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchFired(false);
    setLoading(false);
    onSearchResults?.([]);
  };

  useEffect(() => {
    return () => clearTimeout(debounceTimer);
  }, [debounceTimer]);

  return (
    <div className={`max-w-3xl mx-auto my-3 ${className}`}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Label htmlFor="search" className="block mb-2">
          {`Search ${label}`}
        </Label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
          />
          {query && !loading && (
            <X
              className="absolute top-1/2 right-10 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={clearSearch}
            />
          )}
          {loading ? (
            <Loader2 className="absolute top-1/2 right-3 animate-spin w-5 h-5 text-gray-400" />
          ) : (
            <Search
              onClick={!live ? handleSubmit : undefined}
              className={`absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${
                !live ? "cursor-pointer" : "pointer-events-none"
              }`}
            />
          )}
        </div>
      </form>

      {searchFired && query.length >= minLength && (
        <p className="text-sm text-muted-foreground mt-2">
          Showing results for "<span className="font-medium">{query}</span>"
        </p>
      )}
    </div>
  );
};

export default SearchBar;
