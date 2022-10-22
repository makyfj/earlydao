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
  .query('key_metrics', {
    input: z.object({
      // take: z.number().min(1).max(50).optional(),
      // skip: z.number().min(1).optional(),
      cadence: z.string(),
      endDate: z.string(),
    }),
    async resolve({ input, ctx }) {
      // const take = input?.take ?? 50
      // const skip = input?.skip
      const cadenceMap: any = {
        weekly: 7,
        monthly: 30,
        quarterly: 120,
        annually: 365,
      }
      const endDateAsDate = new Date(input.endDate)
      const startDate = new Date(
        endDateAsDate.setDate(
          endDateAsDate.getDate() - cadenceMap[input.cadence]
        )
      )

      const entries = await ctx.prisma.appleMacro.findMany({
        // take,
        // skip,
        where: {
          date: {
            // lte: endDateAsDate,
            // gte: startDate,
            lte: new Date(input.endDate),
            gte: startDate,
          },
          authorId: ctx.session.user.id,
        },
        select: {
          date: true,
          activeEnergy: true,
          exerciseTime: true,
          standHour: true,
          standTime: true,
          flightsClimbed: true,
          mindfulMinutes: true,
          stepCount: true,
          vo2Max: true,
        },
      })

      return {
        entries,
      }
    },
  })
