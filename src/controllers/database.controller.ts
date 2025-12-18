import { Request, Response } from "express";
import { databases } from "../config/appwrite";
import { ID } from "node-appwrite";
import { createProjectSchema } from "../validators/project.schema";
import { z } from "zod";

/**
 * Create Project
 */
export const createProject = async (req: Request, res: Response) => {
  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request data",
      details: parsed.error.issues
    });
  }

  const { title, description, createdBy } = parsed.data;

  try {
    const document = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!,
      ID.unique(),
      {
        title,
        description,
        createdBy,
        createdAt: new Date().toISOString()
      }
    );

    return res.status(201).json({
      success: true,
      data: document
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
};

/**
 * Get All Projects
 */
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const documents = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!
    );

    return res.status(200).json({
      success: true,
      data: documents.documents
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
};

/**
 * Get Project By ID
 */
const getProjectByIdSchema = z.object({
  id: z.string().min(1, "Project ID is required")
});

export const getProjectById = async (req: Request, res: Response) => {
  const parsed = getProjectByIdSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid project id",
      details: parsed.error.issues
    });
  }

  const { id } = parsed.data;

  try {
    const document = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!,
      id
    );

    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }
};
