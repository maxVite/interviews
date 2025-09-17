import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.string(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastNames: z
    .string()
    .min(1, "Last names are required")
    .max(100, "Last names too long"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateEmployeeSchema = EmployeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export const InterviewSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position too long"),
  scheduledAt: z.string(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  notes: z.string().max(500, "Notes too long").optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateInterviewSchema = InterviewSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const InterviewSummarySchema = z.object({
  id: z.string(),
  position: z.string(),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  scheduledAt: z.string(),
  createdAt: z.string(),
});

export const EmployeeDetailsSchema = EmployeeSchema.extend({
  interviews: z.array(InterviewSummarySchema),
});

export type Employee = z.infer<typeof EmployeeSchema>;
export type EmployeeDetails = z.infer<typeof EmployeeDetailsSchema>;
export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeSchema>;
export type Interview = z.infer<typeof InterviewSchema>;
export type InterviewSummary = z.infer<typeof InterviewSummarySchema>;
export type CreateInterviewDto = z.infer<typeof CreateInterviewSchema>;
export type ApiResponse<T> = { data: T; message?: string };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public field?: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
