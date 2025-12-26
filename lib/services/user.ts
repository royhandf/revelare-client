import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_REVELARE_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface UsersResponse {
  data: User[];
  status: string;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized - Token expired");
    this.name = "UnauthorizedError";
  }
}

export const userService = {
  getAll: async (token: string): Promise<UsersResponse> => {
    if (!BASE_URL) throw new Error("Server is not configured properly.");

    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/users`, {
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
};
