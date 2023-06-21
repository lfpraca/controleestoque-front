export interface Produto {
  id: number
  descricao: string
  um: string
}

export interface Movimento {
  id: number
  produtoId: number
  produtoDescricao: string
  ajuste: number
  atual: number
  um: string
  descricao: string
  sequencia: number
  dataLancamento: string
}
