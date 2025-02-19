<template>
  <div class="container mt-3">
    <div class="post-header">
      <h3>Add Post</h3>
    </div>
    <div class="post-body needs-validation">
      <div class="mb-3 mt-3">
        <label class="form-label">Title </label>
        <input class="form-control" :class="{ 'input-error': form.error.title }" v-model="form.post.title" />
        <span v-if="form.error.title" class="error-message">{{ form.error.title }}</span>
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Body </label>
        <textarea class="form-control" :class="{ 'input-error': form.error.body }" rows="5" v-model="form.post.body"></textarea>
        <span v-if="form.error.body" class="error-message">{{ form.error.body }}</span>
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Tags </label> <br/>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="fiction"
            value="fiction"
            @change="toggleTag"
          />
          <label class="form-check-label" for="fiction">Fiction</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="magical"
            value="magical"
            @change="toggleTag"
          />
          <label class="form-check-label" for="magical">Magical</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="history"
            value="history"
            @change="toggleTag"
          />
          <label class="form-check-label" for="history">History</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="crime"
            value="crime"
            @change="toggleTag"
          />
          <label class="form-check-label" for="crime">Crime</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="english"
            value="english"
            @change="toggleTag"
          />
          <label class="form-check-label" for="english">English</label>
        </div>
        <br/>
        <span v-if="form.error.tags">{{ form.error.tags }}</span>
      </div>

      <div>
        <button class="btn btn-primary" @click="handleCreatePost()">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive} from 'vue'
import router from '@/router/index.js'
import {apiService} from '@/services/apiService.js'

const form = reactive({
  post: { title: '', body: '', tags: [] },  // Dữ liệu bài viết
  error: new Proxy({}, {
    get(target, prop) {
      return target[prop] || '' // Mặc định lỗi rỗng nếu chưa có
    },
    set(target, prop, value) {
      target[prop] = value
      return true
    }
  })
})

const toggleTag = (event) => {
  const value = event.target.value
  if (event.target.checked) {
    form.post.tags.push(value)
  } else {
    form.post.tags = form.post.tags.filter((tag) => tag !== value)
  }
}

const handleCreatePost = async () => {
  form.error = {};
  const body = JSON.stringify({ ...form.post, userId: 1 })
  const data = await apiService.createPost(body)
  if (data) {
    if (data?.error) {
      form.error = { ...data.error }
    } else {
      console.log('Post Created:', data)
      alert('Post created successfully!')
      await router.push(`/`)
      location.reload()
    }
  }
}
</script>

<style></style>
