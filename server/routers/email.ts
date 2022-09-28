import { markdownToHtml } from '@/lib/editor'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../create-router'

export const emailRouter = createRouter().mutation('add', {
  input: z.object({
    email: z.string(),
  }),
  async resolve({ ctx, input }) {
    const email = await ctx.prisma.email.create({
      data: {
        email: input.email,
      },
    })

    return email
  },
})
