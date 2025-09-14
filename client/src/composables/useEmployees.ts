import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { api } from "@/services/api";
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from "@/types";
import { useAppStore } from "@/stores/app";

export function useEmployees(search?: string) {
  return useQuery({
    queryKey: ["employees", search],
    queryFn: () => api.employees.getAll(search),
    select: (data) => data.data,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => api.employees.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => api.employees.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      appStore.showSuccess("Employee created successfully");
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
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
    onError: (error: any) => {
      appStore.showError(error.message || "Failed to delete employee");
    },
  });
}

export function useFilteredEmployees(
  employees: Employee[],
  searchQuery: string,
) {
  return computed(() => {
    if (!searchQuery.trim()) return employees;

    const query = searchQuery.toLowerCase();
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query),
    );
  });
}
