<script lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { type Produto } from '@/types'
import router from '@/router'

export default {
  setup() {
    const produto = ref<Produto>({
      id: 0,
      descricao: '',
      um: ''
    })

    const displayError = ref('')
    const initialDescricao = ref('')
    const initialUM = ref('')

    onMounted(() => {
      const id = Number(router.currentRoute.value.params.id)

      axios
        .get<Produto>(`http://localhost:5213/produto/${id}`)
        .then((response) => {
          const data = response.data
          produto.value = response.data
          initialDescricao.value = data.descricao
          initialUM.value = data.um
        })
        .catch((error) => {
          console.error('Erro ao buscar produto:', error)
          displayError.value = error.response?.data?.Message
            ? error.response.data.Message
            : error.response?.data?.error
            ? error.response.data.error
            : error
        })
    })

    const removerProduto = () => {
      displayError.value = ''
      const id = Number(router.currentRoute.value.params.id)

      axios
        .delete(`http://localhost:5213/produto/${id}`)
        .then(() => {
          router.push('/produto')
        })
        .catch((error) => {
          console.error('Erro ao remover produto:', error)
          displayError.value = error.response?.data?.Message
            ? error.response.data.Message
            : error.response?.data?.error
            ? error.response.data.error
            : error
        })
    }

    const salvarProduto = () => {
      displayError.value = ''
      const id = Number(router.currentRoute.value.params.id)
      const { descricao, um } = produto.value
      const changes: Partial<Produto> = {}

      if (descricao !== initialDescricao.value) {
        changes.descricao = descricao
      }

      if (um !== initialUM.value) {
        changes.um = um
      }

      if (Object.keys(changes).length > 0) {
        axios
          .patch(`http://localhost:5213/produto/${id}`, changes)
          .then(() => {
            router.push('/produto')
          })
          .catch((error) => {
            console.error('Erro ao atualizar produto:', error)
            displayError.value = error.response?.data?.Message
              ? error.response.data.Message
              : error.response?.data?.error
              ? error.response.data.error
              : error
          })
      }
    }

    return {
      produto,
      removerProduto,
      salvarProduto,
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

    <!-- Campos -->
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="idInput" class="form-label">Id:</label>
      </div>
      <div class="col-5">
        <input type="text" id="idInput" class="form-control" :value="produto.id" readonly />
      </div>
    </div>
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

    <!-- Botões -->
    <div class="row">
      <div class="col">
        <button class="btn btn-danger me-2" @click="removerProduto" v-if="produto.id !== 0">
          Remover
        </button>
        <button class="btn btn-primary" @click="salvarProduto" v-if="produto.id !== 0">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
