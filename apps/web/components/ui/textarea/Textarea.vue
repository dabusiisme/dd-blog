<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const model = defineModel<string | number | undefined>()

const props = withDefaults(
  defineProps<{
    class?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    rows?: number | string
    id?: string
    name?: string
  }>(),
  { class: '', rows: 4, placeholder: '', id: '', name: '' },
)

const classes = computed(() =>
  cn(
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)
</script>

<template>
  <textarea
    v-model="model"
    :required="required"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :id="id"
    :name="name"
    :class="classes"
  />
</template>