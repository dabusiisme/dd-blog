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
  <form
    class="w-80 rounded-lg border bg-card p-8 text-card-foreground shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <h1 class="mb-6 text-center text-xl font-bold">后台登录</h1>
    <Label class="mb-4 flex flex-col gap-1">
      用户名
      <Input v-model="form.username" required autocomplete="username" />
    </Label>
    <Label class="mb-6 flex flex-col gap-1">
      密码
      <Input v-model="form.password" type="password" required autocomplete="current-password" />
    </Label>
    <p v-if="error" class="mb-4 text-sm text-destructive">{{ error }}</p>
    <Button type="submit" :disabled="loading" class="w-full">
      {{ loading ? '登录中…' : '登录' }}
    </Button>
  </form>
</template>