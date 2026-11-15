/**
 * Geometria da peça do mês, na versão escura da Identidade Visual SplitC
 * (design system "Identidade Visual SplitC", seção Redes sociais):
 *
 * - fundo `video-fundo-escuro-horizontal`, em tela cheia e sem zoom;
 * - logo negativo centralizada na base, com margem generosa;
 * - título que mistura Outfit semibold (Beige) com um destaque em DM Serif
 *   Display itálico no `gradiente-1`, a serifada maior que a Outfit;
 * - toda linha da arte (aros, arcos, fios) no gradiente da versão;
 * - ícone da Lucide, em traço, dentro de um círculo com contorno.
 */

export const TAMANHO = { largura: 1920, altura: 1080 }

export const MARGEM_LATERAL = 120

export const URL_BACKGROUND = `${import.meta.env.BASE_URL}fundo-escuro-horizontal.jpg`
export const URL_LOGO = `${import.meta.env.BASE_URL}logo-splitc-negativo.png`

/** Cores da marca (tokens do design system). */
export const COR = {
  beige: '#fff7f0',
  brown: '#190d01',
  laranja: '#f87f06',
  intenso: '#f75405',
  amarelo: '#f7a205',
  coral: '#ff5e69',
  /** Orange Dark 1: trilhos e linhas de compor no escuro. */
  escuro1: '#723a03',
}

/** `gradiente-1`: yellow 10% → orange-default 50% → orange-intense 90%. */
export const GRADIENTE_1: readonly [number, string][] = [
  [0.1, COR.amarelo],
  [0.5, COR.laranja],
  [0.9, COR.intenso],
]

/** Logo negativo (800x297), centralizada na base. */
export const LOGO = { largura: 208, margemInferior: 64 }

/** Rótulo com ícone, acima do título. Nunca em caixa alta. */
export const ROTULO = {
  y: 112,
  icone: 64,
  gap: 20,
  tamanho: 28,
}

/** Título: Outfit semibold + destaque em DM Serif itálico (+8px, como a regra de +5px na escala de 48). */
export const TITULO = {
  /** Linha de base do título. */
  base: 268,
  tamanho: 72,
  tamanhoSerif: 82,
}

export const SUBTITULO = { base: 324, tamanho: 28 }

/** Faixa onde o bloco de pessoas é centralizado: do subtítulo até a logo. */
export const AREA_DAS_PESSOAS = { topo: 372, base: 900 }

/** Medidas de projeto de cada pessoa; o bloco inteiro encolhe se não couber. */
export const PESSOA = {
  /** Largura da célula; o nome tem de caber nela. */
  largura: 304,
  gapX: 24,
  gapY: 40,
  /** Diâmetro da foto. */
  foto: 236,
  /** Aro no gradiente em volta da foto, com um respiro escuro entre os dois. */
  aro: 6,
  respiro: 10,
  /** Selo de tempo de casa, em pílula no gradiente, sobre a base do aro. */
  selo: { altura: 50, padding: 24, tamanho: 25 },
  nome: { tamanho: 32, gapAcima: 22 },
  setor: { tamanho: 24, gapAcima: 8 },
}

/** Deslocamento vertical das colunas alternadas, para a fileira não virar grade de slide. */
export const ONDA = 28

export function diametroDoAro(): number {
  return PESSOA.foto + (PESSOA.respiro + PESSOA.aro) * 2
}

export function alturaDaPessoa(): number {
  return (
    diametroDoAro() +
    PESSOA.selo.altura / 2 +
    PESSOA.nome.gapAcima +
    PESSOA.nome.tamanho * 1.2 +
    PESSOA.setor.gapAcima +
    PESSOA.setor.tamanho * 1.3
  )
}

export function fonteOutfit(tamanho: number, peso: 400 | 600 | 700): string {
  return `${peso} ${tamanho}px "Outfit Variable", sans-serif`
}

export function fonteSerif(tamanho: number): string {
  return `italic 400 ${tamanho}px "DM Serif Display", serif`
}

/**
 * Ícone `party-popper` da Lucide (lucide.dev), no desenho original, viewBox 24.
 * Desenhado em traço, sem preenchimento, como pede o design system.
 */
export const ICONE_PARTY_POPPER = [
  'M5.8 11.3 2 22l10.7-3.79',
  'M4 3h.01',
  'M22 8h.01',
  'M15 2h.01',
  'M22 20h.01',
  'm22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10',
  'm22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17',
  'm11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7',
  'M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z',
]
