<!-- <script setup lang="ts"> -->
<!-- import { RouterLink, RouterView } from 'vue-router' -->
<!-- import HelloWorld from './components/HelloWorld.vue' -->
<!-- </script> -->

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar
  }
})
</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<style scoped></style>
