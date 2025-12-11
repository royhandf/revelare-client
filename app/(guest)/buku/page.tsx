"use client";

import { useState } from "react";
import { Search, BookX } from "lucide-react";
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

const mockBooks = [
  {
    average_similarity: 0.6990130317861409,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/91093/2/9780472904532.pdf.jpg",
    id: 68286,
    similarity_count: 7,
    title: "The Fundamentals of Campaign Finance in the U.S.",
  },
  {
    average_similarity: 0.6104636591478697,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/59253/7/9780197655870_Print.pdf.jpg",
    id: 75053,
    similarity_count: 7,
    title: "Public Law and Economics",
  },
  {
    average_similarity: 0.605136926565498,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/102262/3/9781003852599.pdf.jpg",
    id: 66522,
    similarity_count: 7,
    title: "Magnus the Lawmender's Laws of the Land",
  },
  {
    average_similarity: 0.6033787640930498,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/59777/7/9781000823882.pdf.jpg",
    id: 74008,
    similarity_count: 7,
    title: "Histories of Tax Evasion, Avoidance and Resistance",
  },
  {
    average_similarity: 0.5996598639455782,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/94869/7/9781040273449.pdf.jpg",
    id: 67377,
    similarity_count: 7,
    title: "Freedom of Expression and the Law in Russia",
  },
  {
    average_similarity: 0.5935897435897436,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/64037/7/9780472903795.pdf.jpg",
    id: 72521,
    similarity_count: 7,
    title: "In Defense of Free Speech in Universities",
  },
  {
    average_similarity: 0.5552066980638408,
    cover:
      "https://library.oapen.org/bitstream/20.500.12657/94226/7/9781612498553.pdf.jpg",
    id: 69675,
    similarity_count: 7,
    title: "The Ripple Effect",
  },
];

function SimilarityBadge({ value }: { value: number }) {
  const percentage = (value * 100).toFixed(0);
  const getLabel = () => {
    if (value >= 0.7)
      return {
        text: "Sangat Relevan",
        color: "text-green-700 bg-green-50 border-green-200",
      };
    if (value >= 0.5)
      return {
        text: "Relevan",
        color: "text-violet-700 bg-violet-50 border-violet-200",
      };
    return {
      text: "Cukup Relevan",
      color: "text-gray-700 bg-gray-50 border-gray-200",
    };
  };
  const label = getLabel();

  return (
    <div className="flex items-center justify-between mt-2.5">
      <span className={`text-xs px-2 py-1 rounded-md border ${label.color}`}>
        {label.text}
      </span>
      <span className="text-lg font-semibold text-violet-600">
        {percentage}%
      </span>
    </div>
  );
}

export default function BookListPage() {
  const [scenario, setScenario] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [books] = useState(mockBooks);

  const handleSearch = () => {
    console.log("Searching:", { scenario, searchQuery });
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
                <SelectItem value="0">Tanpa TF-IDF</SelectItem>
                <SelectItem value="-1">Tanpa Semantik</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul atau topik ..."
              className="h-12 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <Button
              onClick={handleSearch}
              size="icon"
              className="h-12 w-12 rounded-none bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Hasil Pencarian{" "}
            <span className="text-gray-500 font-normal">
              ({books.length} buku ditemukan)
            </span>
          </h2>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-500 max-w-md">
              Coba gunakan kata kunci yang berbeda atau ubah skenario pencarian.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <Link href={`/buku/${book.id}`} key={book.id} className="group">
                <Card className="h-full overflow-hidden border border-gray-200 hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-64 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-3">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      width={200}
                      height={267}
                      className="max-h-full w-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
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
      </main>
    </div>
  );
}
