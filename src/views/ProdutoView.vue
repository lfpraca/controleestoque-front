<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { type Produto } from '@/types'

export default {
  setup() {
    const produtos = ref<Produto[]>([])
    const router = useRouter()
    const displayError = ref('')

    const searchProdutos = async () => {
      displayError.value = ''
      axios
        .get<Produto[]>('http://localhost:5213/produto')
        .then((response) => {
          produtos.value = response.data
        })
        .catch((error) => {
          console.error('Erro ao buscar produtos:', error)
          displayError.value = error
        })
    }
    const navigateToProduto = (id: number) => {
      router.push(`/produto/${id}`)
    }
    const routeToNovoProduto = () => {
      router.push('/produto/novo')
    }

    searchProdutos()

    return {
      produtos,
      searchProdutos,
      navigateToProduto,
      routeToNovoProduto,
      displayError
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Produto</h1>
    <!-- Erro -->
    <div class="alert alert-danger" v-if="displayError">{{ displayError }}</div>

    <!-- Botões -->
    <div class="row mb-2">
      <div class="col">
        <button class="btn btn-primary me-2" @click="searchProdutos">Pesquisar</button>
        <button class="btn btn-secondary" @click="routeToNovoProduto">Novo</button>
      </div>
    </div>

    <!-- Tabela -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Descricao</th>
          <th scope="col">UM</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="produto in produtos"
          :key="produto.id"
          class="cursor-pointer"
          @click="navigateToProduto(produto.id)"
        >
          <td>{{ produto.id }}</td>
          <td>{{ produto.descricao }}</td>
          <td>{{ produto.um }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
