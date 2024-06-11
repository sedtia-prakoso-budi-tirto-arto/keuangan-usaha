<template>
    <div class="main-menu">
      <div class="content-wrapper">
        <h1>Selamat Datang di Aplikasi Manajemen Modal</h1>
        <p class="intro-text">Kelola modal harian dan bulanan Anda dengan mudah dan efisien.</p>
        <div class="menu-buttons">
          <button @click="navigateToModalHarian" class="btn btn-primary"><i class="fas fa-coins"></i> Modal Harian</button>
          <button @click="navigateToKelola" class="btn btn-primary"><i class="fas fa-chart-line"></i> Kelola Modal</button>
          <button @click="navigateToKebutuhanHarian" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Kebutuhan Harian</button>
          <button @click="navigateToKelolaKebutuhanHarian" class="btn btn-primary"><i class="fas fa-tasks"></i> Kelola Kebutuhan Harian</button>
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
    color: #3f454a;
    padding: 2rem;
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
  
  .fas{
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
  </style>
  