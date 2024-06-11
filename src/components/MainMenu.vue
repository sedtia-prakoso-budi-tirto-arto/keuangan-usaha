<template>
    <div class="main-menu">
      <h1>Selamat Datang di Aplikasi Manajemen Modal</h1>
      <div class="menu-buttons">
        <button @click="navigateToModalHarian" class="btn btn-primary">Modal Harian</button>
        <button @click="navigateToKelola" class="btn btn-secondary">Kelola</button>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2'
  export default {
    methods: {
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
            // Mengarahkan ke rute KelolaModal
            this.$router.push({ name: 'KelolaModal' });
        }, 750);
      },
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
            // Mengarahkan ke rute KelolaModal
            this.$router.push({ name: 'ModalHarian' });
        }, 750);
      }
    },
    
  };
  </script>
  
  <style scoped>
  .main-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    color: white;
  }
  
  h1 {
    font-size: 2.5rem;
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
    transition: background-color 0.3s ease;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  /* Responsive design */
  @media (max-width: 576px) {
    h1 {
      font-size: 2rem;
    }
  
    .btn {
      width: 80%;
      font-size: 1rem;
    }
  }
  </style>
  