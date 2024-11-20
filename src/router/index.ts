import { createRouter, createWebHistory } from 'vue-router'
import TodosView from '../views/TodosView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UsersView from '../views/Admin/UsersView.vue'
import UserTodosView from '../views/Admin/UserTodosView.vue'
import { useAuthStore } from '../stores/auth'

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
    {
      path: '/admin/users',
      name: 'users',
      component: UsersView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true 
      },
    },
    {
      path: '/admin/users/:userId/todos',
      name: 'user-todos',
      component: UserTodosView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true
      },
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthRequired = to.meta.requiresAuth;
  const isAdminRequired = to.meta.requiresAdmin;
  const isLoggedIn = authStore.checkAuth();

  if (isLoggedIn && ['login', 'register'].includes(to.name as string)) {
    return next('/');
  }

  if (isAuthRequired && !isLoggedIn) {
    return next('/login');
  }

  if (isAdminRequired && !authStore.hasRole('ADMIN')) {
    return next('/');
  }

  next();
});


export default router;
