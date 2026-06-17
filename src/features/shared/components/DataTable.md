# DataTable

Reusable, generička tabela komponenta bazirana na [TanStack Table](https://tanstack.com/table/latest) i shadcn-vue UI primitivima. Podržava sortiranje, globalni search, single/bulk selekciju i konfigurabilne akcije — sve client-side.

## Preduslovi

Komponenta koristi `generic="T extends Record<string, any>"` na `<script setup>`, što zahteva Vue ≥ 3.3 i noviju verziju `@vue/language-tools` (Volar) za pravilnu IDE podršku.

## Lokacija

```
src/components/DataTable.vue
```

## Props

| Prop | Tip | Obavezno | Opis |
|---|---|---|---|
| `data` | `T[]` | da | Niz redova za prikaz |
| `columns` | `DataTableColumn<T>[]` | da | Definicija kolona |
| `rowActions` | `DataTableRowAction<T>[]` | ne | Akcije po jednom redu (⋮ dropdown na kraju reda) |
| `bulkActions` | `DataTableBulkAction<T>[]` | ne | Akcije nad selektovanim redovima (dugme se pojavljuje samo kad je nešto selektovano) |
| `searchPlaceholder` | `string` | ne | Placeholder za search input |
| `pageSize` | `number` | ne | Broj redova po strani (default: `10`) |

## DataTableColumn<T>

```ts
interface DataTableColumn<T> {
  key: keyof T & string   // ključ u objektu reda
  label: string           // tekst u header-u
  sortable?: boolean      // da li kolona ima sort dugme
  searchable?: boolean    // da li ulazi u globalni search
  cell?: (row: T) => any  // custom render (h() ili tekst), default: row.getValue(key)
}
```

Globalni search pretražuje **samo** kolone sa `searchable: true`, case-insensitive, preko `String(value).toLowerCase().includes(search)`.

## DataTableRowAction<T> / DataTableBulkAction<T>

```ts
interface DataTableRowAction<T> {
  label: string
  icon?: any                    // Lucide ikonica komponenta
  onClick: (row: T) => void     // poziva se sa JEDNIM redom
  variant?: 'default' | 'destructive'
}

interface DataTableBulkAction<T> {
  label: string
  icon?: any
  onClick: (rows: T[]) => void  // poziva se sa NIZOM selektovanih redova
  variant?: 'default' | 'destructive'
}
```

Razlika u signaturi `onClick` postoji namerno — row akcija uvek radi sa tačno jednim redom (TypeScript zna to bez `undefined` provera), bulk akcija sa nizom.

Nakon izvršene bulk akcije, selekcija se automatski čisti (`rowSelection` se resetuje).

## Primer korišćenja

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { Mail } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import DataTable, {
  type DataTableColumn,
  type DataTableRowAction,
  type DataTableBulkAction,
} from '@/components/DataTable.vue'

interface UserRow {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'invited' | 'disabled'
  createdAt: string
}

const router = useRouter()

const data = ref<UserRow[]>([
  { id: '1', name: 'Ana Jovanović', email: 'ana@example.com', role: 'admin', status: 'active', createdAt: '2025-01-12' },
  // ...
])

const statusVariant = { active: 'default', invited: 'secondary', disabled: 'outline' } as const

const columns: DataTableColumn<UserRow>[] = [
  { key: 'name', label: 'Ime', sortable: true, searchable: true },
  { key: 'email', label: 'Email', searchable: true },
  { key: 'role', label: 'Uloga' },
  {
    key: 'status',
    label: 'Status',
    cell: (row) => h(Badge, { variant: statusVariant[row.status] }, () => row.status),
  },
  { key: 'createdAt', label: 'Kreiran', sortable: true },
]

const rowActions: DataTableRowAction<UserRow>[] = [
  { label: 'Otvori detalje', onClick: (user) => router.push(`/users/${user.id}`) },
  { label: 'Ponovo pošalji welcome email', icon: Mail, onClick: (user) => console.log('resend', [user]) },
]

const bulkActions: DataTableBulkAction<UserRow>[] = [
  { label: 'Ponovo pošalji welcome email', icon: Mail, onClick: (users) => console.log('resend', users) },
]
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :rowActions="rowActions"
    :bulkActions="bulkActions"
    searchPlaceholder="Pretraga po imenu ili emailu..."
  />
</template>
```

## Poznate napomene

**Volar + camelCase props** — kod generičkih komponenti, Volar ume da ne prepozna kebab-case prop nazive (`:row-actions`). Koristi camelCase u template-u (`:rowActions`, `:bulkActions`, `:searchPlaceholder`) dok ne ažuriraš `@vue/language-tools` na noviju verziju koja ovo ispravno hendluje.

**`noUncheckedIndexedAccess`** — ako imaš ovu opciju u `tsconfig.json`, destrukturiranje niza (`[user] = users`) bi vraćalo `T | undefined`. Zato `DataTableRowAction.onClick` prima `row: T` direktno, a ne `rows: T[]` — izbegava se taj problem u korenu.

**Sve je client-side** — sortiranje, filtriranje i paginacija se rade nad celim `data` nizom u browseru. Za velike skupove podataka (hiljade redova) ovo nije idealno.

## Planirano (još nije implementirano)

- **Server-side paginacija** — `manualPagination`, `manualSorting`, `manualFiltering` opcije iz TanStacka, sa debounced search koji okida API pozive
- **Infinite scroll varijanta** — sa `IntersectionObserver` umesto dugmića za stranice, server-side fetch po batch-u