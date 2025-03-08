<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDialogStore } from '@/stores/dialog';

const dialogStore = useDialogStore();
const { isDialogOpen, message } = storeToRefs(dialogStore);
</script>

<template>
  <v-dialog v-model="isDialogOpen" width="auto">
    <v-card max-width="400" :text="message">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="isDialogOpen = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
