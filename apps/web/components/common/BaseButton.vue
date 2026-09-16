<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit'
  variant?: 'primary' | 'danger'
  disabled?: boolean
  /** 传 to 时渲染为 NuxtLink；不要用 <NuxtLink> 包 <BaseButton>（a 内嵌 button 点击不跳转） */
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  to: '',
})

const classes = computed(() => [
  'rounded px-4 py-2 text-sm text-white transition',
  props.variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
  props.disabled ? 'cursor-not-allowed opacity-50' : '',
])

const linkClasses = computed(() => ['inline-block', ...classes.value.filter(Boolean)])
</script>

<template>
  <NuxtLink v-if="props.to" :to="props.to" :class="linkClasses">
    <slot />
  </NuxtLink>
  <button v-else :type="props.type" :disabled="props.disabled" :class="classes">
    <slot />
  </button>
</template>
