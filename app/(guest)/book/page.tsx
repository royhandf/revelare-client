"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  BookX,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { bookService, Book } from "@/lib/services/book";

function BookCoverImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 to-violet-200 rounded-md">
        <BookOpen className="h-16 w-16 text-violet-400 mb-2" />
        <span className="text-xs text-violet-500 text-center px-2">
          No Cover
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={267}
      className="max-h-full w-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
      onError={() => setHasError(true)}
    />
  );
}

function SimilarityBadge({ value }: { value: number }) {
  const percentage = (value * 100).toFixed(0);

  return (
    <div className="flex items-center justify-between mt-2.5">
      <span className="text-xs px-2 py-1 rounded-md border text-violet-700 bg-violet-50 border-violet-200">
        Similarity
      </span>
      <span className="text-lg font-semibold text-violet-600">
        {percentage}%
      </span>
    </div>
  );
}

export default function BookListPage() {
  const searchParams = useSearchParams();

  const [scenario, setScenario] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBooks = async (query: string, scenario: string, page: number) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await bookService.search({
        query,
        scenario: scenario || undefined,
        page,
      });

      setBooks(response.data);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError("Gagal memuat hasil pencarian. Silakan coba lagi.");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const s = searchParams.get("scenario") || "";

    setSearchQuery(q);
    setScenario(s);

    if (q) {
      fetchBooks(q, s, 1);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    fetchBooks(searchQuery, scenario, 1);
  };

  const handlePageChange = (page: number) => {
    fetchBooks(searchQuery, scenario, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex w-full items-center overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger className="h-12 w-[180px] pl-4 rounded-none border-0 border-r border-gray-200 bg-transparent shadow-none focus:ring-0 focus-visible:ring-0">
                <SelectValue placeholder="Choose a scenario" />
              </SelectTrigger>
              <SelectContent className="mt-2">
                <SelectItem value="3">3 Terms TF-IDF</SelectItem>
                <SelectItem value="5">5 Terms TF-IDF</SelectItem>
                <SelectItem value="10">10 Terms TF-IDF</SelectItem>
                <SelectItem value="0">Without TF-IDF</SelectItem>
                <SelectItem value="-1">Without Semantic</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or topic..."
              className="h-12 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <Button
              onClick={handleSearch}
              size="icon"
              className="h-12 w-12 rounded-none bg-violet-600 hover:bg-violet-700 cursor-pointer"
              disabled={isLoading}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results{" "}
            <span className="text-gray-500 font-normal">
              ({totalResults} books found)
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <BookX className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-500 max-w-md">{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 max-w-md">
              Try using different keywords or change the search scenario.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <Link
                href={`/book/${book.id}?q=${encodeURIComponent(
                  searchQuery
                )}&scenario=${scenario}`}
                key={book.id}
                className="group"
              >
                <Card className="h-full overflow-hidden border border-gray-200 hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-64 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-3">
                    <BookCoverImage src={book.cover} alt={book.title} />
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[40px] group-hover:text-violet-600 transition-colors">
                      {book.title}
                    </h3>
                    <SimilarityBadge value={book.average_similarity} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {books.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
              className="h-9 w-9 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {(() => {
              const pages: (number | string)[] = [];

              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("...");

                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);

                if (currentPage < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    •••
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handlePageChange(page as number)}
                    className={
                      currentPage === page
                        ? "h-9 w-9 bg-violet-600 text-white hover:bg-violet-700"
                        : "h-9 w-9 hover:bg-violet-50 hover:text-violet-600"
                    }
                  >
                    {page}
                  </Button>
                )
              );
            })()}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="h-9 w-9 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
