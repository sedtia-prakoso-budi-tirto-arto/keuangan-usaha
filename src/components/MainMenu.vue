<template>
    <div class="main-menu">
      <div class="content-wrapper">
        <h1>Selamat Datang di Aplikasi Manajemen Finansial</h1>
        <p class="intro-text">Kelola modal bisnis dan keuangan pribadi Anda dengan mudah dan efisien.</p>
        <div class="menu-buttons">
          <button @click="navigateToModalHarian" class="btn btn-primary"><i class="fas fa-coins"></i> Modal Harian</button>
          <button @click="navigateToKelola" class="btn btn-primary"><i class="fas fa-chart-line"></i> Kelola Modal</button>
          <button @click="navigateToKebutuhanHarian" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Kebutuhan Harian</button>
          <button @click="navigateToKelolaKebutuhanHarian" class="btn btn-primary"><i class="fas fa-tasks"></i> Kelola Kebutuhan Harian</button>
        </div>
        <div v-if="isLoggedIn">
          <p>Sedang login sebagai: <br> {{ currentUser.email }} <br></p>
          <button @click="logout" class="out btn btn-primary">Logout</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2'
  import { getAuth, signOut } from 'firebase/auth'
  
  export default {
    data() {
      return {
        isLoggedIn: false,
        currentUser: null
      }
    },
    mounted() {
      const auth = getAuth()
      auth.onAuthStateChanged(user => {
        if (user) {
          this.isLoggedIn = true
          this.currentUser = user
        } else {
          this.isLoggedIn = false
          this.currentUser = null
        }
      })
    },
    methods: {
      navigateToModalHarian() {
        Swal.fire({
          title: 'Memuat Modal Harian...',
          text: 'Silakan tunggu',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        setTimeout(() => {
          Swal.close();
          this.$router.push({ name: 'ModalHarian' });
        }, 750);
      },
      navigateToKelola() {
        Swal.fire({
          title: 'Memuat Kelola...',
          text: 'Silakan tunggu',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        setTimeout(() => {
          Swal.close();
          this.$router.push({ name: 'KelolaModal' });
        }, 750);
      },
      navigateToKebutuhanHarian() {
        Swal.fire({
          title: 'Memuat Kebutuhan Harian...',
          text: 'Silakan tunggu',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        setTimeout(() => {
          Swal.close();
          this.$router.push({ name: 'KebutuhanHarian' });
        }, 750);
      },
      navigateToKelolaKebutuhanHarian() {
        Swal.fire({
          title: 'Memuat Kelola Kebutuhan Harian...',
          text: 'Silakan tunggu',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        setTimeout(() => {
          Swal.close();
          this.$router.push({ name: 'KelolaKebutuhanHarian' });
        }, 750);
      },
      logout() {
        const auth = getAuth()
        signOut(auth).then(() => {
          // Reset status login dan informasi pengguna
          this.isLoggedIn = false
          this.currentUser = null
          localStorage.removeItem('isLoggedIn') // Hapus status login dari localStorage
          this.$router.push({ name: 'Login' }) // Arahkan ke halaman login setelah logout
        }).catch(error => {
          console.error("Logout failed:", error)
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .main-menu {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background: white;
    color: #3f454a;
    padding: 1rem;
  }
  
  .content-wrapper {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .fas {
    margin-right: 0.5rem;
  }
  
  .intro-text {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .menu-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    margin: 1rem 0;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  .out{
    margin-top: 1rem;
  }
  
  /* Media Queries for Responsiveness */
  @media (max-width: 768px) {
    .content-wrapper {
      padding: 0.5rem;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    .intro-text {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
  
    .btn {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      height: 4rem;
      margin-top: -0.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .content-wrapper {
      padding: 0.5rem;
    }
  
    h1 {
      font-size: 1.5rem;
    }
  
    .intro-text {
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
  
    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
  </style>
  