import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import { api } from "@/services/api";
import type { CreateEmployeeDto, UpdateEmployeeDto } from "@/types";
import { useAppStore } from "@/stores/app";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useEmployees(searchQuery?: ComputedRef<string>) {
  return useQuery({
    queryKey: computed(() => ["employees", searchQuery?.value]),
    queryFn: () => api.employees.getAll(searchQuery?.value),
    staleTime: STALE_TIME,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => api.employees.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => api.employees.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.setQueryData(["employee", response.id], response);
      appStore.showSuccess("Employee created successfully");
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
      api.employees.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["employee", variables.id], response);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      appStore.showSuccess("Employee updated successfully");
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (id: string) => api.employees.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.removeQueries({ queryKey: ["employee", id] });
      appStore.showSuccess("Employee deleted successfully");
    },
  });
}
