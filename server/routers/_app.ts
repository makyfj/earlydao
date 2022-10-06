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

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('post.', postRouter)
  .merge('comment.', commentRouter)
  .merge('user.', userRouter)
  .merge('email.', emailRouter)
  .merge('levels.', levelsRouter)
  .merge('oura.', ouraRouter)
  .merge('apple_macro.', appleMacroRouter)
  .merge('apple_micro.', appleMicroRouter)

export type AppRouter = typeof appRouter
