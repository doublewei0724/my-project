<template>
  <div class="text-white">
    <h2 class="mb-4 text-xl font-bold">用戶資訊</h2>
    <p>ID: {{ id }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ id?: number }>()
</script>
