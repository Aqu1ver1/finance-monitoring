import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  rehydrate: () => Promise<void>;
  updateUser: (data: { email?: string; password?: string; name?: string }) => Promise<void>;
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  register: async (email, password, name) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw await res.json();
    const { user, token } = await res.json();
    sessionStorage.setItem('token', token);
    set({ user, token });
  },

  login: async (email, password, remember) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw await res.json();
    const { user, token } = await res.json();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
    if (remember) {
      localStorage.setItem('remember', 'true');
    }
    set({ user, token });
  },

  logout: () => {
    // Clear auth tokens
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('remember');

    // Clear all persisted store data
    // localStorage.removeItem('budget-storage');
    // localStorage.removeItem('transactions-storage');
    // localStorage.removeItem('categories-storage');
    // localStorage.removeItem('currency-storage');

    // Clear backend session cookie (fire-and-forget)
    fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});

    set({ user: null, token: null });
  },

  rehydrate: async () => {
    const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
    if (!token) return set({ isLoading: false });

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const { user } = await res.json();
      set({ user, token, isLoading: false });
    } catch {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('remember');
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateUser: async (data) => {
    const token = get().token;
    const res = await fetch(`${API}/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    const { user, token: newToken } = await res.json();
    if (localStorage.getItem('token')) {
      localStorage.setItem('token', newToken);
    } else {
      sessionStorage.setItem('token', newToken);
    }
    set({ user, token: newToken });
  },
}));
