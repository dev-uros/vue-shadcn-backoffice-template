<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <Button variant="outline" size="icon" @click="toggleDark()">
    <Icon icon="radix-icons:sun" class="h-[1.2rem] w-[1.2rem] transition-all duration-300 dark:rotate-180 dark:scale-0" />
    <Icon icon="radix-icons:moon" class="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
