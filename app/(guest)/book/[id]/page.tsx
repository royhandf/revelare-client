"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { bookService, BookDetail, Book } from "@/lib/services/book";
import { ArrowLeft, Download, Bookmark, BookX } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

function getAuthorDisplay(book: BookDetail): string {
  if (book.authors && book.authors.trim()) return book.authors;
  if (book.editors && book.editors.trim()) return book.editors;
  return "Unknown";
}

export default function BookDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = searchParams.get("q") || "";
  const scenario = searchParams.get("scenario") || "3";

  useEffect(() => {
    const fetchBook = async () => {
      if (!params.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await bookService.getById(Number(params.id));
        setBook(response.data);

        if (searchQuery) {
          const similarResponse = await bookService.search({
            query: searchQuery,
            scenario: scenario,
            page: 1,
          });

          const filtered = similarResponse.data
            .filter((b) => b.id !== Number(params.id))
            .slice(0, 10);
          setSimilarBooks(filtered);
        }
      } catch (err) {
        setError("Gagal memuat detail buku.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [params.id, searchQuery, scenario]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <BookX className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-red-500">{error || "Buku tidak ditemukan"}</p>
        <Link href="/book">
          <Button variant="outline">Kembali ke Pencarian</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
              {book.title}
            </h1>

            <p className="text-gray-600 mb-6">
              by{" "}
              <span className="font-semibold text-gray-800">
                {getAuthorDisplay(book)}
              </span>
            </p>

            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {book.description || "No description available."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Language
                </p>
                <p className="text-sm font-medium text-gray-800">English</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Publisher
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {book.publisher || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Published
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {book.published || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  ISBN
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {book.isbn || "-"}
                </p>
              </div>
            </div>

            {book.subject && (
              <div className="mt-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Subject
                </p>
                <div className="flex flex-wrap gap-2">
                  {book.subject.split(",").map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-24">
              <div className="bg-violet-100 rounded-2xl p-6 mb-4 flex items-center justify-center">
                <Image
                  src={book.cover_link}
                  alt={book.title}
                  width={200}
                  height={300}
                  className="w-auto h-64 md:h-72 rounded-lg shadow-xl object-contain"
                  priority
                />
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 h-11"
                  asChild
                >
                  <a
                    href={book.pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 h-11"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {similarBooks.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Similar Books
            </h2>
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={16}
              slidesPerView={2}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              freeMode={{
                enabled: true,
                sticky: true,
              }}
              loop={similarBooks.length > 3}
              grabCursor={true}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="book-swiper !pb-12"
            >
              {similarBooks.map((similarBook) => (
                <SwiperSlide key={similarBook.id}>
                  <Link
                    href={`/book/${similarBook.id}?q=${encodeURIComponent(
                      searchQuery
                    )}&scenario=${scenario}`}
                    className="block group"
                  >
                    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100">
                      <div className="aspect-[3/4] flex items-center justify-center mb-3">
                        <Image
                          src={similarBook.cover}
                          alt={similarBook.title}
                          width={100}
                          height={150}
                          className="w-auto h-28 md:h-32 rounded shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-violet-600 transition-colors">
                        {similarBook.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs px-2 py-0.5 rounded border border-violet-300 text-violet-600">
                          Similarity
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          {(similarBook.average_similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}
      </main>
    </div>
  );
}
