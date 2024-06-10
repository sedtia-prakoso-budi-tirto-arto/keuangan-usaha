// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ModalHarian from '../components/ModalHarian.vue'
import KelolaModal from '../components/KelolaModal.vue'
import EditModalHarian from '../components/EditModalHarian.vue'

const routes = [
  {
    path: '/',
    name: 'ModalHarian',
    component: ModalHarian
  },
  {
    path: '/kelola-modal',
    name: 'KelolaModal',
    component: KelolaModal
  },
  {
    path: '/modal-harian/:id',
    name: 'EditModalHarian',
    component: EditModalHarian
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
