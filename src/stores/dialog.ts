import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDialogStore = defineStore('dialog', () => {
  const isDialogOpen = ref(false);
  const message = ref('');

  return { isDialogOpen, message };
});
