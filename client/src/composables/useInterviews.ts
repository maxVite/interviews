import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { api } from "@/services/api";
import type { Interview, CreateInterviewDto } from "@/types";
import { useAppStore } from "@/stores/app";

export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: () => api.interviews.getAll(),
    select: (data) => data.data,
  });
}

export function useEmployeeInterviews(employeeId: string) {
  return useQuery({
    queryKey: ["interviews", "employee", employeeId],
    queryFn: () => api.interviews.getByEmployeeId(employeeId),
    select: (data) => data.data,
    enabled: !!employeeId,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (data: CreateInterviewDto) => api.interviews.create(data),
    onSuccess: (response, variables) => {
      // Invalidate interviews queries
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({
        queryKey: ["interviews", "employee", variables.employeeId],
      });
      appStore.showSuccess("Interview scheduled successfully");
    },
    onError: (error: any) => {
      appStore.showError(error.message || "Failed to schedule interview");
    },
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Interview> }) =>
      api.interviews.update(id, data),
    onSuccess: (response) => {
      // Invalidate all interview queries
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      appStore.showSuccess("Interview updated successfully");
    },
    onError: (error: any) => {
      appStore.showError(error.message || "Failed to update interview");
    },
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (id: string) => api.interviews.delete(id),
    onSuccess: () => {
      // Invalidate all interview queries
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      appStore.showSuccess("Interview cancelled successfully");
    },
    onError: (error: any) => {
      appStore.showError(error.message || "Failed to cancel interview");
    },
  });
}

export function useInterviewFilters(interviews: Interview[]) {
  const upcomingInterviews = computed(() => {
    const now = new Date();
    return interviews
      .filter((interview) => {
        const scheduledDate = new Date(interview.scheduledAt);
        return scheduledDate > now && interview.status === "scheduled";
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
  });

  const completedInterviews = computed(() =>
    interviews.filter((interview) => interview.status === "completed")
  );

  const cancelledInterviews = computed(() =>
    interviews.filter((interview) => interview.status === "cancelled")
  );

  return {
    upcomingInterviews,
    completedInterviews,
    cancelledInterviews,
  };
}
