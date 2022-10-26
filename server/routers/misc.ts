import { Misc } from '@prisma/client'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const miscRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      date: z.date(),
      weight: z.number().optional(),
    }),
    async resolve({ ctx, input }) {
      const miscPost: Misc = await ctx.prisma.misc.upsert({
        where: {
          Misc_date_authorId_unique_constraint: {
            date: input.date,
            authorId: ctx.session.user.id,
          },
        },
        create: {
          date: input.date,
          weight: input.weight,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        update: {
          date: input.date,
          weight: input.weight,
        },
      })

      return miscPost
    },
  })
  .query('get-range', {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ ctx, input }) {
      const miscs = await ctx.prisma.misc.findMany({
        where: {
          authorId: ctx.session.user.id,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
      })

      return miscs
    },
  })
