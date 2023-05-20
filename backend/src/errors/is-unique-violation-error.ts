import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODES } from '../shared/prisma-error-codes.js';

export const isUniqueViolationError = (error: any | unknown) =>
  error instanceof PrismaClientKnownRequestError &&
  error.code === PRISMA_ERROR_CODES.UNIQUE_VIOLATION;
