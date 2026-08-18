<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, router, Link } from '@inertiajs/vue3'
import { ref, watch, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BreadcrumbItem } from '@/types'
import { ChevronsLeft, ChevronsRight, Plus, Search } from 'lucide-vue-next'
import { debounce } from 'lodash'

const props = defineProps<{
  users: any
  filters: { search?: string }
}>()

const search = ref(props.filters.search ?? '')

// 1. Definisikan fungsi debounce
const debouncedSearch = debounce((searchValue: string) => {
  router.get(
    '/admin/pengguna', 
    { search: searchValue }, 
    { 
      replace: true, 
      preserveState: true,
      preserveScroll: true 
    }
  )
}, 1000)

// 2. Gunakan watch untuk memantau perubahan input
let initialized = false
watch(search, (newValue) => {
  if (!initialized) {
    initialized = true
    return
  }
  debouncedSearch(newValue)
})

// 3. Batalkan timer saat pindah halaman
onUnmounted(() => {
  debouncedSearch.cancel()
})

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pengguna', href: '/admin/pengguna' },
]
</script>

<template>
  <Head title="Pengguna" />
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-4 space-y-4">

      <div class="flex justify-between items-center gap-3">
        <div class="relative w-full sm:w-72">
          <label for="pencarian"><Search class="absolute left-3 top-2.5 size-5 text-gray-400" /></label>
          <input id="pencarian"
            v-model="search"
            placeholder="Cari Data..."
                          class="w-full border rounded-md px-3 py-2 ps-10
                              bg-white text-gray-900
                              dark:bg-gray-800 dark:text-gray-100
                              dark:border-gray-700
                              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>                              
        <Link href="/admin/pengguna/create">
          <Button><Plus class="size-5"/></Button>
        </Link>
      </div>

      <div class="bg-background rounded-lg overflow-x-auto">
      <table class="w-full text-sm ">
        <thead class="bg-muted-foreground text-white">
          <tr>
            <th class="p-2 text-left">No.</th>
            <th class="p-2 text-left">Nama</th>
            <th class="p-2">Phone</th>
            <th class="p-2">Email</th>
            <th class="p-2">Kelas</th>
            <th class="p-2">Provinsi</th>
            <th class="p-2">Kab/Kota</th>
            <th class="p-2">Kecamatan</th>
            <th class="p-2">Desa</th>
            <th class="p-2 text-center">Status</th>
            <th class="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, i)  in users.data" :key="u.id" class="border-t">
            <td class="p-2">{{ users.from + i }}</td>
            <td class="p-2 whitespace-nowrap">{{ u.name }}</td>
            <td class="p-2">{{ u.phone }}</td>
            <td class="p-2 whitespace-nowrap">{{ u.email }}</td>
            <td class="p-2">{{ u.class }}</td>
            <td class="p-2 whitespace-nowrap">{{ u.province?.name }}</td>
            <td class="p-2 whitespace-nowrap">{{ u.city_relation?.name }}</td>
            <td class="p-2 whitespace-nowrap">{{ u.district_relation?.name }}</td>
            <td class="p-2 whitespace-nowrap">{{ u.village_relation?.name }}</td>
            <td class="p-2 text-center">
              {{ u.is_active == true  ? 'Aktif' : 'Nonaktif' }}
            </td>
            <td class="p-2 text-center">
              <Link :href="`/admin/pengguna/${u.id}/edit`">
                <Button size="sm" variant="outline">Edit</Button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- PAGINATION -->
      <div
        v-if="users.links"
        class="flex justify-center mt-4"
      >
        <nav
          class="flex items-center gap-1 text-sm
                overflow-x-auto whitespace-nowrap px-2 pb-3
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >

          <!-- FIRST PAGE -->
          <Link
            v-if="users.links[1]?.url"
            :href="users.links[1].url"
            preserve-scroll
            preserve-state
            class="px-3 py-1 rounded bg-muted hover:text-blue-500"
          >
            <ChevronsLeft class="w-4 h-4" />
          </Link>

          <!-- NUMBERED PAGES -->
          <template
            v-for="(link, i) in users.links.filter(l => /^\d+$/.test(l.label))"
            :key="i"
          >
            <Link
              v-if="link.url"
              :href="link.url"
              preserve-scroll
              preserve-state
              class="px-3 py-1 rounded bg-muted hover:text-blue-500"
              :class="{
                'bg-primary text-primary-foreground font-semibold': link.active
              }"
            >
              {{ link.label }}
            </Link>

            <span
              v-else
              class="px-3 py-1 rounded opacity-50"
            >
              {{ link.label }}
            </span>
          </template>

          <!-- LAST PAGE -->
          <Link
            v-if="users.links[users.links.length - 2]?.url"
            :href="users.links[users.links.length - 2].url"
            preserve-scroll
            preserve-state
            class="px-3 py-1 rounded bg-muted hover:text-blue-500"
          >
            <ChevronsRight class="w-4 h-4" />
          </Link>

        </nav>
      </div>


    </div>
  </AppLayout>
</template>
