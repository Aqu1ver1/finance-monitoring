// src/shared/lib/migration.ts

import type { Category } from "../config/defaultCategories";
import type { Transaction } from "../../entities/transactions/transactions.store";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const BUDGET_KEY = "budget-storage";
const TRANSACTIONS_KEY = "transactions-storage";
const CATEGORIES_KEY = "categories-storage";

interface BudgetPersistedState {
  budget: number;
  scheme: string;
  create_date: string | Date;
}

interface CategoriesPersistedState {
  categories: Category[];
}

interface TransactionsPersistedState {
  transactions: Transaction[];
  // other fields (monthlySummaries, etc.) are ignored for migration
}

type MigrationBudgetDTO =
  | {
      amount: number;
      scheme: string;
      createDate: string;
    }
  | null;

interface MigrationPayload {
  budget: MigrationBudgetDTO;
  categories: Category[];
  transactions: Transaction[];
}

/**
 * Safely parse JSON from localStorage.
 */
function readJson<T>(key: string): T | null {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[migration] Failed to parse localStorage key "${key}"`);
    return null;
  }
}

/**
 * Zustand persist usually stores shape: { state: <yourState>, version: <number> }.
 * This helper extracts the inner `state` if present, otherwise returns the object itself.
 */
function extractState<TState>(input: unknown): TState | null {
  if (!input || typeof input !== "object") return null;

  const obj = input as { state?: unknown };
  if ("state" in obj && obj.state && typeof obj.state === "object") {
    return obj.state as TState;
  }

  return input as TState;
}

/**
 * Build the payload to send to backend from localStorage.
 */
function buildMigrationPayload(): MigrationPayload {
  // Budget
  const rawBudget = readJson<unknown>(BUDGET_KEY);
  const budgetState = extractState<BudgetPersistedState>(rawBudget);

  const budget: MigrationBudgetDTO =
    budgetState && budgetState.budget > 0
      ? {
          amount: budgetState.budget,
          scheme: budgetState.scheme,
          createDate: new Date(budgetState.create_date).toISOString(),
        }
      : null;

  // Custom categories
  const rawCategories = readJson<unknown>(CATEGORIES_KEY);
  const categoriesState = extractState<CategoriesPersistedState>(rawCategories);
  const categories: Category[] = categoriesState?.categories ?? [];

  // Transactions
  const rawTransactions = readJson<unknown>(TRANSACTIONS_KEY);
  const transactionsState = extractState<TransactionsPersistedState>(rawTransactions);
  const transactions: Transaction[] = transactionsState?.transactions ?? [];

  return {
    budget,
    categories,
    transactions,
  };
}

interface RunMigrationOptions {
  clearLocalStorage?: boolean;
}

/**
 * Run one-time migration from localStorage → DB.
 *
 * Expects a backend endpoint:
 *   POST /migration/import
 *   Authorization: Bearer <token>
 *   Body: MigrationPayload (see above)
 *
 * Adjust the URL or payload shape if your backend differs.
 */
export async function runLocalStorageMigration(
  options: RunMigrationOptions = {},
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("[migration] Must be run in a browser (localStorage is not available).");
  }

  const token =
    window.localStorage.getItem("token") ?? window.sessionStorage.getItem("token");

  if (!token) {
    console.info("[migration] No auth token found; skipping migration.");
    return;
  }

  const payload = buildMigrationPayload();

  // If there's literally nothing to migrate, just exit.
  const hasData =
    (payload.budget !== null &&
      payload.budget.amount > 0 &&
      payload.budget.scheme.trim() !== "") ||
    payload.categories.length > 0 ||
    payload.transactions.length > 0;

  if (!hasData) {
    console.info("[migration] Nothing to migrate (all stores are empty).");
    return;
  }

  const res = await fetch(`${API}/migration/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `[migration] Backend migration failed (${res.status}): ${text || res.statusText}`,
    );
  }

  console.info("[migration] Migration succeeded.");

  if (options.clearLocalStorage) {
    window.localStorage.removeItem(BUDGET_KEY);
    window.localStorage.removeItem(TRANSACTIONS_KEY);
    window.localStorage.removeItem(CATEGORIES_KEY);
    console.info("[migration] Cleared legacy localStorage keys.");
  }
}