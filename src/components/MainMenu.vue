<template>
    <div class="main-menu">
      <div class="content-wrapper">
        <h1>Selamat Datang di Aplikasi Manajemen Modal</h1>
        <p class="intro-text">Kelola modal harian dan bulanan Anda dengan mudah dan efisien.</p>
        <div class="menu-buttons">
          <button @click="navigateToModalHarian" class="btn btn-primary">Modal Harian</button>
          <button @click="navigateToKelola" class="btn btn-secondary">Kelola</button>
        </div>
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
          this.$router.push({ name: 'ModalHarian' });
        }, 750);
      }
    }
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
    background: white;
    color: rgba(255, 255, 255, 0.1);
    padding: 2rem;
  }
  
  .content-wrapper {
    color: #3f454a;
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
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
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
    transform: scale(1.05);
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
  