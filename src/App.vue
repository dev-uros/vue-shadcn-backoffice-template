<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ModeToggle from "@/components/ModeToggle.vue";
import { useRoute } from 'vue-router'
import {computed} from "vue";

const route = useRoute()

const breadcrumbs = computed(() =>
  route.matched
    .filter(r => r.meta?.breadcrumb)
    .map(r => ({
      label: r.meta.breadcrumb as string,
      path: r.path || '/',
    }))
)
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
                <BreadcrumbItem>
                  <BreadcrumbPage v-if="index === breadcrumbs.length - 1">
                    {{ crumb.label }}
                  </BreadcrumbPage>
                  <BreadcrumbLink v-else :href="crumb.path">
                    {{ crumb.label }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
          <ModeToggle class="ml-auto"/>

        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <RouterView />
<!--        <div class="grid auto-rows-min gap-4 md:grid-cols-3">-->
<!--          <div class="bg-muted/50 aspect-video rounded-xl" />-->
<!--          <div class="bg-muted/50 aspect-video rounded-xl" />-->
<!--          <div class="bg-muted/50 aspect-video rounded-xl" />-->
<!--        </div>-->
<!--        <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />-->
      </div>

    </SidebarInset>
  </SidebarProvider>
</template>
