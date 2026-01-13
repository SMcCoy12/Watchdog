import { z } from 'zod';
import { insertJudgeSchema, insertCaseSchema, insertAttendanceSchema, judges, cases, attendance } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  judges: {
    list: {
      method: 'GET' as const,
      path: '/api/judges',
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof judges.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/judges/:id',
      responses: {
        200: z.custom<typeof judges.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/judges',
      input: insertJudgeSchema,
      responses: {
        201: z.custom<typeof judges.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  cases: {
    list: {
      method: 'GET' as const,
      path: '/api/cases',
      input: z.object({
        upcoming: z.boolean().optional(),
        relevantOnly: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof cases.$inferSelect & { judge: typeof judges.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cases/:id',
      responses: {
        200: z.custom<typeof cases.$inferSelect & { judge: typeof judges.$inferSelect }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cases',
      input: insertCaseSchema,
      responses: {
        201: z.custom<typeof cases.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    analyze: { // AI Analysis trigger
      method: 'POST' as const,
      path: '/api/cases/:id/analyze',
      responses: {
        200: z.custom<typeof cases.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  attendance: {
    mark: {
      method: 'POST' as const,
      path: '/api/attendance',
      input: insertAttendanceSchema,
      responses: {
        201: z.custom<typeof attendance.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/attendance/me',
      responses: {
        200: z.array(z.custom<typeof attendance.$inferSelect & { case: typeof cases.$inferSelect }>()),
      },
    },
  },
  users: {
    leaderboard: {
      method: 'GET' as const,
      path: '/api/leaderboard',
      responses: {
        200: z.array(z.object({
          userId: z.string(),
          name: z.string(),
          points: z.number(),
          avatarUrl: z.string().nullable(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
