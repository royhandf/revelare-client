export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  BOOKMARK: "/bookmark",
  DASHBOARD: "/dashboard",
  BOOK_LIST: "/book",
  BOOK_DETAIL: (id: number | string) => `/book/${id}`,
} as const;

export const API_ENDPOINTS = {
  SIGNIN: "/api/signin",
  SIGNUP: "/api/signup",
  GOOGLE_AUTH: "/api/auth/google",
  BOOKS_SEARCH: "/api/books/search",
  BOOKS_DETAIL: (id: number) => `/api/books/${id}`,
  BOOKMARKS_ADD: "/api/bookmarks/add",
  BOOKMARKS_GET: (userId: number) => `/api/bookmarks/${userId}`,
  BOOKMARKS_DELETE: (id: number) => `/api/bookmarks/delete/${id}`,
  DASHBOARD_BOOKS: "/api/dashboard/books",
  DASHBOARD_USERS: "/api/dashboard/users",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
} as const;
