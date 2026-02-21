import { z } from "zod";

/**
 * Gera valores padrão para um esquema Zod baseado nos tipos de seus campos
 * Útil para preencher formulários automaticamente em ambiente de desenvolvimento
 */
export function generateDefaultValuesFromSchema<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  // Função interna que processa cada tipo de esquema Zod
  function processSchema(schema: z.ZodTypeAny, fieldPath: string = ""): any {
    // Trata objetos Zod
    if (schema instanceof z.ZodObject) {
      const shape = schema._def.shape();
      const result: Record<string, any> = {};

      // Verifica se é um objeto de imagem
      if (
        fieldPath.includes("image") ||
        (shape.image !== undefined && shape.file !== undefined) ||
        fieldPath === "images[0]"
      ) {
        // Retorna um objeto vazio para campos de imagem
        return { image: "", file: undefined };
      }

      // Processa cada campo do objeto
      Object.entries(shape).forEach(([key, value]) => {
        result[key] = processSchema(value as z.ZodTypeAny, fieldPath ? `${fieldPath}.${key}` : key);
      });

      return result;
    }

    if (schema instanceof z.ZodArray) {
      if (fieldPath === "images") {
        return [{ image: "", file: undefined }];
      }
      return [processSchema(schema._def.type, `${fieldPath}[0]`)];
    }

    // Trata strings Zod
    if (schema instanceof z.ZodString) {
      // Detecta campos específicos pelo nome e gera valores apropriados
      const fieldName = schema._def.description?.toLowerCase() || fieldPath.toLowerCase() || "";

      // Função auxiliar para verificar se o campo contém determinada palavra-chave
      const fieldContains = (keyword: string) => {
        return fieldName.includes(keyword);
      };

      // Se for um campo de imagem, retorna string vazia para evitar erros de URL
      if (fieldContains("image") || fieldContains("url") || fieldContains("src")) {
        return "";
      }

      // Valores para outros campos conforme seus nomes
      if (fieldContains("email")) return "exemplo@email.com";
      if (fieldContains("nome")) return "Nome Exemplo";
      if (fieldContains("modelo")) return "Modelo XYZ";
      if (fieldContains("fabricante")) return "Fabricante ABC";
      if (fieldContains("dimensoes")) return "150 x 75 x 8 mm";
      if (fieldContains("ano")) return "2023";
      if (fieldContains("peso")) return "200g";
      if (fieldContains("sim_card")) return "Nano-SIM";
      if (fieldContains("rede_gsm")) return "850 / 900 / 1800 / 1900";
      if (fieldContains("rede_hspa")) return "850 / 900 / 1900 / 2100";
      if (fieldContains("rede_lte"))
        return "1, 2, 3, 4, 5, 7, 8, 12, 13, 17, 18, 19, 20, 25, 26, 28, 38, 39, 40, 41, 66";
      if (fieldContains("velocidade")) return "1.2 Gbps";
      if (fieldContains("processador")) return "Octa-core (1x3.0 GHz & 3x2.4 GHz & 4x1.7 GHz)";
      if (fieldContains("chipset")) return "Snapdragon 8 Gen 2";
      if (fieldContains("gpu")) return "Adreno 740";
      if (fieldContains("ram")) return "12 GB";
      if (fieldContains("memoria")) return "256 GB";
      if (fieldContains("tela_polegadas")) return "6.8 polegadas";
      if (fieldContains("resolucao")) return "1440 x 3088 pixels";
      if (fieldContains("densidade")) return "500 ppi";
      if (fieldContains("fps")) return "120 Hz";
      if (fieldContains("camera_megapixels")) return "200 MP + 12 MP + 10 MP";
      if (fieldContains("sensor")) return '1/1.33"';
      if (fieldContains("aperture")) return "f/1.8";
      if (fieldContains("video_resolucao")) return "8K (7680x4320)";
      if (fieldContains("video_fps")) return "24/30/60 fps";
      if (fieldContains("bateria")) return "5000 mAh";

      // Valores padrão para tipos específicos de campos baseados em seus nomes
      if (fieldContains("processor") || fieldContains("processador"))
        return "Octa-core (1x3.0 GHz & 3x2.4 GHz & 4x1.7 GHz)";
      if (fieldContains("chipset")) return "Snapdragon 8 Gen 2";
      if (fieldContains("gpu")) return "Adreno 740";
      if (fieldContains("ram") || fieldContains("memória_ram")) return "12 GB";
      if (fieldContains("storage") || fieldContains("armazenamento")) return "256 GB";

      // Se não encontrou nenhum tipo específico, retorna um texto genérico
      return `Exemplo ${fieldPath}`;
    }

    // Trata números Zod
    if (schema instanceof z.ZodNumber) {
      if (fieldPath.includes("price") || fieldPath.includes("preco") || fieldPath.includes("preço")) {
        return 1999.99;
      }
      if (fieldPath.includes("quantidade") || fieldPath.includes("quantity") || fieldPath.includes("qty")) {
        return 10;
      }
      return 42;
    }

    // Trata booleanos Zod
    if (schema instanceof z.ZodBoolean) {
      return true;
    }

    // Trata datas Zod
    if (schema instanceof z.ZodDate) {
      return new Date();
    }

    // Trata enums Zod
    if (schema instanceof z.ZodEnum) {
      return schema._def.values[0];
    }

    // Trata literais Zod
    if (schema instanceof z.ZodLiteral) {
      return schema._def.value;
    }

    // Trata campos opcionais Zod
    if (schema instanceof z.ZodOptional) {
      // Verifica se é um campo relacionado a imagens
      if (fieldPath.includes("image") || fieldPath.includes("file")) {
        return undefined;
      }
      // Para campos opcionais, geramos valores de exemplo de qualquer forma
      return processSchema(schema._def.innerType, fieldPath);
    }

    // Trata campos nulos Zod
    if (schema instanceof z.ZodNullable) {
      return processSchema(schema._def.innerType, fieldPath);
    }

    // Para tipos default ou não reconhecidos, retorna null
    return null;
  }

  return processSchema(schema);
}

/**
 * Gera valores padrão para formulários apenas em ambiente de desenvolvimento
 */
export function getDevDefaultValues<T extends z.ZodTypeAny>(schema: T): z.infer<T> | {} {
  // Verifica se estamos em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "development") {
    return generateDefaultValuesFromSchema(schema);
  }

  // Em produção, retorna um objeto vazio
  return {};
}
