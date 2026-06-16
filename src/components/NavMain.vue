<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue"
import { ChevronRight } from "@lucide/vue"
import { ref } from 'vue'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

defineProps<{
  groupLabel: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()

const { state } = useSidebar()

const openMap = ref<Record<string, boolean>>({})
const suppressTooltip = ref<Record<string, boolean>>({})

function onOpenChange(key: string, open: boolean) {
  openMap.value[key] = open
  if (!open) {
    suppressTooltip.value[key] = true
    setTimeout(() => {
      suppressTooltip.value[key] = false
    }, 300)
  }
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ groupLabel }}</SidebarGroupLabel>
    <SidebarMenu>

      <!-- ICON MODE: fly-out dropdown sa tooltipom -->
      <template v-if="state === 'collapsed'">
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <DropdownMenu
            :open="openMap[item.title]"
            @update:open="onOpenChange(item.title, $event)"
          >
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                :tooltip="(openMap[item.title] || suppressTooltip[item.title]) ? undefined : item.title"
              >
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" class="min-w-48">
              <DropdownMenuLabel class="flex items-center gap-2">
                <component
                  :is="item.icon"
                  v-if="item.icon"
                  class="size-4 text-muted-foreground"
                />
                {{ item.title }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                v-for="subItem in item.items"
                :key="subItem.title"
                as-child
              >
                <a :href="subItem.url">{{ subItem.title }}</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </template>

      <!-- EXPANDED MODE: collapsible -->
      <template v-else>
        <Collapsible
          v-for="item in items"
          :key="item.title"
          as-child
          :default-open="item.isActive"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton :tooltip="item.title">
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                  <SidebarMenuSubButton as-child>
                    <a :href="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </template>

    </SidebarMenu>
  </SidebarGroup>
</template>
