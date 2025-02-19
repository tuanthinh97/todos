<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { apiService } from '@/services/apiService'

const data = ref(null)
const showModal = ref(false)
const postToDelete = reactive({
  id: null,
  title: null,
  body: null,
})

const currentPage = ref(1)
const totalPosts = ref(0)
const limit = 10

onMounted(async () => {
  console.log(`Page: ${currentPage.value}, limit: ${limit}`)
  data.value = await apiService.fetchPosts(limit, currentPage.value)
})

// Watch để gọi API khi currentPage thay đổi
watch(currentPage, (newValue, oldValue) => {
  console.log(`newValue is ${newValue} and oldValue is ${oldValue}`)
  data.value = apiService.fetchPosts(limit, currentPage)
})

const confirmDelete = (post) => {
  showModal.value = true
  Object.assign(postToDelete, post)
}

const handleDeletePost = async () => {
  if (!postToDelete.id) return
  const dataResponse = await apiService.deletePost(postToDelete.id)
  if (dataResponse) {
    console.log('Post Deleted:', dataResponse)
    alert('Post deleted successfully!')
    resetPostValue()
    data.value = await apiService.fetchPosts(limit, currentPage.value)
  }
}

const resetPostValue = () => {
  showModal.value = false
  postToDelete.id = null
  postToDelete.title = null
  postToDelete.body = null
}

const totalPages = () => Math.ceil(totalPosts.value / limit)
const goToPage = (page) => {
  if (page > 0 && page <= totalPages()) {
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
            <td>Reactions</td>
            <td>Views</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data?.posts" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.body }}</td>
            <td>
              <ul>
                <li v-for="tag in item?.tags" :key="tag">{{ tag }}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>likes: {{ item.reactions.likes }}</li>
                <li>dislikes: {{ item.reactions.dislikes }}</li>
              </ul>
            </td>
            <td>{{ item.views }}</td>
            <td>
              <RouterLink class="btn btn-primary" :to="{ path: `/${item.id}/edit` }"
                >Edit</RouterLink
              >
              <button class="btn btn-danger" @click="confirmDelete(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ul class="pagination justify-content-end" style="margin: 20px 0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
        </li>
        <li
          v-for="page in totalPages()"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }">
          <template v-if="page === 1 || page === totalPages() || Math.abs(page - currentPage) <= 2">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </template>
          <template v-else-if="page === 3 && currentPage > 5">
            <button class="page-link" disabled>...</button>
          </template>
          <template v-else-if="page === totalPages() - 1 && currentPage < totalPages() - 2">
            <button class="page-link" disabled>...</button>
          </template>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages() }">
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
</style>
