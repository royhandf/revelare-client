import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_REVELARE_API_URL;

export interface Book {
  id: number;
  title: string;
  cover: string;
  average_similarity: number;
  similarity_count: number;
  std_dev?: number;
}

export interface BookDetail {
  id: number;
  title: string;
  authors: string;
  editors: string;
  description: string;
  cover_link: string;
  pdf_link: string;
  publisher: string;
  published: number;
  language: string;
  isbn: string;
  subject: string;
  table_of_contents: string;
}

export interface SearchBooksResponse {
  current_page: number;
  data: Book[];
  query: string;
  status: string;
  total_pages: number;
  total_results: number;
}

export interface SearchBooksParams {
  query: string;
  scenario?: string;
  page?: number;
}

export interface BookDetailResponse {
  data: BookDetail;
  status: string;
}

export const bookService = {
  search: async (params: SearchBooksParams): Promise<SearchBooksResponse> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    const response = await axios.get(`${BASE_URL}/api/books/search`, {
      params: {
        query: params.query,
        scenario: params.scenario || "3",
        page: params.page || 1,
      },
    });

    return response.data;
  },

  getById: async (id: number): Promise<BookDetailResponse> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    const response = await axios.get(`${BASE_URL}/api/books/${id}`);
    return response.data;
  },
};
