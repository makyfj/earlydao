import { markdownToHtml } from '@/lib/editor'
import { postToSlackIfEnabled } from '@/lib/slack'
import { Oura } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const ouraRouter = createProtectedRouter().mutation('add', {
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
