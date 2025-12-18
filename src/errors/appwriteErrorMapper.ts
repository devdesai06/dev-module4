import { AppwriteException } from "node-appwrite";
import { BadRequestError, NotFoundError, InternalServerError } from "./errors";

export const mapAppwriteError = (error: unknown) => {
  if (error instanceof AppwriteException) {
    if (error.code === 404) {
      return new NotFoundError("Project not found");
    }

    if (error.code === 400) {
      return new BadRequestError(error.message);
    }

    return new InternalServerError("Appwrite service error");
  }

  return new InternalServerError("Unexpected server error");
};
