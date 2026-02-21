/**
 * Extrai todas as mensagens de erro de um objeto de erro
 * @param errors Objeto de erros do React Hook Form
 * @returns Array com todas as mensagens de erro
 */
export const extractErrorMessages = (errors: any): string[] => {
  if (!errors) return [];

  // Array para armazenar todas as mensagens de erro
  const messages: string[] = [];

  // Função recursiva para extrair mensagens de erro de objetos aninhados
  const extractMessages = (obj: any, path: string = "") => {
    if (!obj) return;

    // Se for um objeto de erro com mensagem, adiciona a mensagem
    if (obj.message && typeof obj.message === "string") {
      const fieldName = path.length > 0 ? path : "Campo";
      messages.push(`${fieldName}: ${obj.message}`);
    }

    // Se for um objeto, percorre suas propriedades
    if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path.length > 0 ? `${path}.${key}` : key;

        // Se for um objeto, faz chamada recursiva
        if (typeof value === "object" && value !== null) {
          extractMessages(value, newPath);
        }
      });
    }
  };

  // Inicia a extração recursiva
  extractMessages(errors);

  return messages;
};
