<template>
  <div class="container">
    <button @click="navigateToHome" class="back btn btn-primary mb-4">Home</button>
    <div class="total-profit mb-4">
      <h5><strong>Total Nett Profit: <span class="text-success">{{ formatRupiah(totalNettProfit) }}</span></strong></h5>
    </div>
    <div class="total-sewa mb-4">
      <h5><strong>Total Sewa: <span class="text-success">{{ formatRupiah(totalSewa) }}</span></strong></h5>
    </div>
    <div class="cash-flow mb-4">
      <h5><strong>Cash Flow: <span class="text-success">{{ formatRupiah(cashFlow) }}</span></strong></h5>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Waktu Input</th>
            <th>Tanggal</th>
            <th>Jumlah Telur</th>
            <th>Jumlah Porsi</th>
            <th>Total Modal</th>
            <th>Omset</th>
            <th>Pengeluaran</th>
            <th>Nett Profit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in dataList" :key="index" class="table-row">
            <td>{{ data.date }}</td>
            <td>{{ formatTanggal(data.tanggal) }}</td>
            <td>{{ data.jumlahTelur }}</td>
            <td>{{ data.jumlahPorsi }}</td>
            <td>{{ formatRupiah(data.totalModal) }}</td>
            <td>{{ formatRupiah(data.Omset) }}</td>
            <td>{{ formatRupiah(data.Pengeluaran) }}</td>
            <td>{{ formatRupiah(calculateNettProfit(data.Omset, data.totalModal)) }}</td>
            <td>
              <div class="btn-group" role="group">
                <button class="btn btn-success" @click="navigateToEdit(index)"><i class="fas fa-edit"></i></button>
                <button @click="confirmDeleteData(index)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      dataList: []
    }
  },
  computed: {
    totalNettProfit() {
      return this.dataList.reduce((total, data) => {
        return total + this.calculateNettProfit(data.Omset, data.totalModal);
      }, 0);
    },
    totalSewa() {
      const startTanggal = this.dataList[this.dataList.length - 1]?.tanggal; // Ambil tanggal terakhir dari data
      const endTanggal = this.dataList[0]?.tanggal; // Ambil tanggal pertama dari data
      if (!startTanggal || !endTanggal) return 0; // Jika tidak ada data, kembalikan 0
      const diffInDays = this.getDifferenceInDays(new Date(startTanggal), new Date(endTanggal));
      return diffInDays * 27000; // Hitung total sewa
    },
    cashFlow() {
      const totalModal = this.dataList.reduce((total, data) => total + data.totalModal, 0);
      const totalPengeluaran = this.dataList.reduce((total, data) => total + data.Pengeluaran, 0);
      return totalModal - totalPengeluaran;
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getDifferenceInDays(startTanggal, endTanggal) {
      const oneDay = 24 * 60 * 60 * 1000; // Satu hari dalam milidetik
      return Math.round(Math.abs((startTanggal - endTanggal) / oneDay));
    },
    async fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'))
        let dataList = []
        querySnapshot.forEach(doc => {
          const id = doc.id
          dataList.push({ id, ...doc.data() })
        })
        
        dataList.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        
        this.dataList = dataList
      } catch (error) {
        console.error('Error fetching documents: ', error)
      }
    },
    async deleteData(index) {
      try {
        const idToDelete = this.dataList[index].id;
        await deleteDoc(doc(db, 'history', idToDelete));
        this.dataList.splice(index, 1);
        console.log('Data ID ' + idToDelete + ' berhasil dihapus');

        // Tampilkan pesan sukses dengan SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Data berhasil dihapus',
          text: 'Data ID ' + idToDelete + ' berhasil dihapus'
        });
      } catch (error) {
        console.error('Error deleting document: ', error);

        // Tampilkan pesan kesalahan dengan SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.'
        });
      }
    },
    confirmDeleteData(index) {
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Anda tidak akan bisa mengembalikan data ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteData(index);
        }
      });
    },
    calculateNettProfit(Omset, totalModal) {
      return Omset - totalModal - 27000
    },
    formatRupiah(value) {
        if (value === undefined || value === null) {
          return 'Rp 0';
        }
        return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      },
      formatTanggal(value) {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Januari dimulai dari 0
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    formatModalInfo(modalInfo) {
      const items = modalInfo.split('<br>')
      let html = '<ul>'
      items.forEach(item => {
        const parts = item.split(':')
        if (parts.length === 2 && parts[1].trim() !== 'undefined') {
          html += `<li>${parts[0].trim()}: ${parts[1].trim()}</li>`
        }
      })
      html += '</ul>'
      return html
    },
    logId(id) {
      console.log("Navigating to EditModalHarian with ID:", id)
    },
    navigateToEdit(index) {
      const id = this.dataList[index].id;
        Swal.fire({
            title: 'Memuat Edit Modal Harian...',
            text: 'Silakan tunggu',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {
            Swal.close();
            // Mengarahkan ke rute KelolaModal
            this.$router.push({ name: 'EditModalHarian', params: { id: id } });
        }, 750);
      },
    navigateToHome() {
        Swal.fire({
            title: 'Memuat Home...',
            text: 'Silakan tunggu',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {
            Swal.close();
            // Mengarahkan ke rute KelolaModal
            this.$router.push({ name: 'Beranda' });
        }, 750);
      }
  }
}
</script>


<style scoped>
.back {
  margin-top: 3%;
}

.total-profit .text-success,
.total-sewa .text-success,
.cash-flow .text-success {
  color: #28a745;
}
</style>

