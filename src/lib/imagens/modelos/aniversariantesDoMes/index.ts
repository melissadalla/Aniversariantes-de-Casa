import { iniciais, nomeDoMes } from '@/lib/aniversario'
import type { MesReferencia } from '@/lib/aniversario'
import { urlDaFotoParaCanvas } from '@/lib/fotos'
import { coverEm } from '@/lib/imagens/canvas'
import { desenharConfete } from '@/lib/imagens/confete'
import { distribuir } from '@/lib/imagens/modelos/aniversariantesDoMes/grade'
import {
  AREA_DAS_PESSOAS,
  COR,
  GRADIENTE_1,
  ICONE_PARTY_POPPER,
  LOGO,
  MARGEM_LATERAL,
  ONDA,
  PESSOA,
  ROTULO,
  SUBTITULO,
  TAMANHO,
  TITULO,
  URL_BACKGROUND,
  URL_LOGO,
  alturaDaPessoa,
  diametroDoAro,
  fonteOutfit,
  fonteSerif,
} from '@/lib/imagens/modelos/aniversariantesDoMes/layout'
import {
  TITULO as TEXTO_ROTULO,
  encurtarNome,
  encurtarSetores,
  subtitulo,
  tempoDeCasa,
  tituloDoMes,
} from '@/lib/imagens/modelos/aniversariantesDoMes/textos'
import type { Caixa, Modelo, Recursos } from '@/lib/imagens/tipos'

/** O que a arte precisa saber de cada pessoa. */
export interface PessoaNaArte {
  nome: string
  setores: string[]
  anos: number
  fotoUrl?: string | null
}

export interface ParamsDoMes {
  mes: MesReferencia
  pessoas: PessoaNaArte[]
}

function fotosDe(pessoas: PessoaNaArte[]): string[] {
  return pessoas
    .map((p) => p.fotoUrl)
    .filter((url): url is string => typeof url === 'string' && url.length > 0)
    .map(urlDaFotoParaCanvas)
}

export const aniversariantesDoMes: Modelo<ParamsDoMes> = {
  id: 'aniversariantes-do-mes',
  nome: 'Aniversariantes do mês',
  tamanho: TAMANHO,
  imagens: ({ pessoas }) => [URL_BACKGROUND, URL_LOGO, ...fotosDe(pessoas)],
  fontes: [
    fonteSerif(TITULO.tamanhoSerif),
    fonteOutfit(TITULO.tamanho, 600),
    fonteOutfit(SUBTITULO.tamanho, 400),
    fonteOutfit(PESSOA.nome.tamanho, 600),
    fonteOutfit(PESSOA.setor.tamanho, 400),
  ],

  aplicavel({ mes, pessoas }) {
    if (pessoas.length === 0) {
      return `Ninguém faz aniversário de casa em ${nomeDoMes(mes.mes)}.`
    }
    return true
  },

  nomeArquivo({ mes }) {
    return `aniversariantes-${mes.ano}-${String(mes.mes).padStart(2, '0')}.png`
  },

  desenhar(ctx, { mes, pessoas }, recursos) {
    const fundo = recursos.imagens.get(URL_BACKGROUND)
    const logo = recursos.imagens.get(URL_LOGO)
    if (!fundo || !logo) throw new Error('Recursos da arte não carregados.')

    // Fundo da versão escura em tela cheia, sem zoom.
    coverEm(ctx, fundo, { x: 0, y: 0, ...dimensoes() })

    const bloco = medirBloco(pessoas.length)
    const logoCaixa = caixaDaLogo(logo)

    desenharArcos(ctx)
    const cabecalho = desenharCabecalho(ctx, mes, pessoas.length)
    desenharConfete(ctx, {
      ...dimensoes(),
      semente: mes.ano * 100 + mes.mes,
      ocupadas: [cabecalho, bloco.caixa, logoCaixa],
      quantidade: 52,
    })
    desenharPessoas(ctx, pessoas, bloco, recursos)

    ctx.drawImage(logo, logoCaixa.x, logoCaixa.y, logoCaixa.largura, logoCaixa.altura)
  },
}

function dimensoes() {
  return { largura: TAMANHO.largura, altura: TAMANHO.altura }
}

/** `gradiente-1` aplicado à caixa do próprio elemento, em 135°. */
function gradiente1(ctx: CanvasRenderingContext2D, caixa: Caixa): CanvasGradient {
  const g = ctx.createLinearGradient(caixa.x, caixa.y, caixa.x + caixa.largura, caixa.y + caixa.altura)
  for (const [posicao, cor] of GRADIENTE_1) g.addColorStop(posicao, cor)
  return g
}

function caixaDaLogo(logo: HTMLImageElement): Caixa {
  const largura = LOGO.largura
  const altura = (logo.naturalHeight * largura) / logo.naturalWidth
  return {
    x: (TAMANHO.largura - largura) / 2,
    y: TAMANHO.altura - LOGO.margemInferior - altura,
    largura,
    altura,
  }
}

/**
 * Arcos finos no gradiente, em volta dos cantos sem texto. É o "elemento de
 * apoio" da identidade: compõe a peça sem disputar com o título.
 */
function desenharArcos(ctx: CanvasRenderingContext2D): void {
  const conjuntos = [
    { cx: TAMANHO.largura + 40, cy: -40, raios: [250, 310, 370] },
    { cx: -60, cy: TAMANHO.altura + 60, raios: [260, 320] },
  ]
  ctx.save()
  ctx.lineWidth = 2
  for (const { cx, cy, raios } of conjuntos) {
    raios.forEach((raio, i) => {
      ctx.globalAlpha = 0.55 - i * 0.14
      ctx.strokeStyle = gradiente1(ctx, { x: cx - raio, y: cy - raio, largura: raio * 2, altura: raio * 2 })
      ctx.beginPath()
      ctx.arc(cx, cy, raio, 0, Math.PI * 2)
      ctx.stroke()
    })
  }
  ctx.restore()
}

/** Rótulo com ícone, título com destaque em serifada e subtítulo. Devolve a caixa ocupada. */
function desenharCabecalho(ctx: CanvasRenderingContext2D, mes: MesReferencia, total: number): Caixa {
  const x = MARGEM_LATERAL
  ctx.save()
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Ícone da Lucide dentro de um círculo com contorno no gradiente.
  const r = ROTULO.icone / 2
  const cx = x + r
  const cy = ROTULO.y + r
  const caixaIcone = { x: cx - r, y: cy - r, largura: ROTULO.icone, altura: ROTULO.icone }
  ctx.lineWidth = 2
  ctx.strokeStyle = gradiente1(ctx, caixaIcone)
  ctx.beginPath()
  ctx.arc(cx, cy, r - 1, 0, Math.PI * 2)
  ctx.stroke()

  const lado = ROTULO.icone * 0.5
  ctx.save()
  ctx.translate(cx - lado / 2, cy - lado / 2)
  ctx.scale(lado / 24, lado / 24)
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = gradiente1(ctx, { x: 0, y: 0, largura: 24, altura: 24 })
  for (const d of ICONE_PARTY_POPPER) ctx.stroke(new Path2D(d))
  ctx.restore()

  ctx.font = fonteOutfit(ROTULO.tamanho, 400)
  ctx.fillStyle = COR.laranja
  ctx.textBaseline = 'middle'
  ctx.fillText(TEXTO_ROTULO, x + ROTULO.icone + ROTULO.gap, cy + 1)
  ctx.textBaseline = 'alphabetic'

  // Título: Outfit semibold em Beige + mês em DM Serif itálico no gradiente-1.
  const { inicio, destaque } = tituloDoMes(mes)
  ctx.font = fonteOutfit(TITULO.tamanho, 600)
  ctx.fillStyle = COR.beige
  ctx.fillText(inicio, x, TITULO.base)
  const xDestaque = x + ctx.measureText(inicio).width

  ctx.font = fonteSerif(TITULO.tamanhoSerif)
  const m = ctx.measureText(destaque)
  // O gradiente começa e termina no próprio texto, para todas as cores aparecerem.
  ctx.fillStyle = gradiente1(ctx, {
    x: xDestaque,
    y: TITULO.base - m.actualBoundingBoxAscent,
    largura: m.width,
    altura: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
  })
  ctx.fillText(destaque, xDestaque, TITULO.base)

  ctx.font = fonteOutfit(SUBTITULO.tamanho, 400)
  ctx.fillStyle = COR.beige
  ctx.globalAlpha = 0.82
  const textoSub = subtitulo(mes, total)
  ctx.fillText(textoSub, x, SUBTITULO.base)
  ctx.restore()

  ctx.font = fonteOutfit(SUBTITULO.tamanho, 400)
  const larguraSub = ctx.measureText(textoSub).width
  return {
    x,
    y: ROTULO.y,
    largura: Math.max(xDestaque + m.width - x, larguraSub),
    altura: SUBTITULO.base + 12 - ROTULO.y,
  }
}

interface Bloco {
  porLinha: number[]
  reducao: number
  /** Caixa já em coordenadas da arte, depois da redução. */
  caixa: Caixa
  larguraProjeto: number
}

/**
 * Mede o bloco para um limite de colunas. A grade enche o mínimo de linhas e
 * equilibra (7 pessoas viram 4+3); depois o bloco inteiro encolhe para caber.
 */
function medirCom(total: number, maxColunas: number): Bloco {
  const grade = distribuir(total, maxColunas)
  const linhas = grade.porLinha.length
  const larguraProjeto = grade.colunas * PESSOA.largura + (grade.colunas - 1) * PESSOA.gapX
  const temOnda = grade.colunas > 1
  const alturaProjeto =
    linhas * alturaDaPessoa() + (linhas - 1) * PESSOA.gapY + (temOnda ? ONDA : 0)

  const disponivelY = AREA_DAS_PESSOAS.base - AREA_DAS_PESSOAS.topo
  const disponivelX = TAMANHO.largura - MARGEM_LATERAL * 2
  const reducao = Math.min(1, disponivelY / alturaProjeto, disponivelX / larguraProjeto)

  const largura = larguraProjeto * reducao
  const altura = alturaProjeto * reducao
  return {
    porLinha: grade.porLinha,
    reducao,
    larguraProjeto,
    caixa: {
      x: (TAMANHO.largura - largura) / 2,
      y: AREA_DAS_PESSOAS.topo + (disponivelY - altura) / 2,
      largura,
      altura,
    },
  }
}

/**
 * Entre 5 e 9 colunas, fica a distribuição que deixa as fotos maiores. Com
 * poucas pessoas dá uma fileira só; com muitas, mais colunas evitam uma terceira
 * linha que encolheria todo mundo.
 */
function medirBloco(total: number): Bloco {
  let melhor = medirCom(total, 5)
  for (let colunas = 6; colunas <= 9; colunas += 1) {
    const tentativa = medirCom(total, colunas)
    if (tentativa.reducao > melhor.reducao + 0.001) melhor = tentativa
  }
  return melhor
}

function desenharPessoas(
  ctx: CanvasRenderingContext2D,
  pessoas: PessoaNaArte[],
  bloco: Bloco,
  recursos: Recursos,
): void {
  ctx.save()
  ctx.translate(bloco.caixa.x, bloco.caixa.y)
  ctx.scale(bloco.reducao, bloco.reducao)

  let indice = 0
  bloco.porLinha.forEach((nesta, linha) => {
    const larguraDaLinha = nesta * PESSOA.largura + (nesta - 1) * PESSOA.gapX
    const recuo = (bloco.larguraProjeto - larguraDaLinha) / 2
    for (let coluna = 0; coluna < nesta; coluna += 1) {
      // Colunas alternadas descem um pouco: a fileira ondula em vez de virar grade.
      const onda = nesta > 1 && coluna % 2 === 1 ? ONDA : 0
      desenharPessoa(
        ctx,
        recuo + coluna * (PESSOA.largura + PESSOA.gapX),
        linha * (alturaDaPessoa() + PESSOA.gapY) + onda,
        pessoas[indice],
        recursos,
      )
      indice += 1
    }
  })

  ctx.restore()
}

function desenharPessoa(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pessoa: PessoaNaArte,
  recursos: Recursos,
): void {
  const centro = x + PESSOA.largura / 2
  const raioAro = diametroDoAro() / 2
  const cy = y + raioAro

  // Aro no gradiente, com um respiro escuro até a foto.
  const caixaAro = { x: centro - raioAro, y, largura: raioAro * 2, altura: raioAro * 2 }
  ctx.lineWidth = PESSOA.aro
  ctx.strokeStyle = gradiente1(ctx, caixaAro)
  ctx.beginPath()
  ctx.arc(centro, cy, raioAro - PESSOA.aro / 2, 0, Math.PI * 2)
  ctx.stroke()

  const raioFoto = PESSOA.foto / 2
  desenharFoto(ctx, centro, cy, raioFoto, pessoa, recursos)

  // Selo de tempo de casa: pílula no gradiente, texto Beige.
  const texto = tempoDeCasa(pessoa.anos)
  ctx.font = fonteOutfit(PESSOA.selo.tamanho, 600)
  const larguraSelo = ctx.measureText(texto).width + PESSOA.selo.padding * 2
  const selo = {
    x: centro - larguraSelo / 2,
    y: y + raioAro * 2 - PESSOA.selo.altura / 2,
    largura: larguraSelo,
    altura: PESSOA.selo.altura,
  }
  ctx.beginPath()
  ctx.roundRect(selo.x, selo.y, selo.largura, selo.altura, selo.altura / 2)
  ctx.fillStyle = gradiente1(ctx, selo)
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = COR.brown
  ctx.stroke()
  ctx.fillStyle = COR.beige
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(texto, centro, selo.y + selo.altura / 2 + 1)

  // Nome (Outfit semibold, Beige) e setor (Outfit regular, laranja).
  ctx.textBaseline = 'top'
  let yTexto = selo.y + selo.altura + PESSOA.nome.gapAcima
  ctx.font = fonteOutfit(PESSOA.nome.tamanho, 600)
  ctx.fillStyle = COR.beige
  const cabe = (t: string) => ctx.measureText(t).width <= PESSOA.largura
  ctx.fillText(encurtarNome(pessoa.nome, cabe), centro, yTexto)

  yTexto += PESSOA.nome.tamanho * 1.2 + PESSOA.setor.gapAcima
  ctx.font = fonteOutfit(PESSOA.setor.tamanho, 400)
  ctx.fillStyle = COR.laranja
  const cabeSetor = (t: string) => ctx.measureText(t).width <= PESSOA.largura
  ctx.fillText(encurtarSetores(pessoa.setores, cabeSetor), centro, yTexto)
}

function desenharFoto(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  raio: number,
  pessoa: PessoaNaArte,
  recursos: Recursos,
): void {
  const url = pessoa.fotoUrl ? urlDaFotoParaCanvas(pessoa.fotoUrl) : null
  const imagem = url ? recursos.imagens.get(url) : undefined
  const caixa = { x: cx - raio, y: cy - raio, largura: raio * 2, altura: raio * 2 }

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, raio, 0, Math.PI * 2)
  ctx.clip()
  if (imagem) {
    coverEm(ctx, imagem, caixa)
  } else {
    // Sem foto: as mesmas iniciais do card da lista, para a pessoa não sumir.
    ctx.fillStyle = COR.escuro1
    ctx.fillRect(caixa.x, caixa.y, caixa.largura, caixa.altura)
    ctx.fillStyle = COR.beige
    ctx.font = fonteOutfit(raio * 0.7, 600)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(iniciais(pessoa.nome), cx, cy)
  }
  ctx.restore()
}
