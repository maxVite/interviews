import { ApiError } from "@/types";
import { handleError, classifyError, ErrorTypes } from "@/utils/errorHandling";
import type {
  Employee,
  Interview,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  CreateInterviewDto,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Network error",
        code: "NETWORK_ERROR",
      }));

      const apiError = new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.field,
        errorData.code,
      );

      const errorType = classifyError(apiError);

      const shouldShowNotification = ![
        ErrorTypes.VALIDATION,
        ErrorTypes.AUTHENTICATION,
      ].includes(errorType as any);

      handleError(apiError, "API Request", {
        showNotifications: shouldShowNotification,
        logErrors: true,
      });

      throw apiError;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const networkError = new ApiError(
      "Network error - please check your connection",
      0,
      undefined,
      "NETWORK_ERROR",
    );

    handleError(networkError, "API Network", {
      showNotifications: true,
      logErrors: true,
    });

    throw networkError;
  }
}

export const api = {
  employees: {
    getAll: (search?: string) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const query = params.toString() ? `?${params.toString()}` : "";
      return fetchApi<Employee[]>(`/employees${query}`);
    },

    getById: (id: string) => fetchApi<Employee>(`/employees/${id}`),

    create: (data: CreateEmployeeDto) => {
      return fetchApi<Employee>("/employees", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: UpdateEmployeeDto) => {
      return fetchApi<Employee>(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: (id: string) =>
      fetchApi<void>(`/employees/${id}`, {
        method: "DELETE",
      }),
  },

  interviews: {
    getAll: () => fetchApi<Interview[]>(`/interviews`),

    getByEmployeeId: (employeeId: string) =>
      fetchApi<Interview[]>(`/interviews?userId=${employeeId}`),

    create: (data: CreateInterviewDto) => {
      return fetchApi<Interview>("/interviews", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: Partial<Interview>) =>
      fetchApi<Interview>(`/interviews/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchApi<void>(`/interviews/${id}`, {
        method: "DELETE",
      }),
  },
};

export { ApiError };
