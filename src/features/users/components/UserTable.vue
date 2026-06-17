<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import {Mail, UserPen} from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import DataTable, { type DataTableColumn, type DataTableRowAction, type DataTableBulkAction } from "@/features/shared/components/DataTable.vue";

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
  { id: '1', name: 'Ana Jovanović', email: 'ana.jovanovic@example.com', role: 'admin', status: 'active', createdAt: '2025-01-12' },
  { id: '2', name: 'Marko Petrović', email: 'marko.petrovic@example.com', role: 'editor', status: 'active', createdAt: '2025-02-03' },
  { id: '3', name: 'Jovana Ilić', email: 'jovana.ilic@example.com', role: 'viewer', status: 'invited', createdAt: '2025-02-20' },
  { id: '4', name: 'Nikola Stanković', email: 'nikola.stankovic@example.com', role: 'editor', status: 'disabled', createdAt: '2025-03-01' },
  { id: '5', name: 'Milica Đorđević', email: 'milica.djordjevic@example.com', role: 'viewer', status: 'active', createdAt: '2025-03-15' },
  { id: '6', name: 'Stefan Pavlović', email: 'stefan.pavlovic@example.com', role: 'admin', status: 'active', createdAt: '2025-03-22' },
  { id: '7', name: 'Tamara Nikolić', email: 'tamara.nikolic@example.com', role: 'viewer', status: 'invited', createdAt: '2025-04-02' },
  { id: '8', name: 'Aleksandar Lukić', email: 'aleksandar.lukic@example.com', role: 'editor', status: 'active', createdAt: '2025-04-18' },
  { id: '9', name: 'Ivana Marković', email: 'ivana.markovic@example.com', role: 'viewer', status: 'disabled', createdAt: '2025-05-05' },
  { id: '10', name: 'Filip Radović', email: 'filip.radovic@example.com', role: 'admin', status: 'active', createdAt: '2025-05-19' },
  { id: '11', name: 'Sara Kostić', email: 'sara.kostic@example.com', role: 'viewer', status: 'active', createdAt: '2025-05-30' },
  { id: '12', name: 'Vladimir Tomić', email: 'vladimir.tomic@example.com', role: 'editor', status: 'invited', createdAt: '2025-06-04' },
])

const statusVariant = { active: 'default', invited: 'secondary', disabled: 'outline' } as const

const columns: DataTableColumn<UserRow>[] = [
  { key: 'name', label: 'Ime', sortable: true, searchable: true, align: 'left' },
  { key: 'email', label: 'Email', searchable: true },
  { key: 'role', label: 'Uloga', align: 'left' },
  {
    key: 'status',
    label: 'Status',
    cell: (row) => h(Badge, { variant: statusVariant[row.status] }, () => row.status),
  },
  { key: 'createdAt', label: 'Kreiran', sortable: true },
]

const rowActions: DataTableRowAction<UserRow>[] = [
  { label: 'Otvori detalje', icon: UserPen, onClick: (user) => router.push(`/users/${user.id}`) },
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
    :pageSizeOptions="[10, 20, 50, 100]"
  />
</template>
