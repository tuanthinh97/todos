<template>
  <div class="container mt-3">
    <div class="post-header">
      <h3>Edit Post</h3>
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
          <input
            class="form-check-input"
            type="checkbox"
            id="fiction"
            value="fiction"
            @change="toggleTag"
            :checked="post.tags.includes('fiction')"
          />
          <label class="form-check-label" for="fiction">Fiction</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="magical"
            value="magical"
            @change="toggleTag"
            :checked="post.tags.includes('magical')"
          />
          <label class="form-check-label" for="magical">Magical</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="history"
            value="history"
            @change="toggleTag"
            :checked="post.tags.includes('history')"
          />
          <label class="form-check-label" for="history">History</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="crime"
            value="crime"
            @change="toggleTag"
            :checked="post.tags.includes('crime')"
          />
          <label class="form-check-label" for="crime">Crime</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="english"
            value="english"
            @change="toggleTag"
            :checked="post.tags.includes('english')"
          />
          <label class="form-check-label" for="english">English</label> <br />
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="american"
            value="american"
            @change="toggleTag"
            :checked="post.tags.includes('american')"
          />
          <label class="form-check-label" for="american">American</label>
        </div>
      </div>

      <div>
        <button class="btn btn-primary" @click="updatePost">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index.js'

const route = useRoute()
console.log(route.params.id)

const post = reactive({
  title: '',
  body: '',
  tags: [],
})

const fetchPost = async () => {
  try {
    const response = await fetch(`https://dummyjson.com/posts/${route.params.id}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    Object.assign(post, data)
    console.log(post)
  } catch (error) {
    console.error('Error fetching post:', error)
  }
}

onMounted(() => {
  console.log('onMounted: Component đã gắn vào DOM')
  fetchPost()
})

// onBeforeMount(() => {
//   console.log('onBeforeMount: Component sắp gắn vào DOM')
// })
//
// onBeforeUpdate(() => {
//   console.log(
//     'onBeforeUpdate. Post title before update:',
//     document.getElementById('post-title').textContent,
//   )
// })
//
// onUpdated(() => {
//   console.log('onUpdated. Post title updated:', document.getElementById('post-title').textContent)
// })
//
// onBeforeUnmount(() => {
//   console.log('onBeforeUnmount')
// })
//
// onUnmounted(() => {
//   console.log('onUnmounted')
// })

const toggleTag = (event) => {
  const value = event.target.value
  if (event.target.checked) {
    post.tags.push(value)
  } else {
    post.tags = post.tags.filter((tag) => !tag !== value)
  }
}

const updatePost = async () => {
  try {
    const response = await fetch(`https://dummyjson.com/posts/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`)
    }

    const updatedData = await response.json()
    console.log('Post Updated:', updatedData)

    await router.push(`/`).then(() => location.reload())
  } catch (error) {
    console.error('Error updating post:', error)
  }
}
</script>
