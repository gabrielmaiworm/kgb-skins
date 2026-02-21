import { NextRequest, NextResponse } from "next/server";
import { getScreenshot } from "@/infra/getScreenshot";
import { getCampaignByIdAction } from "@/app/actions/campaings/gets";

interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  itemCondition: string;
  itemFloat: string;
  pricePerTicket: number;
  totalTickets: number;
  status: string;
  coverImage?: string;
  gallery: string[];
  isFree: boolean;
}

const getFloatBarPosition = (floatValue: string, condition: string) => {
  const float = parseFloat(floatValue);

  const ranges: Record<string, { min: number; max: number }> = {
    "Factory New": { min: 0.0, max: 0.07 },
    "Minimal Wear": { min: 0.07, max: 0.15 },
    "Field-Tested": { min: 0.15, max: 0.38 },
    "Well-Worn": { min: 0.38, max: 0.45 },
    "Battle-Scarred": { min: 0.45, max: 1.0 },
  };

  const range = ranges[condition] || { min: 0, max: 1 };
  const position = ((float - range.min) / (range.max - range.min)) * 100;
  return Math.max(0, Math.min(100, position));
};

const getHTML = (campaign: Campaign) => {
  const imagem = campaign.coverImage || campaign.gallery[0] || "/img/placeholder.png";
  const disponivel = campaign.status === "ACTIVE";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #1a0505 0%, #2d0a0a 100%);
        padding: 40px;
        width: 600px;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card-container {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 20px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        width: 100%;
      }

      .image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 16/9;
        border-radius: 16px;
        overflow: hidden;
        background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 24px;
      }

      .image-container img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 16px;
      }

      .title {
        font-size: 32px;
        font-weight: 700;
        color: white;
        margin-bottom: 12px;
        text-align: center;
      }

      .subtitle {
        font-size: 22px;
        font-weight: 600;
        color: #FFD700;
        margin-bottom: 24px;
        text-align: center;
      }

      .button {
        width: 100%;
        padding: 18px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 24px;
        ${
          disponivel
            ? "background: linear-gradient(135deg, #E60000 0%, #FFD700 100%); color: white;"
            : "background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); border: 1px solid rgba(255, 255, 255, 0.2);"
        }
      }

      .watermark {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.4);
        font-size: 14px;
      }

      .watermark-logo {
        font-size: 26px;
        font-weight: 700;
        background: linear-gradient(135deg, #E60000 0%, #FFD700 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>
    <div class="card-container">
      <div class="image-container">
        <img src="${imagem}" alt="${campaign.title}" />
      </div>

      <h3 class="title">${campaign.title}</h3>
      <p class="subtitle">${campaign.subtitle}</p>

      <div class="button">
        ${disponivel ? "Participar agora" : "Rifa encerrada"}
      </div>

      <div class="watermark">
        <div class="watermark-logo">KGB SKINS</div>
        <div>www.kgbskins.com</div>
      </div>
    </div>
  </body>
</html>
  `;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isHTMLDebugMode = searchParams.get("debug") === "true";
    const campaignId = searchParams.get("id");

    if (!campaignId) {
      return NextResponse.json({ error: "ID da campanha é obrigatório. Use ?id=CAMPAIGN_ID" }, { status: 400 });
    }

    const campaignResponse = await getCampaignByIdAction(campaignId);

    if (!campaignResponse.success || !campaignResponse.responseData) {
      return NextResponse.json({ error: "Não foi possível buscar a campanha." }, { status: 500 });
    }

    const campaign = campaignResponse.responseData as unknown as Campaign;

    const html = getHTML(campaign);

    if (isHTMLDebugMode) {
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    const file = await getScreenshot(html, { width: 600, height: 600 });

    return new NextResponse(file as any, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar imagem da campanha:", error);

    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      {
        error: "Erro ao gerar imagem da campanha",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
