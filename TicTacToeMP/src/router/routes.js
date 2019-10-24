
const routes = [
  {
    path: '/',
    component: () => import('layouts/TicTacToe/Login.vue'),
    children: [
      // { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/game',
    component: () => import('layouts/TicTacToe/Game.vue'),
    children: [
      // { path: '', component: () => import('pages/Index.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
