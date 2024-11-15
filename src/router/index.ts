import { createRouter, createWebHistory } from 'vue-router'
import TodosView from '../views/TodosView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todos',
      component: TodosView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthRequired = to.meta.requiresAuth;
  const isLoggedIn = authStore.checkAuth();

  if (isLoggedIn && ['login', 'register'].includes(to.name as string)) {
    return next('/');
  }

  if (isAuthRequired && !isLoggedIn) {
    return next('/login');
  }

  next();
});


export default router;
