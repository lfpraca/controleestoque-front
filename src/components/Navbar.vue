<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/produto" class="nav-link" :class="{ active: isRouteActive('/produto') }"
            >Produtos</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            to="/movimento"
            class="nav-link"
            :class="{ active: isRouteActive('/movimento') }"
            >Movimentos</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'AppNavbar',
  setup() {
    const route = useRoute()

    const isRouteActive = (path: string) => {
      return route.path === path || route.path.startsWith(path + '/')
    }

    return { isRouteActive }
  }
})
</script>
