import { ThirdwebAuth } from '@thirdweb-dev/auth/next'

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  privateKey: process.env.PRIVATE_KEY,
  domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
})
