<template>
  <div class="container">
    <h1>Ubah Perhitungan Modal Harian</h1>
    <label for="jumlahTelur">Jumlah Telur:</label>
    <input type="number" v-model.number="jumlahTelur" min="1" id="jumlahTelur">
    
    <label for="jumlahPorsi">Jumlah Porsi:</label>
    <input type="number" v-model.number="jumlahPorsi" min="1" id="jumlahPorsi">
    
    <button @click="hitungTotalHarga">Update Modal</button>
    <button @click="navigateToKelola" style="margin-left: 10px;">Kelola</button>
    
    <div v-html="hasil" class="hasil"></div>
  </div>
</template>

<script>
import { db } from '../../firebase';
import { doc, collection, updateDoc, getDoc, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      jumlahTelur: 0,
      jumlahPorsi: 0,
      hasil: ""
    };
  },
  async mounted() {
    const documentId = this.$route.params.id;
    await this.getDataById(documentId);
  },
  methods: {
    async getDataById(id) {
      try {
        const docRef = doc(db, "history", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          this.jumlahTelur = data.jumlahTelur || 0; // Mengatur jumlahTelur sesuai data dokumen atau default 0 jika tidak ada
          this.jumlahPorsi = data.jumlahPorsi || 0; // Mengatur jumlahPorsi sesuai data dokumen atau default 0 jika tidak ada
          this.hasil = data.modalInfo;
        } else {
          this.hasil = "Dokumen tidak ditemukan.";
        }
      } catch (error) {
        console.error("Error getting document:", error);
        this.hasil = "Terjadi kesalahan saat mengambil data.";
      }
    },
    async hitungTotalHarga() {
      if (isNaN(this.jumlahTelur) || this.jumlahTelur <= 0) {
        this.hasil = "Jumlah telur harus angka positif.";
        return;
      }
      if (isNaN(this.jumlahPorsi) || this.jumlahPorsi <= 0) {
        this.hasil = "Jumlah porsi harus angka positif.";
        return;
      }

      const getHargaBahan = (data, bahan) => {
        return data[bahan] || null;
      };

      try {
        const querySnapshot = await getDocs(collection(db, "modal"));
        let totalHarga = 0;
        let hasilPerhitungan = '';

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const hargaTelur = getHargaBahan(data, "telur");

          if (hargaTelur !== null) {
            for (const [bahan, harga] of Object.entries(data)) {
              if (harga && !isNaN(harga)) {
                const totalHargaBahan = harga * this.jumlahTelur;
                hasilPerhitungan += `${bahan}: ${harga} * ${this.jumlahTelur} = ${totalHargaBahan}<br>`;
                totalHarga += totalHargaBahan;
              }
            }
          }

          const hargaFoam = getHargaBahan(data, "foam");
          const hargaBahanLain = getHargaBahan(data, "sendok");

          if (hargaFoam !== null && this.jumlahPorsi > 0) {
            const totalHargaFoam = hargaFoam * this.jumlahPorsi;
            hasilPerhitungan += `foam: ${hargaFoam} * ${this.jumlahPorsi} = ${totalHargaFoam}<br>`;
            totalHarga += totalHargaFoam;
          }

          if (hargaBahanLain !== null && this.jumlahPorsi > 0) {
            const totalHargaBahanLain = hargaBahanLain * this.jumlahPorsi;
            hasilPerhitungan += `sendok: ${hargaBahanLain} * ${this.jumlahPorsi} = ${totalHargaBahanLain}<br>`;
            totalHarga += totalHargaBahanLain;
          }
        });

        hasilPerhitungan += `Total Modal: ${totalHarga}<br>Porsi Terjual: ${this.jumlahPorsi}`;
        this.hasil = hasilPerhitungan;

        const timestamp = new Date().toISOString();
        const documentId = this.$route.params.id;
        await updateDoc(doc(db, "history", documentId), {
          date: timestamp,
          modalInfo: this.hasil
        });
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
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input[type="number"] {
  width: calc(100% - 2rem);
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
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
