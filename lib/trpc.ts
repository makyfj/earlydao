import type { AppRouter } from '@/server/routers/_app'
import { createTRPCNext } from '@trpc/next'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import superjson from 'superjson'

import { httpBatchLink } from '@trpc/client'

export const oldTrpc = createReactQueryHooks<AppRouter>()

export const transformer = superjson

export type TQuery = keyof AppRouter['_def']['queries']

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
  TRouteKey,
  Exclude<InferQueryInput<TRouteKey>, void>
]

function getBaseUrl() {
  if (process.browser) {
    return ''
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
})
