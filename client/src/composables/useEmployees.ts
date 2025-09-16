import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { api } from "@/services/api";
import type { CreateEmployeeDto, UpdateEmployeeDto } from "@/types";
import type { ComputedRef } from "vue";
import { useAppStore } from "@/stores/app";

export function useEmployees(searchQuery: ComputedRef<string>) {
  return useQuery({
    queryKey: computed(() => ["employees", searchQuery.value]),
    queryFn: () => api.employees.getAll(searchQuery.value),
    select: (data) => data,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => api.employees.getById(id),
    select: (data) => data,
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => api.employees.create(data),
    onSuccess: (_response) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      appStore.showSuccess("Employee created successfully");
    },
    onError: (error: Error) => {
      appStore.showError(error.message || "Failed to create employee");
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
      queryClient.setQueryData(["employees", variables.id], response);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      appStore.showSuccess("Employee updated successfully");
    },
    onError: (error: Error) => {
      appStore.showError(error.message || "Failed to update employee");
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
      queryClient.removeQueries({ queryKey: ["employees", id] });
      appStore.showSuccess("Employee deleted successfully");
    },
    onError: (error: Error) => {
      appStore.showError(error.message || "Failed to delete employee");
    },
  });
}
