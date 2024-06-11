<template>
    <div class="container">
      <div class="mb-4">
        <h2>Ubah Kebutuhan Harian</h2>
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
  
      <button @click="hitungTotalKebutuhan" class="btn btn-primary">Update Kebutuhan</button>
      <button class="btn btn-secondary" @click="navigateToKelola">Kelola</button>
  
      <div class="hasil mt-4" v-html="hasil"></div>
    </div>
  </template>
  
  <script>
  import { db } from '../../firebase'
  import { doc, collection, updateDoc, getDoc } from 'firebase/firestore'
  import Swal from 'sweetalert2'
  
  export default {
    data() {
      return {
        gaji: 0,
        lainnya: 0,
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
    async mounted() {
      // Mengambil ID dokumen dari parameter rute
      const documentId = this.$route.params.id;
      // Memanggil fungsi untuk mengambil data berdasarkan ID dokumen
      await this.getDataById(documentId);
    },
    methods: {
      async getDataById(id) {
        try {
          // Referensi ke dokumen dalam koleksi 'historyNeeds' dengan ID yang diberikan
          const docRef = doc(db, "historyNeeds", id);
          // Mendapatkan snapshot dokumen
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            // Jika dokumen ada, ambil data dan masukkan ke dalam variabel data komponen
            const data = docSnap.data();
            console.log(data);
  
            // Mengatur data dengan pengecekan tambahan
            this.tanggal = data.tanggal || '';
            this.gaji = data.pemasukan.gaji || 0;
            this.lainnya = data.pemasukan.lainnya || 0;
  
            // Memeriksa apakah 'kebutuhanInfo' ada dan mengandung data kebutuhan
            if (data.kebutuhanInfo) {
              const kebutuhanInfo = data.kebutuhanInfo;
              const lines = kebutuhanInfo.split('<br>');
  
              lines.forEach(line => {
                const match = line.match(/(.+?): (\d+)/);
                if (match) {
                  const [_, kebutuhan, jumlah] = match;
                  if (Object.prototype.hasOwnProperty.call(this.kebutuhanList, kebutuhan)) {
                    this.kebutuhanList[kebutuhan] = parseInt(jumlah);
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
  
          // Menampilkan hasil total kebutuhan
          hasilPerhitungan += `Total Kebutuhan: ${totalKebutuhan}<br>`;
          hasilPerhitungan += `Total Pemasukan: ${this.gaji + this.lainnya}<br>`;
          hasilPerhitungan += `Saldo: ${this.gaji + this.lainnya - totalKebutuhan}`;
  
          // Menampilkan SweetAlert berhasil
          this.showSuccessPopup();
  
          // Mendapatkan tanggal dan waktu saat ini
          const now = new Date();
  
          // Mendapatkan bagian-bagian waktu
          const hours = now.getHours().toString().padStart(2, '0'); // Jam dalam format 2 digit (00-23)
          const minutes = now.getMinutes().toString().padStart(2, '0');         // Menit dalam format 2 digit (00-59)
        const seconds = now.getSeconds().toString().padStart(2, '0'); // Detik dalam format 2 digit (00-59)
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // Milidetik dalam format 3 digit (000-999)

        // Format tanggal dan waktu menjadi string YYYY-MM-DD HH:MM:SS.SSS
        const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${hours}:${minutes}:${seconds}.${milliseconds}`;

        // Data yang akan diperbarui di Firebase Firestore
        const updateData = {
          tanggal: this.tanggal,
          pemasukan: {
            gaji: this.gaji,
            lainnya: this.lainnya
          },
          kebutuhanInfo: hasilPerhitungan,
          timestamp: timestamp
        };

        // Mendapatkan ID dokumen dari parameter rute
        const documentId = this.$route.params.id;

        // Referensi ke dokumen dalam koleksi 'historyNeeds' dengan ID yang diberikan
        const docRef = doc(db, "historyNeeds", documentId);

        // Memperbarui dokumen dengan data yang baru
        await updateDoc(docRef, updateData);

        // Menampilkan SweetAlert berhasil
        this.showSuccessPopup();
      } catch (error) {
        // Menampilkan SweetAlert error
        this.showErrorPopup();
        console.error("Error updating document:", error);
      }
    },

    // Fungsi untuk menampilkan SweetAlert berhasil
    showSuccessPopup() {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Kebutuhan harian berhasil diperbarui.'
      });
    },

    // Fungsi untuk menampilkan SweetAlert error
    showErrorPopup() {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan, silakan coba lagi.'
      });
    },

    // Fungsi untuk navigasi kembali ke halaman Kelola
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

  