export class ApiError extends Error {
  constructor(message: string, public readonly code?: number) {
    super(message);

    this.code = code;
  }
}
