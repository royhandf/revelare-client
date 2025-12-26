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

export interface DashboardBooksResponse {
  current_page: number;
  data: BookDetail[];
  status: string;
  total_books: number;
  total_pages: number;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized - Token expired");
    this.name = "UnauthorizedError";
  }
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

  dashboardGetAll: async (
    token: string,
    page: number = 1,
    search: string = ""
  ): Promise<DashboardBooksResponse> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/books`, {
        params: { page, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },

  dashboardDelete: async (token: string, bookId: number): Promise<void> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      await axios.delete(`${BASE_URL}/api/dashboard/books/delete/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },

  dashboardCreate: async (
    token: string,
    formData: FormData
  ): Promise<BookDetail> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/dashboard/books/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },

  dashboardUpdate: async (
    token: string,
    bookId: number,
    formData: FormData
  ): Promise<BookDetail> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      const response = await axios.put(
        `${BASE_URL}/api/dashboard/books/edit/${bookId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },
};

export interface BookmarkItem {
  id: number;
  user_id: number;
  book_id: number;
  book_title: string | null;
  book_cover: string | null;
  created_at: string;
}

export interface BookmarkListResponse {
  status: string;
  data: BookmarkItem[];
}

export const bookmarkService = {
  add: async (token: string, userId: number, bookId: number): Promise<void> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      await axios.post(
        `${BASE_URL}/api/bookmarks/add`,
        { user_id: userId, book_id: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },

  getByUser: async (
    token: string,
    userId: number
  ): Promise<BookmarkListResponse> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      const response = await axios.get(`${BASE_URL}/api/bookmarks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },

  delete: async (token: string, bookmarkId: number): Promise<void> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      await axios.delete(`${BASE_URL}/api/bookmarks/delete/${bookmarkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  },
};
