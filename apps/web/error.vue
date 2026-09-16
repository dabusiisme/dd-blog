<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const handleClear = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex-center min-h-screen flex-col gap-4">
    <h1 class="text-6xl font-bold">{{ props.error.statusCode }}</h1>
    <p class="text-gray-500">{{ props.error.statusMessage || '页面不存在' }}</p>
    <button class="btn-primary rounded px-4 py-2" @click="handleClear">返回首页</button>
  </div>
</template>
