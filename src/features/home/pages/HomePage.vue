<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, ArrowRight } from '@lucide/vue'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

const user = ref({ name: 'Maja Petrović' })
const router = useRouter()

interface RecentPage {
  title: string
  path: string
  visitedAt: number
}

const now = Date.now()

const recentPages = ref<RecentPage[]>([
  { title: 'Proizvodi', path: '/products', visitedAt: now - 1000 * 60 * 3 },
  { title: 'Korisnici', path: '/users', visitedAt: now - 1000 * 60 * 47 },
  { title: 'Narudžbine', path: '/orders', visitedAt: now - 1000 * 60 * 60 * 2 },
  { title: 'Izveštaji', path: '/reports', visitedAt: now - 1000 * 60 * 60 * 26 },
  { title: 'Podešavanja', path: '/settings', visitedAt: now - 1000 * 60 * 60 * 50 },
])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Dobro jutro'
  if (hour < 18) return 'Dobar dan'
  return 'Dobro veče'
})

function formatTime(timestamp: number) {
  const diffMin = Math.floor((Date.now() - timestamp) / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)
  if (diffMin < 1) return 'Malopre'
  if (diffMin < 60) return `Pre ${diffMin} min`
  if (diffH < 24) return `Pre ${diffH} h`
  if (diffD === 1) return 'Juče'
  return `Pre ${diffD} dana`
}
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ greeting }}, {{ user.name }} 👋
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Dobrodošli u backoffice.
      </p>
    </div>

    <Separator />

    <div v-if="recentPages.length > 0">
      <div class="flex items-center gap-2 mb-3">
        <Clock class="size-4 text-muted-foreground" />
        <span class="text-sm font-medium">Nedavno posećeno</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="page in recentPages"
          :key="page.path"
          class="cursor-pointer hover:bg-muted/50 transition-colors"
          @click="router.push(page.path)"
        >
          <CardContent class="flex items-center justify-between p-4">
            <div class="flex flex-col gap-0.5">
              <span class="text-sm font-medium">{{ page.title }}</span>
              <span class="text-xs text-muted-foreground">{{ formatTime(page.visitedAt) }}</span>
            </div>
            <ArrowRight class="size-4 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      </div>
    </div>

    <p v-else class="text-sm text-muted-foreground">
      Nema nedavno posećenih stranica.
    </p>
  </div>
</template>
