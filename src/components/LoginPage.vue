<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="form-control">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  mounted() {
    // Periksa apakah pesan selamat datang pernah ditampilkan pada sesi ini
    const welcomeMessageShown = sessionStorage.getItem('welcomeMessageShown');

    // Jika belum pernah ditampilkan pada sesi ini, tampilkan pesan selamat datang
    if (!welcomeMessageShown) {
      Swal.fire({
        title: 'Selamat Datang!',
        text: 'Terima kasih telah menggunakan aplikasi Perhitungan Modal Harian.',
        icon: 'info',
        confirmButtonText: 'OK'
      });

      // Tandai bahwa pesan selamat datang sudah ditampilkan pada sesi ini
      sessionStorage.setItem('welcomeMessageShown', 'true');
    }
  },
  methods: {
    async login() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You will be redirected shortly."
        });
        
        // Tambahkan jeda delay sebelum mengarahkan ke halaman ModalHarian
        setTimeout(() => {
          this.$router.push({ name: "ModalHarian" });
        }, 1500); // 1500ms = 1.5 detik
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message
        });
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

/* Responsiveness */
@media (max-width: 576px) {
  .login-container {
    margin: 50px auto;
    padding: 1rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1.25rem;
  }

  .form-group {
    margin-bottom: 0.75rem;
  }

  .form-control {
    padding: 0.4rem;
    font-size: 0.9rem;
  }

  .btn {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
