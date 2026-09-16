<script setup lang="ts">
const { data: about } = await useAsyncData('about', () => queryContent('/pages/about').findOne())

useBlogSeo({
  title: '关于',
  description: ((about.value?.description as string) ?? '') || '关于本博客',
})
</script>

<template>
  <article class="prose max-w-none">
    <ContentRenderer v-if="about" :value="about" />
  </article>
</template>
