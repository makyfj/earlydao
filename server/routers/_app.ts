import superjson from 'superjson'
import { createRouter } from '../create-router'
import { commentRouter } from './comment'
import { postRouter } from './post'
import { userRouter } from './user'
import { emailRouter } from './email'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('post.', postRouter)
  .merge('comment.', commentRouter)
  .merge('user.', userRouter)
  .merge('email.', emailRouter)

export type AppRouter = typeof appRouter
