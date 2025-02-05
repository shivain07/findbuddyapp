import { NextResponse } from 'next/server';

// Middleware Type
export type NextFunction = () => Promise<void>;
export type Middleware = (
  request: Request,
  next: NextFunction
) => Promise<NextResponse | void>;

export const handler =
  (...middleware: Middleware[]) =>
  async (request: Request) => {
    let result;

    for (let i = 0; i < middleware.length; i++) {
      let nextInvoked = false;

      const next = async () => {
        nextInvoked = true;
      };

      result = await middleware[i](request, next);

      if (!nextInvoked) {
        break;
      }
    }

    if (result) return result;

    throw new Error('Your handler or middleware must return a NextResponse!');
  };