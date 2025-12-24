"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Bookmark } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const mockBook = {
  id: 68286,
  title: "Divine Action, Determinism, and the Laws of Nature",
  author: "Koperski, Jeffrey",
  publisher: "Taylor & Francis",
  releaseDate: "March 15, 2019",
  language: "English",
  isbn: "9781638281146, 9781638281153",
  cover:
    "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
  description: `A longstanding question at the intersection of science, philosophy, and theology is how God might act, or not, when governing the universe. Many believe that determinism would prevent God from acting at all, since to do so would require violating the laws of nature. However, when a robust view of these laws is coupled with the kind of determinism now used in dynamics, a new model of divine action emerges.

This book presents a new approach to divine action beyond the current focus on quantum mechanics and esoteric gaps in the causal order. It bases this approach on two general points. First, that there are laws of nature is not merely a metaphor. Second, laws and physical determinism are now understood in mathematically precise ways that have important implications for metaphysics.`,
};

const similarBooks = [
  {
    id: 1,
    title: "Campaign Finance Law",
    author: "John Smith",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 70,
  },
  {
    id: 2,
    title: "Money in Politics",
    author: "Jane Doe",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 68,
  },
  {
    id: 3,
    title: "Electoral Systems",
    author: "Robert Wilson",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 65,
  },
  {
    id: 4,
    title: "Democracy and Finance",
    author: "Maria Garcia",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 63,
  },
  {
    id: 5,
    title: "Political Economy",
    author: "David Lee",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 61,
  },
  {
    id: 6,
    title: "US Elections Guide",
    author: "Sarah Johnson",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 60,
  },
  {
    id: 7,
    title: "Modern Governance",
    author: "Alex Brown",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 58,
  },
  {
    id: 8,
    title: "Public Policy",
    author: "Emily White",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 55,
  },
  {
    id: 9,
    title: "Political Science",
    author: "Michael Chen",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 52,
  },
  {
    id: 10,
    title: "Law and Society",
    author: "Lisa Taylor",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 50,
  },
  {
    id: 11,
    title: "Constitutional Law",
    author: "James Anderson",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 48,
  },
  {
    id: 12,
    title: "International Relations",
    author: "Sophie Martin",
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    relevance: 45,
  },
];

export default function BookDetailPage() {
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
              {mockBook.title}
            </h1>

            <p className="text-gray-600 mb-6">
              by{" "}
              <span className="font-semibold text-gray-800">
                {mockBook.author}
              </span>
            </p>

            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {mockBook.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Language
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {mockBook.language}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Publisher
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {mockBook.publisher}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Release Date
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {mockBook.releaseDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  ISBN
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {mockBook.isbn}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-24">
              <div className="bg-violet-100 rounded-2xl p-6 mb-4 flex items-center justify-center">
                <Image
                  src={mockBook.cover}
                  alt={mockBook.title}
                  width={200}
                  height={300}
                  className="w-auto h-64 md:h-72 rounded-lg shadow-xl object-contain"
                  priority
                />
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 h-11">
                  <Download className="h-4 w-4 mr-2" />
                  Download
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
            loop={true}
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
            {similarBooks.map((book) => (
              <SwiperSlide key={book.id}>
                <Link href={`/book/${book.id}`} className="block group">
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="aspect-[3/4] flex items-center justify-center mb-3">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        width={100}
                        height={150}
                        className="w-auto h-28 md:h-32 rounded shadow-sm group-hover:shadow-md transition-shadow"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-violet-600 transition-colors">
                      {book.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-0.5 rounded border border-violet-300 text-violet-600">
                        Similarity
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {book.relevance}%
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>
    </div>
  );
}
