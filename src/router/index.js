// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import LoginPage from '../components/LoginPage.vue'
import MainMenu from '../components/MainMenu.vue'
import ModalHarian from '../components/ModalHarian.vue'
import KelolaModal from '../components/KelolaModal.vue'
import EditModalHarian from '../components/EditModalHarian.vue'
import KebutuhanHarian from '../components/KebutuhanHarian.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/beranda',
    name: 'Beranda',
    component: MainMenu,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/modal-harian',
    name: 'ModalHarian',
    component: ModalHarian,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/kelola-modal',
    name: 'KelolaModal',
    component: KelolaModal,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/modal-harian/:id',
    name: 'EditModalHarian',
    component: EditModalHarian,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/kebutuhan-harian',
    name: 'KebutuhanHarian',
    component: KebutuhanHarian,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    redirect: '/login'
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next({ name: 'Login' });
  } else {
    next();
  }
})

export default router
