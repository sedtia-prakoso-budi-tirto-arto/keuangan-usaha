<template>
  <div class="container">
    <div class="mb-4">
      <h2>Ubah Modal Harian</h2>
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

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="omset" class="form-label">Omset:</label>
          <input type="number" id="omset" v-model="omset" class="form-control">
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="pengeluaran" class="form-label">Pengeluaran:</label>
          <input type="number" id="pengeluaran" v-model="pengeluaran" class="form-control">
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Menu Pancong</h2>
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
      <h2>Topping</h2>
      <div class="row">
        <div class="col-6" v-for="(value, menu) in topping" :key="menu">
          <div class="mb-3">
            <label :for="menu" class="form-label">{{ menu }}:</label>
            <input type="number" :id="menu" v-model="topping[menu]" class="form-control">
          </div>
        </div>
      </div>
    </div>

    <button @click="hitungTotalHarga" class="btn btn-primary">Update Total Modal</button>
    <button class="btn btn-secondary" @click="navigateToKelola">Kelola</button>

    <div class="hasil mt-4" v-html="hasil"></div>
  </div>
</template>

<script>
import { db } from '../../firebase';
import { doc, collection, updateDoc, getDoc, getDocs } from "firebase/firestore";
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      jumlahTelur: 0,
      jumlahPorsi: 0,
      hasil: "",
      omset: 0,
      pengeluaran: 0,
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
    };
  },
  async mounted() {
    // Mengambil ID dokumen dari parameter rute
    const documentId = this.$route.params.id;
    // Memanggil fungsi untuk mengambil data berdasarkan ID dokumen
    await this.getDataById(documentId);
  },
  methods: {
    async getDataById(id) {
      try {
        // Referensi ke dokumen dalam koleksi 'history' dengan ID yang diberikan
        const docRef = doc(db, "history", id);
        // Mendapatkan snapshot dokumen
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Jika dokumen ada, ambil data dan masukkan ke dalam variabel data komponen
          const data = docSnap.data();
          console.log(data);

          // Mengatur data dengan pengecekan tambahan
          this.tanggal = data.tanggal || '';
          this.omset = data.Omset || 0;
          this.pengeluaran = data.Pengeluaran || 0;
          this.jumlahTelur = data.jumlahTelur || 0;
          this.jumlahPorsi = data.jumlahPorsi || 0;
          this.hasil = data.modalInfo || '';

          // Memeriksa apakah 'modalInfo' ada dan mengandung data pancong dan topping
          if (data.modalInfo) {
            const modalInfo = data.modalInfo;
            const lines = modalInfo.split('<br>');

            lines.forEach(line => {
              const match = line.match(/(.+?): \d+ \* (\d+) = \d+/);
              if (match) {
                const [_, key, count] = match;
                if (Object.prototype.hasOwnProperty.call(this.pancong, key)) {
                  this.pancong[key] = parseInt(count);
                }
                if (Object.prototype.hasOwnProperty.call(this.topping, key)) {
                  this.topping[key] = parseInt(count);
                }
              }
            });
          }
        } else {
          // Jika dokumen tidak ditemukan
          this.hasil = "Dokumen tidak ditemukan.";
        }
      } catch (error) {
        // Jika terjadi kesalahan saat mengambil data
        console.error("Error getting document:", error);
        this.hasil = "Terjadi kesalahan saat mengambil data.";
      }
    },

    async hitungTotalHarga() {
      // Validasi input
      if (isNaN(this.jumlahTelur) || this.jumlahTelur <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Isikan jumlah telur.'
      });
      return;
    }
    if (isNaN(this.jumlahPorsi) || this.jumlahPorsi <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Isikan jumlah porsi terjual.'
      });
      return;
    }
    if (isNaN(this.pengeluaran) || this.pengeluaran <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Isikan Pengeluaran.'
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

    totalHarga = totalHarga + totalGlaze + totalAlat + totalTopping;

    // Menampilkan hasil total harga
    hasilPerhitungan += `Total Modal: ${totalHarga} <br>Porsi Terjual: ${this.jumlahPorsi}`;
    this.hasil = hasilPerhitungan;

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

    const documentId = this.$route.params.id;

    // Menampilkan SweetAlert berhasil
    this.showSuccessPopup();

    await updateDoc(doc(db, "history", documentId), {
      date: formattedTime,
      modalInfo: this.hasil,
      jumlahPorsi: this.jumlahPorsi,
      jumlahTelur: this.jumlahTelur,
      Omset: this.omset,
      Pengeluaran: this.pengeluaran,
      tanggal: this.tanggal,
      totalModal: totalHarga
    });
      } catch (error) {
        console.error("Error getting documents: ", error);
        this.hasil = "Terjadi kesalahan saat mengambil data.";
      }
    },
    showSuccessPopup() {
      Swal.fire({
        icon: 'success',
        title: 'Update modal berhasil!',
        showConfirmButton: false,
        timer: 1500
      });
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
            // Mengarahkan ke rute KelolaModal
            this.$router.push({ name: 'KelolaModal' });
        }, 750);
      }
  }
};
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
    margin-left: 0;
    width: 100%;
    padding: 0.5rem;
  }
}
</style>

