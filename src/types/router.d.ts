import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: { label: string; path?: string }[]
  }
}
