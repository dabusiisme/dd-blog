<script setup lang="ts">
import type { LoginPayload } from '~/types/user'

definePageMeta({ layout: 'blank' })

const { login } = useAuth()
const form = reactive<LoginPayload>({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await login(form)
    await navigateTo('/admin')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="w-80 rounded-lg border bg-white p-8 shadow" @submit.prevent="handleSubmit">
    <h1 class="mb-6 text-center text-xl font-bold">后台登录</h1>
    <label class="mb-4 flex flex-col gap-1 text-sm">
      用户名
      <input v-model="form.username" required autocomplete="username" class="rounded border px-3 py-2" />
    </label>
    <label class="mb-6 flex flex-col gap-1 text-sm">
      密码
      <input
        v-model="form.password"
        type="password"
        required
        autocomplete="current-password"
        class="rounded border px-3 py-2"
      />
    </label>
    <p v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</p>
    <BaseButton type="submit" :disabled="loading" class="w-full">
      {{ loading ? '登录中…' : '登录' }}
    </BaseButton>
  </form>
</template>
