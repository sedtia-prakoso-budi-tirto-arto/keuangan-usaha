<template>
    <div class="container">
      <button @click="navigateToHome" class="back btn btn-primary mb-4">Home</button>
      <div class="total-nett-profit mb-4">
        <h5><strong>Saldo saat ini: <span class="text-success">{{ formatRupiah(totalSaldoSaatIni) }}</span></strong></h5>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Waktu Input</th>
              <th>Tanggal</th>
              <th>Kebutuhan</th>
              <th>Gaji</th>
              <th>Lainnya</th>
              <th>Total Pemasukan</th>
              <th>Total Kebutuhan</th>
              <th>Saldo</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in dataList" :key="index" class="table-row">
              <td>{{ data.date }}</td>
              <td>{{ data.tanggal }}</td>
              <td v-html="formatKebutuhan(data.kebutuhanInfo)"></td>
              <td>{{ formatRupiah(data.pemasukan.gaji) }}</td>
              <td>{{ formatRupiah(data.pemasukan.lainnya) }}</td>
              <td>{{ formatRupiah(data.totalPemasukan) }}</td>
              <td>{{ formatRupiah(data.totalKebutuhan) }}</td>
              <td>{{ formatRupiah(data.saldo) }}</td>
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
    totalSaldoSaatIni() {
        return this.dataList.reduce((total, data) => {
        // Periksa apakah properti saldo adalah angka numerik yang valid
        if (!isNaN(data.saldo) && typeof data.saldo === 'number') {
            return total + data.saldo;
        } else {
            return total; // Jika properti saldo tidak valid, abaikan
        }
        }, 0);
    }
    },

    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        try {
          const querySnapshot = await getDocs(collection(db, 'historyNeeds'))
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
          await deleteDoc(doc(db, 'historyNeeds', idToDelete));
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
      formatRupiah(value) {
        if (value === undefined || value === null) {
          return 'Rp 0';
        }
        return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      },
      formatKebutuhan(kebutuhanInfo) {
        const items = kebutuhanInfo.split('<br>')
        let html = '<ul>'
        items.forEach(item => {
          const parts = item.split(':')
          if (parts.length === 2 && parts[1].trim() !== 'undefined' && !['Saldo, Total Saldo', 'Total Pemasukan', 'Total Kebutuhan'].includes(parts[0].trim())) {
            html += `<li>${parts[0].trim()}: ${parts[1].trim()}</li>`
          }
        })
        html += '</ul>'
        return html
      },
      navigateToEdit(index) {
        const id = this.dataList[index].id;
        Swal.fire({
          title: 'Memuat Edit Kebutuhan Harian...',
          text: 'Silakan tunggu',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        setTimeout(() => {
          Swal.close();
          // Mengarahkan ke rute EditKebutuhanHarian
          this.$router.push({ name: 'EditKebutuhanHarian', params: { id: id } });
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
          // Mengarahkan ke rute Beranda
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
  </style>
  