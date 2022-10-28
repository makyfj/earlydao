import superjson from 'superjson'
import { createRouter } from '../create-router'
import { commentRouter } from './comment'
import { postRouter } from './post'
import { userRouter } from './user'
import { emailRouter } from './email'
import { levelsRouter } from './levels'
import { ouraRouter } from './oura'
import { appleMicroRouter } from './appleMicro'
import { appleMacroRouter } from './appleMacro'
import { miscRouter } from './misc'
import * as trpc from '@trpc/server'
import { mergeRouters, publicProcedure, router } from '../trpc'
import { z } from 'zod'

export const legacyRouter = createRouter()
  .transformer(superjson)
  .merge('post.', postRouter)
  .merge('comment.', commentRouter)
  .merge('user.', userRouter)
  .merge('email.', emailRouter)
  .merge('levels.', levelsRouter)
  .merge('oura.', ouraRouter)
  .merge('apple_macro.', appleMacroRouter)
  .merge('apple_micro.', appleMicroRouter)
  .merge('misc.', miscRouter)
  .interop()

const mainRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    }),
})

export const appRouter = mergeRouters(legacyRouter, mainRouter)

export type AppRouter = typeof appRouter
