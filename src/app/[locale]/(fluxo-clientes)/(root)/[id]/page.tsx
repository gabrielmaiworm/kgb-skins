import { Metadata } from "next";
import { PageContainer } from "./_components/PageContainer";

export async function generateMetadata(props: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const compangId = params.id;

  if (!compangId) {
    return {
      title: "KGB SKINS",
      description: "Compra e venda de skins de CS2 com segurança e rapidez",
    };
  }

  try {
    const response = await fetch(`${process.env.BASE_URL_NODE}/campaigns/${compangId}`, {});

    if (!response.ok) {
      throw new Error(`Falha na busca da campanha: ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Dados da campanha inválidos ou ausentes.");
    }

    const campaignUrl = `https://www.kgbskins.com/pt/${compangId}`;
    const generatedImageUrl = `https://www.kgbskins.com/api/gerador-imagem?id=${compangId}`;

    return {
      title: data.title || "KGB SKINS",
      description: data.description || "Compra e venda de skins de CS2 com segurança e rapidez",
      keywords: "Skins CS2, compra de skins, venda de skins, mercado de skins",
      openGraph: {
        title: data.title || "KGB SKINS",
        description: data.description || "Compra e venda de skins de CS2 com segurança e rapidez",
        url: campaignUrl,
        type: "article",
        images: [
          {
            url: generatedImageUrl,
            alt: data.title || "Card da Rifa KGB SKINS",
            width: 600,
            height: 600,
          },
        ],
      },
    };
  } catch (error) {
    const fallbackTitle = "KGB SKINS";
    const campaignUrl = `https://www.kgbskins.com/pt/${compangId}`;

    console.error(`Falha ao carregar metadados para ID: ${compangId}`, error);

    return {
      title: fallbackTitle,
      description: "Compra e venda de skins de CS2 com segurança e rapidez",
      keywords: "Skins CS2, compra de skins, venda de skins, mercado de skins",
      openGraph: {
        title: fallbackTitle,
        description: "Compra e venda de skins de CS2 com segurança e rapidez",
        url: campaignUrl,
        type: "article",
        images: [
          {
            url: "https://www.kgbskins.com/_next/image?url=%2Fimg%2FLOGO-KGBSKINS.png",
            alt: "Logotipo da KGB SKINS",
            width: 164,
            height: 31,
          },
        ],
      },
    };
  }
}

export default async function Page() {
  return <PageContainer />;
}
