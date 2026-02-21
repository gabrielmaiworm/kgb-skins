/** Inverso da priceMask: "R$ 1.234,56" -> "1234.56" | "41.34" -> "41.34" */
export const parseFormattedPrice = (value: string): string => {
  if (!value || typeof value !== "string") return "0";
  const trimmed = value.replace(/[R$\s]/g, "").trim();
  if (!trimmed) return "0";
  if (trimmed.includes(",")) {
    const noThousands = trimmed.replace(/\./g, "");
    const withDot = noThousands.replace(",", ".");
    const num = parseFloat(withDot);
    return isNaN(num) ? "0" : num.toString();
  }
  const num = parseFloat(trimmed);
  return isNaN(num) ? "0" : num.toString();
};

/** Formata como moeda BR: centavos ou string -> "R$ 41,34" */
export const priceMask = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  const amount = parseInt(numbers, 10) / 100;
  const formatted = amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${formatted}`;
};

export const phoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  let formatted = "";

  if (numbers.length >= 1) {
    formatted = `(${numbers.slice(0, 2)}`;
  }
  if (numbers.length >= 3) {
    formatted += `) ${numbers.slice(2, 7)}`;
  }
  if (numbers.length >= 8) {
    formatted += `-${numbers.slice(7, 11)}`;
  }

  return formatted || numbers;
};
