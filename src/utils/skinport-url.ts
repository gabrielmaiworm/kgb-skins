/**
 * Converte o link de inspecionar arma (steam:// ou URL) para o visualizador 3D do Skinport.
 * Exemplo: steam://rungame/730/... → https://3d.skinport.com/pt?link=steam%3A%2F%2F...
 */
export function getSkinportViewerUrl(inspectLink: string): string {
  if (!inspectLink?.trim()) return "#";
  const encoded = encodeURIComponent(inspectLink.trim());
  return `https://3d.skinport.com/pt?link=${encoded}`;
}
