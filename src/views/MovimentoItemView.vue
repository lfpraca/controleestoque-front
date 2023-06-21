<script lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { type Movimento } from '@/types'
import router from '@/router'

export default {
  setup() {
    const movimento = ref<Movimento>({
      id: 0,
      produtoId: 0,
      produtoDescricao: '',
      ajuste: 0,
      atual: 0,
      um: '',
      descricao: '',
      sequencia: 0,
      dataLancamento: ''
    })

    const displayError = ref('')
    const tzoffset = new Date().getTimezoneOffset() / 60
    const initialAjuste = ref(0)
    const initialDescricao = ref('')
    const initialDataLancamento = ref('')
    const currentDataLancamento = ref('')

    onMounted(() => {
      const id = Number(router.currentRoute.value.params.id)

      axios
        .get<Movimento>(`http://localhost:5213/movimento/${id}`)
        .then((response) => {
          const data = response.data
          const dataLancamento = new Date(data.dataLancamento)
          dataLancamento.setHours(dataLancamento.getHours() - tzoffset)
          dataLancamento.setMilliseconds(0)
          dataLancamento.setSeconds(0)
          currentDataLancamento.value = dataLancamento.toISOString().slice(0, -1)
          movimento.value = response.data
          initialAjuste.value = data.ajuste
          initialDescricao.value = data.descricao
          initialDataLancamento.value = currentDataLancamento.value
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

    const removerMovimento = () => {
      displayError.value = ''
      const id = Number(router.currentRoute.value.params.id)

      axios
        .delete(`http://localhost:5213/movimento/${id}`)
        .then(() => {
          router.push('/movimento')
        })
        .catch((error) => {
          console.error('Erro ao remover movimento:', error)
          displayError.value = error.response?.data?.Message
            ? error.response.data.Message
            : error.response?.data?.error
            ? error.response.data.error
            : error
        })
    }

    const salvarMovimento = () => {
      displayError.value = ''
      const id = Number(router.currentRoute.value.params.id)
      const { ajuste, descricao } = movimento.value
      const changes: Partial<Movimento> = {}

      if (ajuste !== initialAjuste.value) {
        changes.ajuste = ajuste
      }

      if (descricao !== initialDescricao.value) {
        changes.descricao = descricao
      }

      if (currentDataLancamento.value !== initialDataLancamento.value) {
        const dataLancamentoDate = new Date(currentDataLancamento.value)
        const dataLancamento = dataLancamentoDate.toISOString()
        changes.dataLancamento = dataLancamento
      }

      if (Object.keys(changes).length > 0) {
        axios
          .patch(`http://localhost:5213/movimento/${id}`, changes)
          .then(() => {
            router.push('/movimento')
          })
          .catch((error) => {
            console.error('Erro ao atualizar movimento:', error)
            displayError.value = error.response?.data?.Message
              ? error.response.data.Message
              : error.response?.data?.error
              ? error.response.data.error
              : error
          })
      } else {
        displayError.value = 'Nenhum valor alterado.'
      }
    }

    return {
      movimento,
      removerMovimento,
      salvarMovimento,
      currentDataLancamento,
      displayError
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Movimento</h1>
    <!-- Erro -->
    <div class="alert alert-danger" v-if="displayError">{{ displayError }}</div>

    <!-- Campos -->
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="produtoInput" class="form-label">Produto:</label>
      </div>
      <div class="col-5">
        <input
          type="text"
          id="produtoIdInput"
          class="form-control"
          :value="movimento.produtoId"
          readonly
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2 d-flex align-items-center justify-content-end">
        <label for="sequenciaInput" class="form-label">Sequência:</label>
      </div>
      <div class="col-5">
        <input
          type="text"
          id="sequenciaInput"
          class="form-control"
          :value="movimento.sequencia"
          readonly
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
          v-model="currentDataLancamento"
          :maxlength="40"
        />
      </div>
    </div>

    <!-- Botões -->
    <div class="row">
      <div class="col">
        <button class="btn btn-danger me-2" @click="removerMovimento" v-if="movimento.id !== 0">
          Remover
        </button>
        <button class="btn btn-primary" @click="salvarMovimento" v-if="movimento.id !== 0">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>
