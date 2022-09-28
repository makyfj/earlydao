import { Avatar } from '@/components/avatar'
import { ButtonLink } from '@/components/button-link'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { IconButton } from '@/components/icon-button'
import { Logo, SearchIcon } from '@/components/icons'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { SearchDialog } from '@/components/search-dialog'
import { capitalize } from '@/lib/text'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/button'
import { trpc } from '@/lib/trpc'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  Bars4Icon,
  BookmarkSquareIcon,
  BookOpenIcon,
  RssIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const links = [
  {
    name: 'Longevity Compendium',
    description:
      'Just science, expertise, and practical tactics to improve your health and live better for longer',
    link: 'https://longevitydocs.vercel.app',
    icon: BookOpenIcon,
  },
  {
    name: 'Decentralizing Longevity',
    description:
      'Conversations with the longevity practitioners and how they apply the principles of longevity',
    link: 'https://decentralizinglongevity.vercel.app',
    icon: RssIcon,
  },
  {
    name: 'Short-form video',
    description:
      'Instructional videos on the foundational principles of longevity',
    link: '#',
    icon: VideoCameraIcon,
  },
]

// type LayoutProps = {
//   children: React.ReactNode
// }

const features = [
  // {
  //   name: 'Invest any amount',
  //   description:
  //     'Whether it’s $1 or $1,000,000, we can put your money to work for you.',
  // },
  // {
  //   name: 'Build a balanced portfolio',
  //   description:
  //     'Invest in different industries to find the most opportunities to win huge.',
  // },
  // {
  //   name: 'Trade in real-time',
  //   description:
  //     'Get insider tips on big stock moves and act on them within seconds.',
  // },
  // {
  //   name: 'Profit from your network',
  //   description:
  //     'Invite new insiders to get tips faster and beat even other Pocket users.',
  // },
  // {
  //   name: 'Encrypted and anonymized',
  //   description:
  //     'Cutting-edge security technology that even the NSA doesn’t know about keeps you hidden.',
  // },
  // {
  //   name: 'Portfolio tracking',
  //   description:
  //     'Watch your investments grow exponentially, leaving other investors in the dust.',
  // },
]

const formClasses =
  'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm'

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-semibold text-gray-900"
    >
      {children}
    </label>
  )
}

export function TextField({ id, label, type = 'text', className, ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}

export function LandingLayout({ children }) {
  const [email, setEmail] = React.useState('')
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const addEmailMutation = trpc.useMutation('email.add')

  function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitted(true)
    addEmailMutation.mutate(
      { email },
      {
        onSuccess: () => {},
        onError: (error) => {
          toast.error(`Something went wrong: ${error.message}`)
        },
      }
    )
  }

  return (
    <>
      <section
        id="secondary-features"
        aria-label="Features for building a portfolio"
        className="py-20 sm:py-32"
      >
        <Container className={undefined}>
          <div className="mx-auto max-w-2xl text-center">
            {isSubmitted ? (
              <>
                <h2 className="text-3xl font-medium tracking-tight">
                  You&apos;ll be the first to know
                </h2>
                <p className="mt-2 text-lg text-secondary">
                  In the meantime, check out our longevity resources
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-medium tracking-tight">
                  The time to live better is now.
                </h2>
                <p className="mt-2 text-lg text-secondary">
                  EARLY is a DAO for longevity practitioners. Gain the tools,
                  insights, and frameworks you need to live longer and more
                  importantly, live better.
                </p>
                <p className="mt-2 text-lg text-secondary">
                  Early access mint coming Winter 2022
                </p>
              </>
            )}
          </div>
          {isSubmitted ? (
            <>
              <div className="items-center pt-8">
                <ul
                  role="list"
                  className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-3"
                >
                  {links.map((feature) => (
                    <li
                      key={feature.name}
                      className="rounded-2xl border border-gray-200 p-8"
                    >
                      <Link href={feature.link}>
                        <a target="_blank">
                          <feature.icon className="h-8 w-8" />
                          <h3 className="mt-2 font-semibold">{feature.name}</h3>
                          <p className="mt-2 text-secondary">
                            {feature.description}
                          </p>
                          <div
                            aria-hidden="true"
                            className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
                          >
                            Visit
                            <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="items-center pt-8">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full justify-center md:w-auto"
                >
                  <TextField
                    type="email"
                    aria-label="Email address"
                    placeholder="Email address"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-60 min-w-0 shrink"
                  />
                  <Button type="submit" color="cyan" className="ml-4 flex-none">
                    <span className="inline">Get early access</span>
                  </Button>
                </form>
              </div>
              <ul
                role="list"
                className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-3"
              >
                {features.map((feature) => (
                  <li
                    key={feature.name}
                    className="rounded-2xl border border-gray-200 p-8"
                  >
                    <h3 className="mt-2 font-semibold">{feature.name}</h3>
                    <p className="mt-2 text-secondary">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </section>
    </>
  )
}
