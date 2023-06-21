<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { type Produto } from '@/types'
import router from '@/router'

export default {
  setup() {
    const produto = ref<Partial<Produto>>({
      descricao: '',
      um: ''
    })

    const displayError = ref('')
    const estoque = ref('')

    const salvarProduto = () => {
      displayError.value = ''
      const payload = {
        descricao: produto.value.descricao,
        UM: produto.value.um,
        estoqueInicial: Number(estoque.value)
      }

      axios
        .post('http://localhost:5213/produto', payload)
        .then(() => {
          router.push('/produto')
        })
        .catch((error) => {
          console.error('Erro ao salvar produto:', error)
          displayError.value = error.response?.data?.Message
            ? error.response.data.Message
            : error.response?.data?.error
            ? error.response.data.error
            : error
        })
    }

    return {
      produto,
      estoque,
      salvarProduto,
      displayError
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Novo Produto</h1>
    <!-- Erro -->
    <div class="alert alert-danger" v-if="displayError">{{ displayError }}</div>

    <!-- Campos -->
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="descricaoInput" class="form-label">Descrição:</label>
      </div>
      <div class="col-5">
        <input
          type="text"
          id="descricaoInput"
          class="form-control"
          v-model="produto.descricao"
          :maxlength="40"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="umInput" class="form-label">Unidade de Medida:</label>
      </div>
      <div class="col-5">
        <input type="text" id="umInput" class="form-control" v-model="produto.um" :maxlength="5" />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="estoqueInput" class="form-label">Estoque Inicial:</label>
      </div>
      <div class="col-5">
        <input
          type="number"
          id="estoqueInput"
          class="form-control"
          v-model="estoque"
          inputmode="decimal"
        />
      </div>
    </div>

    <!-- Botões -->
    <div class="row">
      <div class="col">
        <button class="btn btn-primary" @click="salvarProduto">Criar</button>
      </div>
    </div>
  </div>
</template>
