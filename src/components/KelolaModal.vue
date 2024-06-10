<template>
  <div class="container">
    <button class="back-btn" @click="navigateToHome">Home</button>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Waktu Input</th>
            <th>Tanggal</th>
            <th>Jumlah Telur</th>
            <th>Jumlah Porsi</th>
            <th>Total Modal</th>
            <th>Omset</th>
            <th>Nett Profit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in dataList" :key="index" class="table-row">
            <td>{{ data.date }}</td>
            <td>{{ data.tanggal }}</td>
            <td>{{ data.jumlahTelur }}</td>
            <td>{{ data.jumlahPorsi }}</td>
            <td>{{ formatRupiah(data.totalModal) }}</td>
            <td>{{ formatRupiah(data.Omset) }}</td>
            <td>{{ formatRupiah(calculateNettProfit(data.Omset, data.totalModal)) }}</td>
            <td>
              <div class="action-buttons">
                <router-link :to="{ name: 'EditModalHarian', params: { id: data.id } }" class="action-btn edit-btn">
                  <i class="fas fa-edit"></i>
                </router-link>
                <button @click="deleteData(index)" class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
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
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'))
        let dataList = []
        querySnapshot.forEach(doc => {
          const id = doc.id
          dataList.push({ id, ...doc.data() })
        })
        
        dataList.sort((a, b) => new Date(b.date) - new Date(a.date))
        
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

    calculateNettProfit(Omset, totalModal) {
      return Omset - totalModal - 27000
    },
    formatRupiah(value) {
      return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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
    navigateToHome() {
      this.$router.push({ name: 'ModalHarian' })
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  color: #333;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
}

.table-row:hover {
  background-color: #e9ecef;
}

.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: #007bff;
  color: white;
}

.edit-btn {
  background-color: #28a745;
}

.delete-btn {
  margin-left: 5px;
  background-color: #dc3545;
}

.action-btn:hover {
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.back-btn {
  padding: 10px 20px;
  margin-bottom: 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  table, th, td {
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .back-btn {
    width: 100%;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  th, td {
    padding: 8px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0;
  }

  .action-btn {
    margin: 2px 0;
  }

  .back-btn {
    width: 100%;
    padding: 10px;
  }
}
</style>
