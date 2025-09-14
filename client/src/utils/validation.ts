import { z } from "zod";
import { isFutureDate } from "./date";

export const baseValidation = {
  required: z.string().min(1, "This field is required").trim(),
  email: z.email(),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .regex(
      /^[\+]?[1-9][\d\s\-\(\)]{6,19}$/,
      "Please enter a valid phone number",
    ),
  futureDate: z
    .string()
    .refine(
      (date) => isFutureDate(date),
      "Date must be today or in the future",
    ),
  name: z.string().min(1, "Name is required").max(50, "Name too long").trim(),
};

export const employeeFormSchema = z.object({
  name: baseValidation.name,
  lastName: baseValidation.name,
  email: baseValidation.email,
  phone: baseValidation.phone,
});

export const interviewFormSchema = z.object({
  employeeId: baseValidation.required,
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position too long")
    .trim(),
  date: baseValidation.futureDate,
  time: z
    .string()
    .min(1, "Time is required")
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please enter a valid time (HH:MM)",
    ),
  notes: z.string().max(500, "Notes too long").optional(),
});

export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}

function createVuetifyRules<T>(
  zodSchema: z.ZodSchema<T>,
): ((
  value: string | number | boolean | null | undefined,
) => boolean | string)[] {
  return [
    (value: string | number | boolean | null | undefined) => {
      const isOptional = zodSchema.safeParse(undefined).success;

      if (
        (value === null || value === undefined || value === "") &&
        isOptional
      ) {
        return true;
      }

      const result = zodSchema.safeParse(value);
      return (
        result.success || result.error?.issues[0]?.message || "Invalid value"
      );
    },
  ];
}

export interface FormValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

export const formValidation = {
  employee: {
    name: createVuetifyRules(baseValidation.name),
    lastName: createVuetifyRules(baseValidation.name),
    email: createVuetifyRules(baseValidation.email),
    phone: createVuetifyRules(baseValidation.phone),
  },
  interview: {
    employeeId: createVuetifyRules(baseValidation.required),
    position: createVuetifyRules(
      z
        .string()
        .min(1, "Position is required")
        .max(100, "Position too long")
        .trim(),
    ),
    date: createVuetifyRules(baseValidation.futureDate),
    time: createVuetifyRules(
      z
        .string()
        .min(1, "Time is required")
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Please enter a valid time (HH:MM)",
        ),
    ),
    notes: createVuetifyRules(z.string().max(500, "Notes too long").optional()),
  },
};
