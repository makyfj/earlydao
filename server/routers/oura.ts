import { markdownToHtml } from '@/lib/editor'
import { postToSlackIfEnabled } from '@/lib/slack'
import { Oura } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const ouraRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      date: z.date(),
      bedTime: z.date(),
      wakeUpTime: z.date(),
      totalSleep: z.number(),
      totalAwake: z.number(),
      totalREM: z.number(),
      totalDeep: z.number(),
      sleepEfficiency: z.number(),
      latencyDuration: z.number(),
      lowestRestingHeartRate: z.number(),
      averageRestingHeartRate: z.number(),
      averageHRV: z.number(),
      temperatureDeviation: z.number(),
      respiratoryRate: z.number(),
      inactiveTime: z.number(),
      averageMET: z.number(),
    }),
    async resolve({ ctx, input }) {
      const ouraPost: Oura = await ctx.prisma.oura.upsert({
        where: {
          Oura_date_authorId_unique_constraint: {
            date: input.date,
            authorId: ctx.session.user.id,
          },
        },
        create: {
          date: input.date,
          bedTime: input.bedTime,
          wakeUpTime: input.wakeUpTime,
          totalSleep: input.totalSleep,
          totalAwake: input.totalAwake,
          totalREM: input.totalREM,
          totalDeep: input.totalDeep,
          sleepEfficiency: input.sleepEfficiency,
          latencyDuration: input.latencyDuration,
          lowestRestingHeartRate: input.lowestRestingHeartRate,
          averageRestingHeartRate: input.averageRestingHeartRate,
          averageHRV: input.averageHRV,
          temperatureDeviation: input.temperatureDeviation,
          respiratoryRate: input.respiratoryRate,
          inactiveTime: input.inactiveTime,
          averageMET: input.averageMET,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        update: {
          date: input.date,
          bedTime: input.bedTime,
          wakeUpTime: input.wakeUpTime,
          totalSleep: input.totalSleep,
          totalAwake: input.totalAwake,
          totalREM: input.totalREM,
          totalDeep: input.totalDeep,
          sleepEfficiency: input.sleepEfficiency,
          latencyDuration: input.latencyDuration,
          lowestRestingHeartRate: input.lowestRestingHeartRate,
          averageRestingHeartRate: input.averageRestingHeartRate,
          averageHRV: input.averageHRV,
          temperatureDeviation: input.temperatureDeviation,
          respiratoryRate: input.respiratoryRate,
          inactiveTime: input.inactiveTime,
          averageMET: input.averageMET,
        },
      })

      return ouraPost
    },
  })
  .query('key_metrics', {
    input: z.object({
      // take: z.number().min(1).max(50).optional(),
      // skip: z.number().min(1).optional(),
      cadence: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string(),
      improvementFlag: z.boolean().optional(),
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
      let endDateAsDate = new Date(input.endDate)
      let startDate = null
      if (input.startDate === undefined) {
        if (input.improvementFlag) {
          startDate = new Date(
            endDateAsDate.setDate(
              endDateAsDate.getDate() - cadenceMap[input.cadence!] * 2
            )
          )
          endDateAsDate = new Date(
            endDateAsDate.setDate(
              endDateAsDate.getDate() - cadenceMap[input.cadence!]
            )
          )
        } else {
          startDate = new Date(
            endDateAsDate.setDate(
              endDateAsDate.getDate() - cadenceMap[input.cadence!]
            )
          )
        }
      } else {
        startDate = new Date(input.startDate)
      }

      const entries = await ctx.prisma.oura.findMany({
        // take,
        // skip,
        where: {
          date: {
            lte: new Date(input.endDate),
            gte: startDate,
          },
          authorId: ctx.session.user.id,
        },
        select: {
          date: true,
          bedTime: true,
          wakeUpTime: true,
          totalSleep: true,
          lowestRestingHeartRate: true,
          averageRestingHeartRate: true,
          averageHRV: true,
          inactiveTime: true,
          averageMET: true,
        },
      })

      return {
        entries,
      }
    },
  })
