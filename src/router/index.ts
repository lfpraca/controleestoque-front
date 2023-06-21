import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/produto',
      name: 'produto',
      component: () => import('../views/ProdutoView.vue')
    },
    {
      path: '/produto/:id',
      name: 'produtoItem',
      component: () => import('../views/ProdutoItemView.vue')
    },
    {
      path: '/produto/novo',
      name: 'produtoNovo',
      component: () => import('../views/ProdutoNovoView.vue')
    },
    {
      path: '/movimento',
      name: 'movimento',
      component: () => import('../views/MovimentoView.vue')
    },
    {
      path: '/movimento/:id',
      name: 'movimentoItem',
      component: () => import('../views/MovimentoItemView.vue')
    },
    {
      path: '/movimento/novo',
      name: 'movimentoNovo',
      component: () => import('../views/MovimentoNovoView.vue')
    }
  ]
})

export default router
