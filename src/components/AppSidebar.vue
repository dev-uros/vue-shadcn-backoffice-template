<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Activity,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd, Gauge,
  Map, Megaphone, Package,
  PieChart, Server,
  Settings2, ShieldCheck,
  SquareTerminal, Users, Wrench, Zap,
} from "@lucide/vue"
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navAdministration: [
    {
      title: "Korisnici",
      url: "#",
      icon: Users,

      items: [
        {
          title: "Pregled",
          url: "/users",
        },
        {
          title: "Kreiraj",
          url: "/users/create",
        },
      ],
    },
  ],
  navOperations: [
    {
      title: "Procesi",
      url: "#",
      icon: Activity,
      items: [
        { title: "Aktivni zadaci", url: "#" },
        { title: "Zakašnjeli procesi", url: "#" },
        { title: "Radni tokovi", url: "#" },
        { title: "Arhiva izvršenja", url: "#" },
      ],
    },
    {
      title: "Resursi",
      url: "#",
      icon: Server,
      items: [
        { title: "Serveri", url: "#" },
        { title: "Baze podataka", url: "#" },
        { title: "Kontejneri", url: "#" },
        { title: "Mrežna konfiguracija", url: "#" },
      ],
    },
    {
      title: "Automatizacija",
      url: "#",
      icon: Zap,
      items: [
        { title: "Cron poslovi", url: "#" },
        { title: "Webhook-ovi", url: "#" },
        { title: "Skripte", url: "#" },
        { title: "Triggeri", url: "#" },
      ],
    },
    {
      title: "Monitoring",
      url: "#",
      icon: Gauge,
      items: [
        { title: "Status uživo", url: "#" },
        { title: "Logs viewer", url: "#" },
        { title: "Upozorenja (Alerts)", url: "#" },
        { title: "Dijagnostika", url: "#" },
      ],
    },
    {
      title: "Održavanje",
      url: "#",
      icon: Wrench,
      items: [
        { title: "System Health", url: "#" },
        { title: "Update menadžer", url: "#" },
        { title: "Backup & Restore", url: "#" },
        { title: "Čišćenje keša", url: "#" },
      ],
    },
  ],
  navReports: [
    {
      title: "Analitika",
      url: "#",
      icon: PieChart,
      items: [
        { title: "Pregled prodaje", url: "#" },
        { title: "Korisničke sesije", url: "#" },
        { title: "Konverzije", url: "#" },
        { title: "Povrat investicije", url: "#" },
      ],
    },
    {
      title: "Inventar",
      url: "#",
      icon: Package,
      items: [
        { title: "Svi proizvodi", url: "#" },
        { title: "Niske zalihe", url: "#" },
        { title: "Kategorije", url: "#" },
        { title: "Dobavljači", url: "#" },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: Megaphone,
      items: [
        { title: "Kampanje", url: "#" },
        { title: "Newsletteri", url: "#" },
        { title: "SEO pregled", url: "#" },
        { title: "Analiza društvenih mreža", url: "#" },
      ],
    },
    {
      title: "Sigurnost",
      url: "#",
      icon: ShieldCheck,
      items: [
        { title: "Pristupni logovi", url: "#" },
        { title: "Korisničke dozvole", url: "#" },
        { title: "API ključevi", url: "#" },
        { title: "Backup status", url: "#" },
      ],
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain group-label="Administracija" :items="data.navAdministration" />
      <NavMain group-label="Operacije" :items="data.navOperations" />
      <NavMain group-label="Izveštaji" :items="data.navReports" />

    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
