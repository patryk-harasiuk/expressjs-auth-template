/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler, Response, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ZodError, ZodSchema, ZodType, ZodTypeDef, z } from 'zod';
import { HTTPCode } from '../types/http.js';

type RequestValidation<TParams, TQuery, TBody> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  body?: ZodSchema<TBody>;
};

type ErrorListItem = {
  type: `${'Body' | 'Params' | 'Query'} validation error`;
  errors: ZodError<any>;
};

export type TypedRequest<
  TBody extends ZodType<any, ZodTypeDef, any>,
  TParams extends ZodType<any, ZodTypeDef, any>,
  TQuery extends ZodType<any, ZodTypeDef, any>
> = Request<z.infer<TParams>, any, z.infer<TBody>, z.infer<TQuery>>;

export type TypedRequestBody<TBody extends ZodType<any, ZodTypeDef, any>> =
  Request<ParamsDictionary, any, z.infer<TBody>, any>;

export type TypedRequestQuery<TQuery extends ZodType<any, ZodTypeDef, any>> =
  Request<ParamsDictionary, any, any, z.infer<TQuery>>;

const sendErrors: (errors: ErrorListItem[], res: Response) => void = (
  errors,
  res
) =>
  res
    .status(HTTPCode.BAD_REQUEST)
    .send(errors.map(error => ({ type: error.type, errors: error.errors })));

export const validateRequest: <TParams = any, TQuery = any, TBody = any>(
  schemas: RequestValidation<TParams, TQuery, TBody>
) => RequestHandler<TParams, any, TBody, TQuery> =
  ({ params, query, body }) =>
  (req, res, next) => {
    const errors: ErrorListItem[] = [];

    if (params) {
      const parsed = params.safeParse(req.params);
      if (parsed.success === false)
        errors.push({ type: 'Params validation error', errors: parsed.error });
    }

    if (query) {
      const parsed = query.safeParse(req.query);
      if (parsed.success === false)
        errors.push({ type: 'Query validation error', errors: parsed.error });
    }

    if (body) {
      const parsed = body.safeParse(req.body);
      if (parsed.success === false)
        errors.push({ type: 'Body validation error', errors: parsed.error });
    }

    if (errors.length > 0) return sendErrors(errors, res);

    next();
  };
