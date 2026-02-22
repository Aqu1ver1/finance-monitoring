type AdviceFocus = "overview" | "savings" | "cuts" | "budget";

type AdviceTransaction = {
  date: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
  category: string;
  description?: string;
};

type AdviceTotals = {
  income: number;
  expense: number;
  net: number;
};

type AdvicePayload = {
  focus: AdviceFocus;
  goal: string;
  currency: string;
  totals: AdviceTotals;
  transactions: AdviceTransaction[];
  language: "en" | "ru";
};

export async function getGptAdvice(payload: AdvicePayload): Promise<string> {
  const baseUrl = import.meta.env.VITE_OPENAI_API_KEY;
  if (!baseUrl) throw new Error("Missing API URL");

  const response = await fetch(`${baseUrl}/api/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Request failed");
  }

  const data = await response.json() as { advice: string };
  return data.advice;
}

export type { AdviceFocus, AdviceTransaction };