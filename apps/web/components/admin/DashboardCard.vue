<script setup lang="ts">
import Card from '~/components/ui/card/Card.vue'
import CardContent from '~/components/ui/card/CardContent.vue'
import { cn } from '~/utils/cn'

interface Props {
  label: string
  value: number | string
  class?: string
}

const props = defineProps<Props>()

const classes = computed(() => cn('p-5', props.class))
</script>

<template>
  <Card :class="classes">
    <CardContent class="p-0">
      <div class="text-sm text-muted-foreground">{{ label }}</div>
      <div class="mt-1 text-2xl font-bold">{{ value }}</div>
    </CardContent>
  </Card>
</template>