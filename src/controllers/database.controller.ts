import { Request, Response, NextFunction } from "express";
import { databases } from "../config/appwrite";
import { ID } from "node-appwrite";
import { z } from "zod";

import { createProjectSchema } from "../validators/project.schema";
import { BadRequestError } from "../errors/errors";
import { mapAppwriteError } from "../errors/appwriteErrorMapper";

/**
 * Create Project
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return next(
      new BadRequestError("Invalid request data")
    );
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
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get All Projects
 */
export const getAllProjects = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!
    );

    return res.status(200).json({
      success: true,
      data: documents.documents
    });
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Validation schema for project ID
 */
const getProjectByIdSchema = z.object({
  id: z.string().min(1, "Project ID is required")
});

/**
 * Get Project By ID
 */
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = getProjectByIdSchema.safeParse(req.params);

  if (!parsed.success) {
    return next(
      new BadRequestError("Invalid project id")
    );
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
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};
