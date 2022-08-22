
const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: () => import('pages/LoginPage/index.vue'),
  },
  {
    path: '/user',
    name: 'UserPage',
    component: () => import('pages/UserPage/index.vue'),
  },
  {
    path: '/admin',
    component: () => import('pages/AdminPage/index.vue'),
    children: [
      {
        path: '',
        name: 'AdminPage',
        component: () => import('pages/AdminPage/Overview.vue')
      },
      {
        path: 'filterManage',
        name: 'FilterManage',
        component: () => import('pages/AdminPage/FilterManage.vue')
      },
      {
        path: 'dataManage',
        name: 'DataManage',
        component: () => import('pages/AdminPage/DataManage.vue')
      },
      {
        path: 'userManage',
        name: 'UserManage',
        component: () => import('pages/AdminPage/UserManage.vue')
      },
      {
        path: 'accountManage',
        name: 'AccountManage',
        component: () => import('pages/AdminPage/AccountManage.vue')
      },
    ]
  }
]

export default routes
