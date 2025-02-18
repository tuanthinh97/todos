<template>
  <div class="container mt-3">
    <div class="post-header">
      <h3>Add Post</h3>
    </div>
    <div class="post-body">
      <div class="mb-3 mt-3">
        <label class="form-label">Title: </label> <span>{{ post.title }}</span>
        <input class="form-control" v-model="post.title" />
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Body: </label> <span>{{ post.body }}</span>
        <textarea class="form-control" rows="5" v-model="post.body"></textarea>
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Tags: </label> <span>{{ post.tags }}</span>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="fiction" value="fiction" @change="toggleTag" />
          <label class="form-check-label" for="fiction">Fiction</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="magical" value="magical" @change="toggleTag" />
          <label class="form-check-label" for="magical">Magical</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="history" value="history" @change="toggleTag" />
          <label class="form-check-label" for="history">History</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="crime" value="crime" @change="toggleTag" />
          <label class="form-check-label" for="crime">Crime</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="english" value="english" @change="toggleTag" />
          <label class="form-check-label" for="english">English</label>
        </div>
      </div>

      <div>
        <button class="btn btn-primary" @click="savePost">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import router from '@/router/index.js'

const post = reactive({
  title: '',
  body: '',
  tags: [],
})

const toggleTag = (event) => {
  const value = event.target.value
  if (event.target.checked) {
    post.tags.push(value)
  } else {
    post.tags = post.tags.filter((tag) => tag !== value)
  }
}

const savePost = async () => {
  try {
    const response = await fetch('https://dummyjson.com/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, userId: 1 }),
    })

    // Nếu status là 400, lấy message từ body
    if (response.status === 400) {
      const errorData = await response.json() // Chuyển response body thành JSON
      const message = `Error 400: ${errorData.message || 'Bad Request'}`
      alert(message)
      throw new Error(message) // Lấy message từ API nếu có
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Post Created:', data)
    await router.push('/')
  } catch (error) {
    console.error('Error saving post:', error.message) // Hiển thị lỗi
  }
}
</script>

<style></style>
