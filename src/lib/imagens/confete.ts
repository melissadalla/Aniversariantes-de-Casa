import type { Caixa } from '@/lib/imagens/tipos'

/**
 * Confete discreto nas cores da marca (Identidade Visual SplitC), compartilhado
 * pelas artes de aniversário. Só cai nas áreas livres: nunca sobre o que a arte
 * declara como ocupado (título, pessoas, cartão, logo).
 */

const CORES = {
  beige: '#fff7f0',
  laranja: '#f87f06',
  intenso: '#f75405',
  amarelo: '#f7a205',
  coral: '#ff5e69',
}

export interface OpcoesDeConfete {
  largura: number
  altura: number
  /** Mesma semente, mesmo confete: a arte sai igual toda vez que é gerada. */
  semente: number
  ocupadas: Caixa[]
  quantidade: number
  /** Tamanho das peças em relação à arte de 1920px. */
  escala?: number
  /** Distância mínima entre uma peça e uma área ocupada. */
  folga?: number
  margem?: number
}

/** PRNG pequeno e determinístico (mulberry32). */
export function sementeira(semente: number): () => number {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Semente estável a partir de um texto (ex.: o nome da pessoa). */
export function sementeDeTexto(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function dentro(px: number, py: number, caixa: Caixa, folga: number): boolean {
  return (
    px > caixa.x - folga &&
    px < caixa.x + caixa.largura + folga &&
    py > caixa.y - folga &&
    py < caixa.y + caixa.altura + folga
  )
}

export function desenharConfete(ctx: CanvasRenderingContext2D, opcoes: OpcoesDeConfete): void {
  const { largura, altura, ocupadas, quantidade } = opcoes
  const base = opcoes.escala ?? 1
  const folga = opcoes.folga ?? 44
  const margem = opcoes.margem ?? 36
  const aleatorio = sementeira(opcoes.semente)
  const cores = [CORES.amarelo, CORES.laranja, CORES.intenso, CORES.coral, CORES.beige]
  let colocados = 0

  ctx.save()
  for (let tentativa = 0; tentativa < quantidade * 20 && colocados < quantidade; tentativa += 1) {
    const px = margem + aleatorio() * (largura - margem * 2)
    const py = margem + aleatorio() * (altura - margem * 2)
    if (ocupadas.some((caixa) => dentro(px, py, caixa, folga))) continue

    const cor = cores[Math.floor(aleatorio() * cores.length)]
    const tipo = aleatorio()
    const escala = (0.7 + aleatorio() * 0.7) * base
    ctx.globalAlpha = (cor === CORES.beige ? 0.35 : 0.55) + aleatorio() * 0.35
    ctx.save()
    ctx.translate(px, py)
    ctx.rotate(aleatorio() * Math.PI * 2)

    if (tipo < 0.45) {
      // Tira de papel.
      ctx.fillStyle = cor
      ctx.beginPath()
      ctx.roundRect(-3 * escala, -10 * escala, 6 * escala, 20 * escala, 2)
      ctx.fill()
    } else if (tipo < 0.7) {
      // Bolinha.
      ctx.fillStyle = cor
      ctx.beginPath()
      ctx.arc(0, 0, 4.5 * escala, 0, Math.PI * 2)
      ctx.fill()
    } else if (tipo < 0.85) {
      // Anel em traço fino.
      ctx.strokeStyle = cor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, 7 * escala, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      // Serpentina curta.
      ctx.strokeStyle = cor
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(-14 * escala, 0)
      ctx.bezierCurveTo(-7 * escala, -9 * escala, 0, 9 * escala, 7 * escala, 0)
      ctx.bezierCurveTo(10 * escala, -5 * escala, 13 * escala, -4 * escala, 15 * escala, 0)
      ctx.stroke()
    }
    ctx.restore()
    colocados += 1
  }
  ctx.restore()
}
