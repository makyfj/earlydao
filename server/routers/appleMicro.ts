import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const appleMicroRouter = createProtectedRouter().mutation('add', {
  input: z.object({
    startTime: z.date(),
    type: z.string(),
    duration: z.string(),
    activeEnergy: z.number(),
    maxHeartRate: z.number(),
    averageHeartRate: z.number(),
  }),
  async resolve({ ctx, input }) {
    const durationArray = input.duration.split(':')
    const durationSeconds =
      +durationArray[0] * 60 * 60 + +durationArray[1] * 60 + +durationArray[2]

    const appleMicro: any = await ctx.prisma.appleMicro.upsert({
      where: {
        AppleMicro_start_authorId_unique_constraint: {
          start: input.startTime,
          authorId: ctx.session.user.id,
        },
      },
      create: {
        date: new Date(input.startTime.toISOString().split('T')[0]),
        start: input.startTime,
        type: input.type,
        duration: durationSeconds,
        activeEnergy: input.activeEnergy,
        maxHeartRate: input.maxHeartRate,
        avgHeartRate: input.averageHeartRate,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
      update: {
        date: new Date(input.startTime.toISOString().split('T')[0]),
        type: input.type,
        duration: durationSeconds,
        activeEnergy: input.activeEnergy,
        maxHeartRate: input.maxHeartRate,
        avgHeartRate: input.averageHeartRate,
      },
    })

    return appleMicro
  },
})
