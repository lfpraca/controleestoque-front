<script lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { type Movimento } from '@/types'

export default {
  setup() {
    const displayError = ref('')
    const movimentos = ref<Movimento[]>([])
    const router = useRouter()

    const formatDecimal = (value: number) => {
      const formattedValue = value.toFixed(3)
      const decimalSeparatorIndex = formattedValue.indexOf('.')
      let endIndex = formattedValue.length - 1

      while (
        (formattedValue[endIndex] === '0' || formattedValue[endIndex] === '.') &&
        endIndex >= decimalSeparatorIndex
      ) {
        endIndex--
      }

      return formattedValue.slice(0, endIndex + 1)
    }

    const formatLocalDatetime = (datetime: string) => {
      const localDatetime = new Date(datetime)
      return localDatetime.toLocaleString()
    }

    const dataInicio = ref('')
    const dataFim = ref('')
    const produtoId = ref(null)

    const searchMovimentos = async () => {
      displayError.value = ''
      const params = {
        ProdutoId: produtoId.value,
        DataInicio: dataInicio.value ? `${dataInicio.value}T12:00:00Z` : null,
        DataFim: dataFim.value ? `${dataFim.value}T12:00:00Z` : null
      }

      axios
        .get<Movimento[]>('http://localhost:5213/movimento', { params })
        .then((response) => {
          movimentos.value = response.data
        })
        .catch((error) => {
          console.error('Erro ao buscar movimentos:', error)
          displayError.value = error.response?.data?.Message
            ? error.response.data.Message
            : error.response?.data?.error
            ? error.response.data.error
            : error
        })
    }

    const navigateToMovimento = (id: number) => {
      router.push(`/movimento/${id}`)
    }

    const routeToNovoMovimento = () => {
      router.push('/movimento/novo')
    }

    onMounted(() => {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const formattedDate = firstDayOfMonth.toISOString().split('T')[0]
      dataInicio.value = formattedDate
      searchMovimentos()
    })

    return {
      movimentos,
      formatDecimal,
      formatLocalDatetime,
      dataInicio,
      dataFim,
      produtoId,
      searchMovimentos,
      navigateToMovimento,
      routeToNovoMovimento,
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

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col">
        <label for="produtoIdInput" class="form-label">Produto ID:</label>
        <input type="number" id="produtoIdInput" class="form-control" v-model="produtoId" />
      </div>
      <div class="col">
        <label for="dataInicioInput" class="form-label">Data Início:</label>
        <input type="date" id="dataInicioInput" class="form-control" v-model="dataInicio" />
      </div>
      <div class="col">
        <label for="dataFimInput" class="form-label">Data Fim:</label>
        <input type="date" id="dataFimInput" class="form-control" v-model="dataFim" />
      </div>
    </div>

    <!-- Botões -->
    <div class="row mb-2">
      <div class="col">
        <button class="btn btn-primary me-2" @click="searchMovimentos">Pesquisar</button>
        <button class="btn btn-secondary" @click="routeToNovoMovimento">Novo</button>
      </div>
    </div>

    <!-- Tabela -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Produto</th>
          <th scopde="col">Ajuste</th>
          <th scopde="col">Atual</th>
          <th scope="col">Descricao</th>
          <th scope="col">Sequencia</th>
          <th scope="col">Data/Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="movimento in movimentos"
          :key="movimento.id"
          class="cursor-pointer"
          @click="navigateToMovimento(movimento.id)"
        >
          <td>{{ movimento.produtoId }} - {{ movimento.produtoDescricao }}</td>
          <td>{{ formatDecimal(movimento.ajuste) }} {{ movimento.um }}</td>
          <td>{{ formatDecimal(movimento.atual) }} {{ movimento.um }}</td>
          <td>{{ movimento.descricao }}</td>
          <td>{{ movimento.sequencia }}</td>
          <td>{{ formatLocalDatetime(movimento.dataLancamento) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
