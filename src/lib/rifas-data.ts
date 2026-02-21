export interface Rifa {
  id: string;
  nome: string;
  arma: string;
  skin: string;
  condicao: string;
  float: number;
  valorRifa: number;
  rifasDisponiveis: number;
  rifasTotais: number;
  disponivel: boolean;
  dataInicio: string;
  imagem: string;
  ganhador: string | null;
  dataSorteio: string | null;
  prints: string[];
}

// Dados mockados - depois virá de uma API
export const rifasData: Rifa[] = [
  {
    id: "skin-001",
    nome: "Butterfly Knife | Gamma Doppler",
    arma: "Butterfly Knife",
    skin: "Gamma Doppler",
    condicao: "Factory New",
    float: 0.0063,
    valorRifa: 10.0,
    rifasDisponiveis: 87,
    rifasTotais: 100,
    disponivel: true,
    dataInicio: "2025-01-05T10:00:00Z",
    imagem:
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvxu97veBWSyajhREioQKVko7qJHn4Ml93UtZuF-AK4USwmtS2Nei05w2NjNoQzCX9iXwavHo-57oKVfFw__GFjVvGNKp9v8f8XHnkNg/280x210",
    ganhador: null,
    dataSorteio: null,
    prints: [
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvxu97veBWSyajhREioQKVko7qJHn4Ml93UtZuF-AK4USwmtS2Nei05w2NjNoQzCX9iXwavHo-57oKVfFw__GFjVvGNKp9v8f8XHnkNg/280x210",
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvxu97veBWSyajhREioQKVko7qJHn4Ml93UtZuF-AK4USwmtS2Nei05w2NjNoQzCX9iXwavHo-57oKVfFw__GFjVvGNKp9v8f8XHnkNg/280x210",
    ],
  },
  {
    id: "skin-003",
    nome: "AWP | Dragon Lore",
    arma: "AWP",
    skin: "Dragon Lore",
    condicao: "Minimal Wear",
    float: 0.08,
    valorRifa: 25.0,
    rifasDisponiveis: 12,
    rifasTotais: 150,
    disponivel: true,
    dataInicio: "2025-01-10T12:00:00Z",
    imagem:
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cxTLN1F4ToxzRbQMukK6k4HnZe3k4gPW34hFmCWrjCgd5yk55-1RBfB0rq2D2w7FL_RjtjtuH2jv/280x210",
    ganhador: null,
    dataSorteio: null,
    prints: [
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cxTLN1F4ToxzRbQMukK6k4HnZe3k4gPW34hFmCWrjCgd5yk55-1RBfB0rq2D2w7FL_RjtjtuH2jv/280x210",
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cxTLN1F4ToxzRbQMukK6k4HnZe3k4gPW34hFmCWrjCgd5yk55-1RBfB0rq2D2w7FL_RjtjtuH2jv/280x210",
    ],
  },
  {
    id: "skin-005",
    nome: "Karambit | Fade",
    arma: "Karambit",
    skin: "Fade",
    condicao: "Factory New",
    float: 0.01,
    valorRifa: 12.0,
    rifasDisponiveis: 64,
    rifasTotais: 100,
    disponivel: true,
    dataInicio: "2025-01-12T09:00:00Z",
    imagem:
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cBTLN1F4TowkROZctEXqxNO2Nevn4QzZ2I9Mz3r62C9L634_5uhTWKEh_fKD2w7HL_RjthCBcAWy/280x210",
    ganhador: null,
    dataSorteio: null,
    prints: [
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cBTLN1F4TowkROZctEXqxNO2Nevn4QzZ2I9Mz3r62C9L634_5uhTWKEh_fKD2w7HL_RjthCBcAWy/280x210",
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cBTLN1F4TowkROZctEXqxNO2Nevn4QzZ2I9Mz3r62C9L634_5uhTWKEh_fKD2w7HL_RjthCBcAWy/280x210",
    ],
  },
  {
    id: "skin-002",
    nome: "AK-47 | Fire Serpent",
    arma: "AK-47",
    skin: "Fire Serpent",
    condicao: "Field-Tested",
    float: 0.27,
    valorRifa: 5.0,
    rifasDisponiveis: 0,
    rifasTotais: 200,
    disponivel: false,
    dataInicio: "2024-12-20T18:00:00Z",
    imagem:
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJp-RrXBahkBkYvzSCkpu3JyiSbAQkC8d1E7YJtEXtkIazMruz4lOP3dpGmCyt23hA731v4LkKAL1lpPOyoS0Ibw/280x210",
    ganhador: "user_94821",
    dataSorteio: "2025-01-02T21:00:00Z",
    prints: [
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJp-RrXBahkBkYvzSCkpu3JyiSbAQkC8d1E7YJtEXtkIazMruz4lOP3dpGmCyt23hA731v4LkKAL1lpPOyoS0Ibw/280x210",
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJp-RrXBahkBkYvzSCkpu3JyiSbAQkC8d1E7YJtEXtkIazMruz4lOP3dpGmCyt23hA731v4LkKAL1lpPOyoS0Ibw/280x210",
    ],
  },
  {
    id: "skin-004",
    nome: "M4A4 | Howl",
    arma: "M4A4",
    skin: "Howl",
    condicao: "Field-Tested",
    float: 0.31,
    valorRifa: 8.0,
    rifasDisponiveis: 0,
    rifasTotais: 120,
    disponivel: false,
    dataInicio: "2024-12-15T14:00:00Z",
    imagem:
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_CNk7uW-V6JsJPWsAm6Xyfo45-c5GXDnwB534DuEwtuoIHOfaAYiAsYjF-QItUaxmoC0MO_h5ALcjJUFk3sEzfdk4w/280x210",
    ganhador: "user_18302",
    dataSorteio: "2024-12-29T20:30:00Z",
    prints: [
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_CNk7uW-V6JsJPWsAm6Xyfo45-c5GXDnwB534DuEwtuoIHOfaAYiAsYjF-QItUaxmoC0MO_h5ALcjJUFk3sEzfdk4w/280x210",
      "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_CNk7uW-V6JsJPWsAm6Xyfo45-c5GXDnwB534DuEwtuoIHOfaAYiAsYjF-QItUaxmoC0MO_h5ALcjJUFk3sEzfdk4w/280x210",
    ],
  },
];

export const getRifaById = (id: string): Rifa | undefined => {
  return rifasData.find((rifa) => rifa.id === id);
};
