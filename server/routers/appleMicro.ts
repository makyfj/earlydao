import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'
import { AppleMicro } from '@prisma/client'

export const appleMicroRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      startTime: z.date(),
      type: z.string(),
      duration: z.number(),
      activeEnergy: z.number(),
      maxHeartRate: z.number().optional(),
      averageHeartRate: z.number().optional(),
      zone1: z.number().optional(),
      zone2: z.number().optional(),
      zone3: z.number().optional(),
      zone4: z.number().optional(),
      zone5: z.number().optional(),
      met: z.number().optional(),
    }),
    async resolve({ ctx, input }) {
      const appleMicro: AppleMicro = await ctx.prisma.appleMicro.upsert({
        where: {
          AppleMicro_start_type_authorId_unique_constraint: {
            start: input.startTime,
            type: input.type,
            authorId: ctx.session.user.id,
          },
        },
        create: {
          date: new Date(input.startTime.toISOString().split('T')[0]),
          start: input.startTime,
          type: input.type,
          duration: input.duration,
          activeEnergy: input.activeEnergy,
          maxHeartRate: input.maxHeartRate,
          avgHeartRate: input.averageHeartRate,
          zone1: input.zone1,
          zone2: input.zone2,
          zone3: input.zone3,
          zone4: input.zone4,
          zone5: input.zone5,
          met: input.met,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        update: {
          date: new Date(input.startTime.toISOString().split('T')[0]),
          start: input.startTime,
          type: input.type,
          duration: input.duration,
          activeEnergy: input.activeEnergy,
          maxHeartRate: input.maxHeartRate,
          avgHeartRate: input.averageHeartRate,
          zone1: input.zone1,
          zone2: input.zone2,
          zone3: input.zone3,
          zone4: input.zone4,
          zone5: input.zone5,
          met: input.met,
        },
      })

      return appleMicro
    },
  })
  .query('get-range', {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ ctx, input }) {
      const appleMicros = await ctx.prisma.appleMicro.findMany({
        where: {
          authorId: ctx.session.user.id,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
      })

      return appleMicros
    },
  })
