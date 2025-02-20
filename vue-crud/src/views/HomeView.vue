<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import { apiService } from '@/services/apiService'
import { useToast } from 'vue-toastification';
const toast = useToast();

const data = ref(null)
const showModal = ref(false)
const postToDelete = reactive({
  id: null,
  title: null,
  body: null,
})

const currentPage = ref(1)
const size = ref(10)

onMounted(async () => {
  console.log(`Page: ${currentPage.value}, limit: ${size.value}`)
  data.value = await apiService.fetchPosts(size.value, currentPage.value)
})

// Watch để gọi API khi currentPage thay đổi
watch(currentPage, async (newPage, oldPage) => {
  console.log(`newPage is ${newPage} and oldPage is ${oldPage}`)
  data.value = await apiService.fetchPosts(size.value, newPage)
})

watch(size, async (newSize) => {
  console.log(`newSize is ${newSize}`)
  data.value = await apiService.fetchPosts(newSize, currentPage)
})

const confirmDelete = (post) => {
  showModal.value = true
  Object.assign(postToDelete, post)
}

const handleDeletePost = async () => {
  if (!postToDelete.id) return
  const dataResponse = await apiService.deletePost(postToDelete.id)
  if (dataResponse) {
    if (dataResponse?.error) {
      toast.error('Failed to delete post. Please check again.');
      toast.error(dataResponse.error);
    } else {
      toast.success('Post deleted successfully!')
    }
    resetPostValue()
    data.value = await apiService.fetchPosts(size.value, currentPage.value)
  }
}

const resetPostValue = () => {
  showModal.value = false
  postToDelete.id = null
  postToDelete.title = null
  postToDelete.body = null
}

const totalPages = computed(() => {
  return data.value ? Math.ceil((data.value.totalCount || 0) / size.value) : 0
})

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div class="main">
    <div class="container mt-3">
      <h2>Vue CRUD Example</h2>
      <RouterLink class="btn btn-success" to="/create">Create</RouterLink>
      <table class="table table-hover">
        <thead>
          <tr>
            <td>ID</td>
            <td>Title</td>
            <td>Body</td>
            <td>Tag</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data?.data" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.body }}</td>
            <td>
              <ul>
                <li v-for="tag in item?.tags" :key="tag">{{ tag }}</li>
              </ul>
            </td>
            <td style="width: 200px">
              <RouterLink class="btn btn-primary btn-edit" :to="{ path: `/${item.id}/edit` }"
                >Edit</RouterLink
              >
              <button class="btn btn-danger btn-delete" @click="confirmDelete(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ul class="pagination justify-content-end" style="margin: 20px 0">
        <li>
          <select v-model="size" class="form-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <template v-if="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </template>
          <template v-else-if="page === 3 && currentPage > 5">
            <button class="page-link" disabled>...</button>
          </template>
          <template v-else-if="page === totalPages - 1 && currentPage < totalPages - 2">
            <button class="page-link" disabled>...</button>
          </template>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </div>
  </div>

  <template v-if="showModal">
    <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Confirm Delete</h4>
            <button @click="showModal = false" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn xóa <strong>{{ postToDelete.title }}</strong>
            </p>
          </div>
          <div class="modal-footer">
            <button @click="handleDeletePost()" class="btn btn-primary">Yes, delete</button>
            <button @click="showModal = false" class="btn btn-danger">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style>
thead {
  font-weight: bold;
}
.modal {
  display: block !important;
}
.error-message {
  color: red;
  font-size: 14px;
}

.input-error {
  border: 1px solid red;
}

.btn-edit {
  width: 80px;
  margin: 0 5px;
}

.btn-delete{
  width: 80px;
  margin: 0 5px;
}

.form-select {
  margin: 0 5px;
}
</style>
