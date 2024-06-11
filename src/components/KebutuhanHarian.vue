<template>
    <div class="container">
      <div class="mb-4">
        <h2>Perhitungan Kebutuhan Harian</h2>
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
  
      <!-- Input untuk Pemasukan -->
      <div class="mb-4">
        <h2>Pemasukan</h2><br>
        <div class="row">
          <div class="col-6 mb-3">
            <label for="gaji" class="form-label">Gaji:</label>
            <input type="number" id="gaji" v-model="gaji" class="form-control">
          </div>
          <div class="col-6 mb-3">
            <label for="lainnya" class="form-label">Lainnya:</label>
            <input type="number" id="lainnya" v-model="lainnya" class="form-control">
          </div>
        </div>
      </div>
  
      <!-- Input untuk Kebutuhan -->
      <div class="mb-4">
        <h2>Kebutuhan</h2><br>
        <div class="row">
          <div class="col-6" v-for="(value, kebutuhan) in kebutuhanList" :key="kebutuhan">
            <div class="mb-3">
              <label :for="kebutuhan" class="form-label">{{ kebutuhan }}:</label>
              <input type="number" :id="kebutuhan" v-model="kebutuhanList[kebutuhan]" class="form-control">
            </div>
          </div>
        </div>
      </div>
  
      <button @click="hitungTotalKebutuhan" class="btn btn-primary">Hitung Total Kebutuhan</button>
      <button class="btn btn-secondary" @click="navigateToKelola">Kelola</button>
  
      <div class="hasil mt-4" v-html="hasil"></div>
    </div>
  </template>
  
  
  <script>
  import { db } from '../../firebase'
  import { collection, addDoc } from 'firebase/firestore'
  import Swal from 'sweetalert2'
  
  export default {
    data() {
      return {
        gaji: 0,
        lainnya:0,
        hasil: "",
        tanggal: '',
        kebutuhanList: {
          MakanMinum: 0,
          Skincare: 0,
          Mandi: 0,
          Jajan: 0,
          Bensin: 0,
          Kos: 0,
          Kuota: 0,
          Listrik: 0,
          Laundry: 0,
          PerawatanMotor: 0,
          Kesehatan: 0,
          Darurat: 0
        }
      }
    },
    methods: {
      async hitungTotalKebutuhan() {
        // Validasi input
        if (isNaN(this.gaji) || this.gaji <= 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Isikan jumlah gaji.'
          });
          return;
        }
  
        try {
          // Inisialisasi total kebutuhan
        let saldo = 0;
        let totalPemasukan = this.gaji + this.lainnya;
        let totalKebutuhan = 0;
        let hasilPerhitungan = '';
  
          // Iterasi setiap kebutuhan
          for (const [kebutuhan, jumlah] of Object.entries(this.kebutuhanList)) {
            if (!isNaN(jumlah) && jumlah > 0) {
              // Menambahkan ke total kebutuhan
              totalKebutuhan += jumlah;
              hasilPerhitungan += `${kebutuhan}: ${jumlah}<br>`;
            }
          }
  
        //   totalKebutuhan += this.gaji;
  
          // Menampilkan hasil total kebutuhan
            hasilPerhitungan += `Total Kebutuhan: ${totalKebutuhan}<br>`;
            hasilPerhitungan += `Total Pemasukan: ${totalPemasukan}<br>`;
            saldo = totalPemasukan - totalKebutuhan;
            hasilPerhitungan += `Saldo: ${saldo}`;
  
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
  
          // Menampilkan hasil total kebutuhan
          this.hasil = hasilPerhitungan;
  
          // Menampilkan SweetAlert berhasil
          this.showSuccessPopup();
  
          // Simpan hasil perhitungan ke Firestore
        const docRef = await addDoc(collection(db, "historyNeeds"), {
          date: formattedTime,
          kebutuhanInfo: this.hasil,
          pemasukan: {
            gaji: this.gaji,
            lainnya: this.lainnya
          },
          totalPemasukan: totalPemasukan,
          totalKebutuhan: totalKebutuhan,
          saldo: saldo,
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
          title: 'Perhitungan kebutuhan berhasil!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      navigateToKelola() {
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
          // Mengarahkan ke rute KelolaKebutuhan
          this.$router.push({ name: 'KelolaKebutuhanHarian' });
        }, 750);
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
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
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
  h2 {
    font-size: 1.25rem;
  }
  button {
    margin-left: 0;
    width: 100%;
    padding: 0.5rem;
  }
}
</style>
