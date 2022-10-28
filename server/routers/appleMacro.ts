import { AppleMacro } from '@prisma/client'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const appleMacroRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      date: z.date(),
      activeEnergy: z.number().optional(),
      basalEnergy: z.number().optional(),
      exerciseTime: z.number().optional(),
      standHour: z.number().optional(),
      standTime: z.number().optional(),
      flightsClimbed: z.number().optional(),
      mindfulMinutes: z.number().optional(),
      stepCount: z.number().optional(),
      vo2Max: z.number().optional(),
      restingHeartRate: z.number().optional(),
    }),
    async resolve({ ctx, input }) {
      const appleMacro: AppleMacro = await ctx.prisma.appleMacro.upsert({
        where: {
          AppleMacro_date_authorId_unique_constraint: {
            date: input.date,
            authorId: ctx.session.user.id,
          },
        },
        create: {
          date: input.date,
          activeEnergy: input.activeEnergy,
          exerciseTime: input.exerciseTime,
          basalEnergy: input.basalEnergy,
          standHour: input.standHour,
          standTime: input.standTime,
          flightsClimbed: input.flightsClimbed,
          mindfulMinutes: input.mindfulMinutes,
          stepCount: input.stepCount,
          vo2Max: input.vo2Max,
          restingHeartRate: input.restingHeartRate,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        update: {
          activeEnergy: input.activeEnergy,
          exerciseTime: input.exerciseTime,
          basalEnergy: input.basalEnergy,
          standHour: input.standHour,
          standTime: input.standTime,
          flightsClimbed: input.flightsClimbed,
          mindfulMinutes: input.mindfulMinutes,
          stepCount: input.stepCount,
          vo2Max: input.vo2Max,
          restingHeartRate: input.restingHeartRate,
        },
      })

      return appleMacro
    },
  })
  .query('get-range', {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ ctx, input }) {
      const appleMacros = await ctx.prisma.appleMacro.findMany({
        where: {
          authorId: ctx.session.user.id,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      })

      return appleMacros
    },
  })
