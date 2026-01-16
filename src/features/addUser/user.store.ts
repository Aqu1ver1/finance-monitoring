import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string, remember?: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token, remember = false) => {
    if (remember) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
    set({ user, token });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

// Инициализация при старте приложения
export const initUserStore = () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  if (storedUser && storedToken) {
    useUserStore.setState({
      user: JSON.parse(storedUser),
      token: storedToken,
    });
  }
};
