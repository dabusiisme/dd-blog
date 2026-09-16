<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { saveSiteConfig } = useSiteConfig()

const form = reactive({
  siteName: '',
  description: '',
})
const message = ref('')
const error = ref('')

// TODO: 从 content/site.config.json（Git API）加载现有配置
const requestFetch = useRequestFetch()
const { data: config } = await useAsyncData('admin-config', () =>
  requestFetch<{ data: Record<string, unknown> }>('/api/admin/config').catch(() => null),
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
      <Label class="flex flex-col gap-1">
        站点名称
        <Input v-model="form.siteName" required />
      </Label>
      <Label class="flex flex-col gap-1">
        站点描述
        <Textarea v-model="form.description" :rows="3" />
      </Label>
      <p v-if="message" class="text-sm text-green-600">{{ message }}</p>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <div>
        <Button type="submit">保存</Button>
      </div>
    </form>
  </div>
</template>