<script lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { type Movimento } from '@/types'
import router from '@/router'

export default {
  setup() {
    const displayError = ref('')
    const tzoffset = new Date().getTimezoneOffset() / 60
    const nowDate = new Date()
    nowDate.setHours(nowDate.getHours() - tzoffset)
    nowDate.setMilliseconds(0)
    nowDate.setSeconds(0)
    const now = nowDate.toISOString().slice(0, -1)
    const dataLancamento = ref(now)

    const movimento = ref<Partial<Movimento>>({
      produtoId: 0,
      ajuste: 0,
      descricao: ''
    })

    const salvarMovimento = () => {
      displayError.value = ''
      const dataLancamentoDate = new Date(dataLancamento.value)
      const dataLancamentoAjustada = dataLancamentoDate.toISOString()
      const payload = {
        produtoId: movimento.value.produtoId,
        ajuste: movimento.value.ajuste,
        descricao: movimento.value.descricao,
        dataLancamento: dataLancamentoAjustada
      }

      axios
        .post('http://localhost:5213/movimento', payload)
        .then(() => {
          router.push('/movimento')
        })
        .catch((error) => {
          console.error('Erro ao salvar movimento:', error)
          displayError.value = error.response?.data?.Message
            ? error.response.data.Message
            : error.response?.data?.error
            ? error.response.data.error
            : error
        })
    }

    return {
      movimento,
      salvarMovimento,
      dataLancamento,
      displayError
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Novo Movimento</h1>
    <!-- Erro -->
    <div class="alert alert-danger" v-if="displayError">{{ displayError }}</div>

    <!-- Campos -->
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="produtoInput" class="form-label">Produto Id:</label>
      </div>
      <div class="col-5">
        <input
          type="number"
          id="produtoIdInput"
          class="form-control"
          v-model="movimento.produtoId"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="ajusteInput" class="form-label">Ajuste:</label>
      </div>
      <div class="col-5">
        <input type="number" id="ajusteInput" class="form-control" v-model="movimento.ajuste" />
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
          v-model="movimento.descricao"
          :maxlength="40"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="dataLancamentoInput" class="form-label">Data/Hora:</label>
      </div>
      <div class="col-5">
        <input
          type="datetime-local"
          id="dataLancamentoInput"
          class="form-control"
          v-model="dataLancamento"
        />
      </div>
    </div>

    <!-- Botões -->
    <div class="row">
      <div class="col">
        <button class="btn btn-primary" @click="salvarMovimento">Criar</button>
      </div>
    </div>
  </div>
</template>
