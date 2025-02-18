<template>
  <div class="about">
    <h1>This is an lifecycle hooks example</h1>
    <h2 id="count-down">Countdown: {{ countDown}}</h2>
    <button @click="stopCountDown()"> Stop CountDown </button>
    <button @click="startCountDown()"> Start CountDown </button>
  </div>
</template>

<script setup>
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated, ref
} from "vue";
import router from "@/router/index.js";

const countDown = ref(10);
let intervalId = null;

const stopCountDown = () => {
  clearInterval(intervalId);
  intervalId = null;
}

const startCountDown = () => {
  if (intervalId != null) return;
  intervalId = setInterval(() => {
    countDown.value--;
  }, 1000);
}

// Template đã được biên dịch nhưng chưa gắn vào DOM.
// Hook này sẽ chạy trước onMounted
onBeforeMount(() => {
  console.log("onBeforeMount: Component sắp gắn vào DOM");
  intervalId = setInterval(() => {
    countDown.value--;
  }, 1000);
})

// Được gọi sau onBeforeMount
// Component đã gắn vào DOM, có thể thao tác với DOM.
onMounted(() => {
  console.log("onMounted: Component đã gắn vào DOM ");
})

// Gọi trước khi component bị loại khỏi DOM.
onBeforeUnmount(() => {
  console.log("onBeforeUnmount: Component sắp bị hủy");
  clearInterval(intervalId);
})

// Gọi sau khi component đã bị loại khỏi DOM.
// Sử dụng khi gỡ các thiết lập trong onMounted,...
onUnmounted(() => {
  console.log("onUnmounted: Component đã bị hủy");
})

// Gọi trước khi component re-render khi dữ liệu thay đổi.
onBeforeUpdate(() => {
  let valueBefore = document.getElementById("count-down").innerHTML;
  console.log("onBeforeUpdate: Sắp cập nhật component, Current value: ", valueBefore);
})

// Gọi sau khi component đã re-render.
onUpdated(() => {
  let valueUpdated = document.getElementById("count-down").innerHTML;
  console.log("onUpdated: Component đã cập nhật, value updated: ", valueUpdated);
  if (countDown.value === 0) {
    router.push("/");
  }
})

</script>

<style>

.about {
  display: inline !important;
  margin-top: 50%;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
