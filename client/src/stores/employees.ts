import { defineStore } from "pinia";
import { ref } from "vue";

export const useEmployeesStore = defineStore("employees", () => {
  const searchQuery = ref("");

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const clearSearchQuery = () => {
    searchQuery.value = "";
  };

  return {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
  };
});
