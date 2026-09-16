<script setup lang="ts">
interface Props {
  tag: string
}

const props = defineProps<Props>()
</script>

<template>
  <span class="rounded bg-blue-50 px-2 py-0.5 text-blue-600">
    {{ props.tag }}
  </span>
</template>
