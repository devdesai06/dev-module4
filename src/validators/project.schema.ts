import { z } from "zod";

/**
 * Schema for creating a project
 */
export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  createdBy: z.string().min(1, "createdBy is required"),
});

/**
 * Infer TypeScript type from schema
 */
export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
