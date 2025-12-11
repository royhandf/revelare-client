"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const router = useRouter();
  const [scenario, setScenario] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams();
    params.set("q", searchQuery);
    if (scenario) params.set("scenario", scenario);

    router.push(`/buku?${params.toString()}`);
  };

  return (
    <div className="flex h-[calc(100vh-150px)] items-center justify-center">
      <div className="flex w-full max-w-3xl flex-col items-center px-6">
        <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Temukan Buku <span className="text-violet-600">Favoritmu</span>
        </h1>

        <p className="mb-8 max-w-xl text-center text-gray-500">
          Jelajahi koleksi perpustakaan dengan pencarian semantik. Ketik judul
          atau topik yang kamu inginkan.
        </p>

        <div className="flex w-full max-w-2xl items-center overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger className="h-12 w-[180px] pl-4 rounded-none border-0 border-r border-gray-200 bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:border-r focus-visible:border-gray-200">
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
    </div>
  );
}
