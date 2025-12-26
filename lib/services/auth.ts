import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_REVELARE_API_URL;

export interface AuthResponse {
  status: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    if (!BASE_URL) {
      throw new Error("Server is not configured properly.");
    }

    const response = await axios.post(`${BASE_URL}/api/signup`, data);
    return response.data;
  },

  signin: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    if (!BASE_URL) {
      throw new Error("Server is not configured properly.");
    }

    const response = await axios.post(`${BASE_URL}/api/signin`, data);
    return response.data;
  },

  googleAuth: async (data: {
    email: string;
    name: string;
  }): Promise<AuthResponse> => {
    if (!BASE_URL) {
      throw new Error("Server is not configured properly.");
    }

    const response = await axios.post(`${BASE_URL}/api/auth/google`, data);
    return response.data;
  },
};
