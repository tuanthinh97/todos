<template>
  <div class="container mt-3">
    <div class="post-header">
      <h3>Edit Post</h3>
    </div>
    <div class="post-body">
      <div class="mb-3 mt-3">
        <label class="form-label">Title </label>
        <input class="form-control" :class="{'input-error': form.error.title}" v-model="form.post.title" />
        <span v-if="form.error.title" class="error-message">{{ form.error.title }}</span>
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Body </label>
        <textarea class="form-control" rows="5" v-model="form.post.body"></textarea>
        <span v-if="form.error.body" class="error-message">{{ form.error.body }}</span>
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Tags: </label> <br/>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="fiction"
            value="fiction"
            @change="toggleTag"
            :checked="form.post.tags.includes('fiction')"
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
            :checked="form.post.tags.includes('magical')"
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
            :checked="form.post.tags.includes('history')"
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
            :checked="form.post.tags.includes('crime')"
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
            :checked="form.post.tags.includes('english')"
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
            :checked="form.post.tags.includes('american')"
          />
          <label class="form-check-label" for="american">American</label>
        </div>
        <span v-if="form.error.tags" class="error-message">{{ form.error.tags }}</span>
      </div>

      <div>
        <button class="btn btn-primary" @click="handleUpdatePost()">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import router from "@/router/index.js"
import {apiService} from "@/services/apiService.js"

const route = useRoute()
console.log(route.params.id)

const form = reactive({
  post: {title: '', body: '', tags: []},
  error: new Proxy({}, {
    get(target, prod) {
      return target[prod] || '';
    },
    set(target, prod, value) {
      target[prod] = value;
      return true
    }
  })
})

const handleUpdatePost = async () => {
  const data = await apiService.updatePost(route.params.id, form.post)
  if (data) {
    if (data?.error) {
      form.error = data.error
    } else {
      console.log('Post Updated:', data)
      alert('Post updated successfully!')
      await router.push(`/`)
      location.reload()
    }
  }
}

onMounted(async () => {
  console.log('onMounted: Component đã gắn vào DOM')
  const response = await apiService.fetchPostId(route.params.id)
  Object.assign(form.post, response)
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
    form.post.tags.push(value)
  } else {
    form.post.tags = form.post.tags.filter((tag) => !tag !== value)
  }
}
</script>
