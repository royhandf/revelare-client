import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_REVELARE_API_URL;

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    if (!BASE_URL) {
      throw new Error("Server is not configured properly.");
    }

    const response = await axios.post(`${BASE_URL}/api/signup`, data);
    return response.data;
  },
};
