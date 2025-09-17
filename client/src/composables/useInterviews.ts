import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/services/api";
import type { CreateInterviewDto } from "@/types";
import { useAppStore } from "@/stores/app";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: () => api.interviews.getAll(),
    staleTime: STALE_TIME,
  });
}

export function useEmployeeInterviews(employeeId: string) {
  return useQuery({
    queryKey: ["interviews", "employee", employeeId],
    queryFn: () => api.interviews.getByEmployeeId(employeeId),
    enabled: !!employeeId,
    staleTime: STALE_TIME,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  const appStore = useAppStore();

  return useMutation({
    mutationFn: (data: CreateInterviewDto) => api.interviews.create(data),
    onSuccess: (_response, variables) => {
      // Invalidate all interviews queries
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      // Invalidate the employee query (which includes interviews)
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.userId],
      });
      appStore.showSuccess("Interview scheduled successfully");
    },
  });
}
