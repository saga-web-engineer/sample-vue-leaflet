<script setup lang="ts">
import { RouterView } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main>
      <router-view />
    </v-main>
    <v-footer class="justify-center" height="60">
      <p><small>&copy; 2025 〇×△□</small></p>
    </v-footer>
  </v-app>
</template>
