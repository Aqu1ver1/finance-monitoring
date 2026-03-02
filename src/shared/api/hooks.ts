import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import type { Transaction } from "../../entities/transactions/transactions.store";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useBudget() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["budget"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${API}/api/budget`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch budget");
      }
      const data = (await res.json()) as { budget: unknown };
      return data.budget;
    },
  });
}

export function useCategories() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["categories"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${API}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = (await res.json()) as { categories: unknown[] };
      return data.categories;
    },
  });
}

export function useTransactionsFromApi() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["transactions"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${API}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = (await res.json()) as {
        transactions: Array<{
          id: number;
          amount: number;
          type: number;
          categoryId: number;
          id_category?: number;
          description: string | null;
          date: string;
        }>;
      };

      const transactions: Transaction[] = data.transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type as Transaction["type"],
        id_category: transaction.id_category ?? transaction.categoryId,
        description: transaction.description ?? undefined,
        date: new Date(transaction.date),
      }));

      return transactions;
    },
  });
}

