<script setup lang="ts">
const { saveSiteConfig } = useSiteConfig()

const form = reactive({
  siteName: '',
  description: '',
})
const message = ref('')
const error = ref('')

// TODO: 从 content/site.config.json（Git API）加载现有配置
const { data: config } = await useAsyncData('admin-config', () =>
  $fetch<{ data: Record<string, unknown> }>('/api/admin/config').catch(() => null),
)

if (config.value?.data) {
  form.siteName = String(config.value.data.siteName ?? '')
  form.description = String(config.value.data.description ?? '')
}

async function handleSubmit() {
  error.value = ''
  message.value = ''
  try {
    await saveSiteConfig({ ...form })
    message.value = '已保存（提交到仓库，构建部署后生效）'
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  }
}
</script>

<template>
  <div class="max-w-lg">
    <h1 class="mb-6 text-2xl font-bold">站点设置</h1>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <label class="flex flex-col gap-1 text-sm">
        站点名称
        <input v-model="form.siteName" required class="rounded border px-3 py-2" />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        站点描述
        <textarea v-model="form.description" rows="3" class="rounded border px-3 py-2" />
      </label>
      <p v-if="message" class="text-sm text-green-600">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div>
        <BaseButton type="submit">保存</BaseButton>
      </div>
    </form>
  </div>
</template>
