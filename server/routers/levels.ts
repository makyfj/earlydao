import { Levels } from '@prisma/client'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const levelsRouter = createProtectedRouter().mutation('add', {
  input: z.object({
    time: z.date(),
    notes: z.string().min(1),
    link: z.string().optional(),
    type: z.string(),
  }),
  async resolve({ ctx, input }) {
    const levelsPost: Levels = await ctx.prisma.levels.upsert({
      where: {
        Levels_localTime_authorId_unique_constraint: {
          localTime: input.time,
          authorId: ctx.session.user.id,
        },
      },
      create: {
        date: new Date(input.time.toISOString().split('T')[0]),
        localTime: input.time,
        notes: input.notes,
        link: input.link,
        type: input.type,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
      update: {
        date: new Date(input.time.toISOString().split('T')[0]),
        notes: input.notes,
        link: input.link,
        type: input.type,
      },
    })

    return levelsPost
  },
})
