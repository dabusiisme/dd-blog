<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit'
  variant?: 'primary' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="rounded px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="props.variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'"
  >
    <slot />
  </button>
</template>
