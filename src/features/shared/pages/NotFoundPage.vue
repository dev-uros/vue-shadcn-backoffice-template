<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { House, ArrowLeft } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const router = useRouter()

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
    <div class="flex flex-col items-center gap-2">
      <span class="text-8xl font-bold tracking-tighter text-muted-foreground/30">404</span>
      <h1 class="text-2xl font-semibold tracking-tight">Stranica nije pronađena</h1>
      <p class="text-sm text-muted-foreground max-w-sm">
        Stranica koju tražite ne postoji ili je premeštena.
      </p>
    </div>

    <Separator class="max-w-xs" />

    <Button @click="goBack">
      <ArrowLeft class="size-4" />
      Nazad
    </Button>
  </div>
</template>
