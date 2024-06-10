<template>
  <div class="container">
    <div class="mb-4">
      <h2>Perhitungan Modal Harian</h2>
    </div>

    <!-- Tambahkan input tanggal dengan gaya -->
    <div class="mb-3">
      <label for="tanggal" class="form-label">Tanggal:</label>
      <div class="input-group">
        <input type="date" id="tanggal" v-model="tanggal" class="form-control">
        <span class="input-group-text">
          <i class="fas fa-calendar-alt"></i>
        </span>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="jumlahTelur" class="form-label">Jumlah Telur:</label>
          <input type="number" id="jumlahTelur" v-model="jumlahTelur" class="form-control">
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="jumlahPorsi" class="form-label">Jumlah Porsi:</label>
          <input type="number" id="jumlahPorsi" v-model="jumlahPorsi" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="omset" class="form-label">Omset:</label>
      <input type="number" id="omset" v-model="omset" class="form-control">
    </div>

    <div class="mb-4">
      <h2>Menu Pancong</h2><br>
      <div class="row">
        <div class="col-6" v-for="(value, menu) in pancong" :key="menu">
          <div class="mb-3">
            <label :for="menu" class="form-label">{{ menu }}:</label>
            <input type="number" :id="menu" v-model="pancong[menu]" class="form-control">
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Topping</h2><br>
      <div class="row">
        <div class="col-6" v-for="(value, menu) in topping" :key="menu">
          <div class="mb-3">
            <label :for="menu" class="form-label">{{ menu }}:</label>
            <input type="number" :id="menu" v-model="topping[menu]" class="form-control">
          </div>
        </div>
      </div>
    </div>

    <button @click="hitungTotalHarga" class="btn btn-primary">Hitung Total Modal</button>
    <button class="btn btn-secondary" @click="navigateToKelola">Kelola</button>

    <div class="hasil mt-4" v-html="hasil"></div>
  </div>
</template>


<script>
import { db } from '../../firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      jumlahTelur: 0,
      jumlahPorsi: 0,
      hasil: "",
      omset: 0,
      tanggal: '',
      dataList: [],
      pancong: {
        Tiramisu: 0,
        Cappucino: 0,
        Coklat: 0,
        Chococrunchy: 0,
        Meses_Susu: 0,
        Keju_Susu: 0,
        Strawberry: 0,
        Greentea: 0,
        Cheese: 0,
        Redvelvet: 0,
        Taro: 0,
        Milky: 0
      },
      topping: {
        Meses: 0,
        Oreo: 0,
        Keju: 0,
        Red: 0,
        Matcha: 0,
        Chocochips: 0,
        Kacang: 0
      }
    }
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
    async hitungTotalHarga() {
      // Validasi input
    if (isNaN(this.jumlahTelur) || this.jumlahTelur <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Jumlah telur harus angka positif.'
      });
      return;
    }
    if (isNaN(this.jumlahPorsi) || this.jumlahPorsi <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Jumlah porsi harus angka positif.'
      });
      return;
    }
    if (isNaN(this.omset) || this.omset <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Omset harus angka positif.'
      });
      return;
    }

      // Fungsi untuk mendapatkan harga bahan tertentu dari data dokumen
      const getHargaBahan = (data, bahan) => {
        return data[bahan] || null; // Mengembalikan harga bahan atau null jika bahan tidak ada
      };

      try {
        // Mendapatkan snapshot dokumen dari koleksi "modal"
        const querySnapshot = await getDocs(collection(db, "modal"));

        // Inisialisasi total harga
        let totalGlaze = 0;
        let totalTopping = 0;
        let totalAlat = 0;
        let totalHarga = 0;
        let hasilPerhitungan = '';

        // Iterasi setiap dokumen dalam snapshot
        querySnapshot.forEach((doc) => {
          // Mendapatkan data dokumen
          const data = doc.data();

          // Mendapatkan harga telur
          const hargaTelur = getHargaBahan(data, "telur");

          if (hargaTelur !== null) {
            // Iterasi setiap bahan dalam data dokumen
            for (const [bahan, harga] of Object.entries(data)) {
              if (harga && !isNaN(harga)) {
                // Menghitung total harga setiap bahan dikali jumlah telur
                const totalHargaBahan = harga * this.jumlahTelur;
                hasilPerhitungan += `${bahan}: ${harga} * ${this.jumlahTelur} = ${totalHargaBahan}<br>`;
                // Menambahkan ke total harga
                totalHarga += totalHargaBahan;
              }
            }
          }

          const alat =["foam", "sendok"];
          const glaze = ["Tiramisu", "Cappucino", "Coklat", "Chococrunchy", "Meses Susu", "Keju Susu", "Strawberry", "Greentea", "Cheese", "Redvelvet", "Taro", "Milky"];
          const topping = ["Meses", "Oreo", "Kacang", "Red Crumble", "Matcha Crumble", "Chocochips", "Keju"];

          glaze.forEach(nama => {
            const harga = getHargaBahan(data, nama);
            const jumlah = this.pancong[nama] || 0;

            if (harga !== null && jumlah > 0) {
              const Glaze = harga * jumlah;
              hasilPerhitungan += `${nama}: ${harga} * ${jumlah} = ${Glaze}<br>`;
              totalGlaze += Glaze;
            }
          });

          topping.forEach(nama => {
            const harga = getHargaBahan(data, nama);
            const jumlah = this.topping[nama] || 0;

            if (harga !== null && jumlah > 0) {
              const Topping = harga * jumlah;
              hasilPerhitungan += `${nama}: ${harga} * ${jumlah} = ${Topping}<br>`;
              totalTopping += Topping;
            }
          });

          alat.forEach(nama => {
            const harga = getHargaBahan(data, nama);
            if (harga !== null && this.jumlahPorsi > 0) {
              const Alat = harga * this.jumlahPorsi;
              hasilPerhitungan += `${nama}: ${harga} * ${this.jumlahPorsi} = ${Alat}<br>`;
              totalAlat += Alat;
            }
          });
        });

        totalHarga = totalHarga + totalGlaze + totalAlat + totalTopping + 27000;

        // Menampilkan hasil total harga
        hasilPerhitungan += `Total Modal: ${totalHarga} <br>Porsi Terjual: ${this.jumlahPorsi}`;
        this.hasil = hasilPerhitungan;

        // Menampilkan SweetAlert berhasil
        this.showSuccessPopup();

        // Mendapatkan tanggal dan waktu saat ini
        const now = new Date();

        // Mendapatkan bagian-bagian waktu
        const hours = now.getHours().toString().padStart(2, '0'); // Jam dalam format 2 digit (00-23)
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Menit dalam format 2 digit (00-59)
        const seconds = now.getSeconds().toString().padStart(2, '0'); // Detik dalam format 2 digit (00-59)
        const day = now.getDate().toString().padStart(2, '0'); // Hari dalam format 2 digit (01-31)
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Bulan dalam format 2 digit (01-12), perlu ditambah 1 karena Januari dimulai dari 0
        const year = now.getFullYear(); // Tahun dalam format 4 digit (misalnya: 2024)

        // Format waktu sesuai dengan format yang diinginkan
        const formattedTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

        // Menampilkan hasil total harga
        // hasilPerhitungan += `Total Modal: ${totalHarga} <br>Porsi Terjual: ${this.jumlahPorsi}`;
        this.hasil = hasilPerhitungan;

        // Menampilkan SweetAlert berhasil
        this.showSuccessPopup();

        // Simpan hasil perhitungan ke Firestore
        const docRef = await addDoc(collection(db, "history"), {
          date: formattedTime,
          modalInfo: this.hasil,
          jumlahTelur: this.jumlahTelur,
          jumlahPorsi: this.jumlahPorsi,
          totalModal: totalHarga,
          Omset: this.omset,
          tanggal: this.tanggal
        });

        // Log ID dokumen baru yang dibuat
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error getting documents: ", error);
        this.hasil = "Terjadi kesalahan saat mengambil data.";
      }
    },
    showSuccessPopup() {
      Swal.fire({
        icon: 'success',
        title: 'Perhitungan modal berhasil!',
        showConfirmButton: false,
        timer: 1500
      });
    },
    navigateToKelola() {
      // Mengarahkan ke rute KelolaModal
      this.$router.push({ name: 'KelolaModal' });
    }
  }
}
</script>

<style scoped>
/* Container styling */
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Heading styling */
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

/* Flexbox container for inputs */
.input-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Flexbox container for menu inputs */
.menu-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1rem;
}

/* Label styling */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

/* Gaya baru untuk tombol kontainer */
.button-container {
  display: flex;
  justify-content: center; /* Membuat tombol berada di tengah */
  margin-top: 1rem; /* Spasi atas agar tidak terlalu dekat dengan hasil */
}

/* Input styling */
.input-group, .menu-group {
  margin-bottom: 1rem;
  flex-basis: calc(50% - 10px); /* Two items per row */
}
.input-group label, .menu-group label {
  display: inline-block;
  width: auto;
  text-align: left;
}
.input-group input[type="number"], .menu-group input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* Gaya tambahan untuk input tanggal */
.date-input {
  position: relative;
  width: 100%;
}

.date-input-field {
  width: calc(100% - 30px);
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.date-input-icon {
  position: relative;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
}

/* Saat hover, warna ikon akan menjadi lebih terang */
.date-input:hover .date-input-icon {
  color: #555;
}

/* Button styling */
button {
  margin-left: 1rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Result styling */
.hasil {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #e9ecef;
  border-radius: 5px;
  text-align: left;
  color: #333;
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .input-group, .menu-group {
    flex-basis: calc(100% - 10px); /* Single item per row */
  }
  h1 {
    font-size: 1.25rem;
  }
  button {
    margin-left: -1rem;
    width: 100%;
    padding: 0.5rem;
  }
}
</style>

