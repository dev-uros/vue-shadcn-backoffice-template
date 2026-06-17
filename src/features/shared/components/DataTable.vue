<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, h, computed } from 'vue'
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DataTableColumn<T> {
  key: keyof T & string
  label: string
  sortable?: boolean
  searchable?: boolean
  align?: 'left' | 'center' | 'right'
  cell?: (row: T) => any
}

export interface DataTableRowAction<T> {
  label: string
  icon?: any
  onClick: (row: T) => void
  variant?: 'default' | 'destructive'
}

export interface DataTableBulkAction<T> {
  label: string
  icon?: any
  onClick: (rows: T[]) => void
  variant?: 'default' | 'destructive'
}

const props = defineProps<{
  data: T[]
  columns: DataTableColumn<T>[]
  rowActions?: DataTableRowAction<T>[]
  bulkActions?: DataTableBulkAction<T>[]
  searchPlaceholder?: string
  pageSize?: number
  pageSizeOptions?: number[]
}>()

const pageSizeOptions = computed(() => props.pageSizeOptions ?? [5, 10, 25, 50])

function sortIcon(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return ArrowUp
  if (sorted === 'desc') return ArrowDown
  return ArrowUpDown
}

function alignClass(align?: 'left' | 'center' | 'right') {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return undefined
}

const searchableKeys = computed(() =>
  props.columns.filter(c => c.searchable).map(c => c.key)
)

const tableColumns = computed<ColumnDef<T>[]>(() => {
  const cols: ColumnDef<T>[] = []

  cols.push({
    id: 'select',
    meta: { align: 'center' } as never,
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected()
          || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (v: boolean) => table.toggleAllPageRowsSelected(!!v),
        ariaLabel: 'Selektuj sve',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean) => row.toggleSelected(!!v),
        ariaLabel: 'Selektuj red',
      }),
    enableSorting: false,
    enableHiding: false,
  })

  for (const col of props.columns) {
    cols.push({
      accessorKey: col.key,
      meta: { align: col.align } as never,
      header: col.sortable
        ? ({ column }) =>
          h(Button, {
            variant: 'ghost',
            class: '-ml-3 h-8',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          }, () => [col.label, h(sortIcon(column.getIsSorted()), { class: 'ml-2 size-3.5' })])
        : col.label,
      cell: ({ row }) => (col.cell ? col.cell(row.original) : row.getValue(col.key)),
    })
  }

  if (props.rowActions?.length) {
    cols.push({
      id: 'actions',
      meta: { align: 'right' } as never,
      enableHiding: false,
      cell: ({ row }) =>
        h(DropdownMenu, {}, {
          default: () => [
            h(DropdownMenuTrigger, { asChild: true }, () =>
              h(Button, { variant: 'ghost', class: 'h-8 w-8 p-0' }, () =>
                h(MoreHorizontal, { class: 'size-4' }))),
            h(DropdownMenuContent, { align: 'end' }, () => [
              h(DropdownMenuLabel, {}, () => 'Akcije'),
              h(DropdownMenuSeparator),
              ...props.rowActions!.map(action =>
                h(DropdownMenuItem, {
                  onClick: () => action.onClick(row.original),
                  class: action.variant === 'destructive' ? 'text-destructive' : undefined,
                }, () =>
                  action.icon
                    ? [h(action.icon, { class: 'mr-2 size-4' }), action.label]
                    : action.label)
              ),
            ]),
          ],
        }),
    })
  }

  return cols
})

const sorting = ref<SortingState>([])
const globalFilter = ref('')
const rowSelection = ref({})
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: props.pageSize ?? 10,
})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return tableColumns.value },
  state: {
    get sorting() { return sorting.value },
    get globalFilter() { return globalFilter.value },
    get rowSelection() { return rowSelection.value },
    get pagination() { return pagination.value },
  },
  onSortingChange: (u) => {
    sorting.value = typeof u === 'function' ? u(sorting.value) : u
  },
  onGlobalFilterChange: (v) => {
    globalFilter.value = v as string
  },
  onRowSelectionChange: (u) => {
    rowSelection.value = typeof u === 'function' ? u(rowSelection.value) : u
  },
  onPaginationChange: (u) => {
    pagination.value = typeof u === 'function' ? u(pagination.value) : u
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  globalFilterFn: (row, _id, filterValue) => {
    const search = String(filterValue).toLowerCase()
    return searchableKeys.value.some(key =>
      String(row.original[key] ?? '').toLowerCase().includes(search)
    )
  },
})

const selectedCount = computed(() => table.getFilteredSelectedRowModel().rows.length)
const selectedRows = computed(() => table.getFilteredSelectedRowModel().rows.map(r => r.original))

function runBulkAction(action: DataTableBulkAction<T>) {
  action.onClick(selectedRows.value)
  rowSelection.value = {}
}

const ALL_SENTINEL = Number.MAX_SAFE_INTEGER

const pageSizeValue = computed(() =>
  pagination.value.pageSize === ALL_SENTINEL ? 'all' : String(pagination.value.pageSize)
)

function setPageSize(value: string) {
  pagination.value = {
    pageIndex: 0,
    pageSize: value === 'all' ? ALL_SENTINEL : Number(value),
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <Input
        v-if="searchableKeys.length"
        :placeholder="searchPlaceholder ?? 'Pretraga...'"
        :model-value="globalFilter"
        @update:model-value="(v: string) => (globalFilter = String(v))"
        class="max-w-sm"
      />
      <div v-else />

      <DropdownMenu v-if="bulkActions?.length && selectedCount > 0">
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Akcije ({{ selectedCount }})
            <ChevronDown class="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Masovne akcije</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-for="action in bulkActions"
            :key="action.label"
            :class="action.variant === 'destructive' ? 'text-destructive' : undefined"
            @click="runBulkAction(action)"
          >
            <component :is="action.icon" v-if="action.icon" class="mr-2 size-4" />
            {{ action.label }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="alignClass((header.column.columnDef.meta as any)?.align)"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="alignClass((cell.column.columnDef.meta as any)?.align)"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="tableColumns.length" class="h-24 text-center">
              Nema rezultata.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        {{ selectedCount }} od {{ table.getFilteredRowModel().rows.length }} redova selektovano.
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Redova po strani</span>
          <Select :model-value="pageSizeValue" @update:model-value="(v: number) => setPageSize(String(v))">
            <SelectTrigger class="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in pageSizeOptions" :key="size" :value="String(size)">
                {{ size }}
              </SelectItem>
              <SelectItem value="all">Sve</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
            Prethodna
          </Button>
          <span class="text-sm text-muted-foreground px-2">
            Strana {{ table.getState().pagination.pageIndex + 1 }} od {{ table.getPageCount() }}
          </span>
          <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
            Sledeća
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
