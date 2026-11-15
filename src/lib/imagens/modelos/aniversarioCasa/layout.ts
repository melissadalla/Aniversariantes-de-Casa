import type { Caixa } from '@/lib/imagens/tipos'

export const TAMANHO = { largura: 1200, altura: 627 }

export const MARGEM = 63

/**
 * Os tamanhos de fonte vieram do Canva (39,5 / 25 / 18) e as unidades de lá não
 * são os pixels desta arte. Este fator veio de medir a altura de caixa alta na
 * referência exportada — é estimativa, conferida contra
 * `docs/referencias/aniversario-casa.png` na página /preview.html.
 */
export const ESCALA_CANVA = 1200 / 875

export const LOGO: Caixa = { x: MARGEM, y: MARGEM, largura: 177, altura: 66 }

/**
 * O shape tem largura fixa e altura variável: ele abraça o texto e fica
 * centralizado na vertical. A arte do Canva tinha altura fixa de 475px, feita
 * em cima do texto de 7 anos — com ela, a copy de 5 anos (uma linha mais longa)
 * passava da borda.
 */
export const LARGURA_SHAPE = 662
/** `radius-md` do design system. */
export const RAIO_SHAPE = 32
export const PADDING_SHAPE = 40
export const GAP_TITULO_CORPO = 20

export function caixaShape(altura: number): Caixa {
  return {
    x: TAMANHO.largura - MARGEM - LARGURA_SHAPE,
    y: Math.round((TAMANHO.altura - altura) / 2),
    largura: LARGURA_SHAPE,
    altura,
  }
}

/**
 * Fundo e cartão na versão escura da Identidade Visual SplitC, a mesma da peça
 * do mês: o fundo oficial `video-fundo-escuro-horizontal` em tela cheia (cover)
 * e o cartão do texto em Brown translúcido, com borda fina no `gradiente-1` e
 * canto `radius-md`. O texto é longo, por isso o cartão continua: ele garante a
 * leitura sobre os brilhos do fundo.
 */
export const CARTAO = {
  fundo: 'rgba(25, 13, 1, 0.74)',
  borda: 2,
}

export const LARGURA_CONTEUDO = LARGURA_SHAPE - PADDING_SHAPE * 2

/** X do texto, fixo porque a largura do shape é fixa. */
export const X_CONTEUDO = TAMANHO.largura - MARGEM - LARGURA_SHAPE + PADDING_SHAPE

export const TITULO_1 = {
  tamanho: 46 * ESCALA_CANVA,
  entrelinha: 0.99,
  x: MARGEM,
  /**
   * Onde a tinta da última linha termina. Ancorar pela tinta, e não pela linha
   * de base, mantém os 63px de margem iguais quando o tamanho ou a entrelinha
   * mudam — era o que um ajuste fixo em cima da linha de base não fazia.
   */
  fimDaTinta: TAMANHO.altura - MARGEM,
  /** Vai da margem esquerda até a borda do shape. */
  larguraMax: TAMANHO.largura - MARGEM - LARGURA_SHAPE - MARGEM,
}

export const TITULO_2 = {
  tamanho: 25 * ESCALA_CANVA,
  entrelinha: 1.3,
  /**
   * O Canva posiciona o texto pela caixa de linha dele, que não dá para
   * reproduzir a partir das métricas do canvas. Este recuo entre o topo da
   * área útil e a primeira tinta foi medido no export.
   */
  recuoTopo: 12,
}

export const CORPO = {
  tamanho: 18 * ESCALA_CANVA,
  /** 33px entre linhas, medidos no export (o Canva não expõe o valor). */
  entrelinha: 33 / (18 * ESCALA_CANVA),
  cor: '#fff7f0',
}

/**
 * O Canva compõe o texto um pouco mais apertado que o Chrome: com o mesmo
 * tamanho de fonte (as alturas medidas batem exatamente), as linhas do export
 * saem ~3,5% mais estreitas. Este tracking recupera a diferença — sem ele o
 * corpo ganha linhas que o original não tem.
 */
export const TRACKING = '-0.0145em'

export function fonteTitulo1(): string {
  return `italic 400 ${TITULO_1.tamanho}px "DM Serif Display", serif`
}

export function fonteOutfit(tamanho: number, negrito: boolean): string {
  return `${negrito ? 700 : 400} ${tamanho}px "Outfit Variable", sans-serif`
}

/** Servidos de `public/`, então o base path do Vite entra na URL. */
export const URL_BACKGROUND = `${import.meta.env.BASE_URL}fundo-escuro-horizontal.jpg`
/** Logo negativo oficial (800x297), a da versão escura. */
export const URL_LOGO = `${import.meta.env.BASE_URL}logo-splitc-negativo.png`
