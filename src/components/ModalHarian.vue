<template>
  <div class="container">
    <h1>Perhitungan Modal Harian</h1>

    <div class="input-container">
      <div class="input-group">
        <label for="jumlahTelur">Jumlah Telur:</label>
        <input type="number" id="jumlahTelur" v-model="jumlahTelur">
      </div>

      <div class="input-group">
        <label for="jumlahPorsi">Jumlah Porsi:</label>
        <input type="number" id="jumlahPorsi" v-model="jumlahPorsi">
      </div>
      
      <div class="input-group">
        <label for="omset">Omset:</label>
        <input type="number" id="omset" v-model="omset">
      </div>
    </div>

    <div class="menu-container">
      <div class="menu-group" v-for="(value, menu) in pancong" :key="menu">
        <label :for="menu">{{ menu }}:</label>
        <input type="number" :id="menu" v-model="pancong[menu]">
      </div>
      <div class="menu-group" v-for="(value, menu) in topping" :key="menu">
        <label :for="menu">{{ menu }}:</label>
        <input type="number" :id="menu" v-model="topping[menu]">
      </div>
    </div>
    
    <button @click="hitungTotalHarga">Hitung Total Modal</button>
    <button @click="navigateToKelola" style="margin-left: 10px;">Kelola</button>
    
    <div class="hasil" v-html="hasil"></div>
  </div>
</template>

<script>
import { db } from '../../firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export default {
  data() {
    return {
      jumlahTelur: 0,
      jumlahPorsi: 0,
      hasil: "",
      omset: 0,
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
  },
  methods: {
  async hitungTotalHarga() {
  // Validasi input
  if (isNaN(this.jumlahTelur) || this.jumlahTelur <= 0) {
    this.hasil = "Jumlah telur harus angka positif.";
    return;
  }
  if (isNaN(this.jumlahPorsi) || this.jumlahPorsi <= 0) {
    this.hasil = "Jumlah porsi harus angka positif.";
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

    console.log(formattedTime);

    // Simpan hasil perhitungan ke Firestore
      const docRef = await addDoc(collection(db, "history"), {
      date: formattedTime,
      modalInfo: this.hasil,
      jumlahTelur: this.jumlahTelur,
      jumlahPorsi: this.jumlahPorsi,
      totalModal: totalHarga,
      Omset: this.omset
      });
      
      // Log ID dokumen baru yang dibuat
      console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error getting documents: ", error);
        this.hasil = "Terjadi kesalahan saat mengambil data.";
        }
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
  max-width: 800px; /* Adjusted width to fit more content */
  margin: 0 auto;
  padding: 2rem;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Heading styling */
h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

/* Flexbox container for inputs */
.input-container {
  display: flex;
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
  flex-basis: calc(33.333% - 10px); /* Three items per row */
}
.input-group label, .menu-group label {
  display: inline-block;
  width: 120px; /* Adjust as needed */
  text-align: left;
}
.input-group input[type="number"], .menu-group input[type="number"] {
  width: 150px; /* Adjust as needed */
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
</style>
