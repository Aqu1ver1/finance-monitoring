import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
}
export const registerUser = async (email: string, name: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
    email,
    name,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const updateUser = async (data: { email?: string; name?: string; password?: string }): Promise<AuthResponse> => {
  const response = await axios.put<AuthResponse>(
    `${API_URL}/update`,
    data,
  );
  return response.data;
};