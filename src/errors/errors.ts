import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource Not Found") {
    super(404, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}
