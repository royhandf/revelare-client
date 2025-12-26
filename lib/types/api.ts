export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  current_page: number;
  total_pages: number;
  total_results?: number;
  total_books?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  registered_date?: string;
}

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

export interface Bookmark {
  id: number;
  user_id: number;
  book_id: number;
  book_title: string;
  book_cover: string;
  created_at: string;
}
