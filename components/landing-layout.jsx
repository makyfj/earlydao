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
import Head from 'next/head'
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
  CalendarDaysIcon,
  ChartBarSquareIcon,
  TableCellsIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
// type LayoutProps = {
//   children: React.ReactNode
// }

const features = [
  {
    name: 'Track key longevity metrics',
    description:
      'Integrations with data aggregators like Apple Health, Oura, and Levels make it easy to sync your exercise, sleep, and nutrition data.',
    icon: TableCellsIcon,
  },
  {
    name: 'Rich dashboards',
    description:
      'Provide insightful, data-driven, actionable analytics about your health.',
    icon: ChartBarSquareIcon,
  },
  {
    name: 'Reflect on performance with experiments',
    description:
      "Wearables aren't so great at saying what your data means. We can add context to your data, run experiments, and create personalized action plan.",
    icon: PencilSquareIcon,
  },
  {
    name: 'Calendar-based interface',
    description:
      'Never lose track of the days. Ground yourself in the present and focus on what matters.',
    icon: CalendarDaysIcon,
  },
  {
    name: 'Longevity Compendium',
    description:
      'Curation of the best-in-class science, expertise, and practical tactics to improve your health and live better for longer from world-class experts.',
    link: 'https://longevitydocs.vercel.app',
    linkLabel: 'Read the docs',
    icon: BookOpenIcon,
  },
  {
    name: 'Decentralizing Longevity Podcast',
    description:
      'Conversations with the longevity practitioners and how they apply the principles of longevity, building the dialogue around longevity in the community.',
    link: 'https://decentralizinglongevity.vercel.app',
    linkLabel: 'Listen to the podcast',
    icon: RssIcon,
  },
  {
    name: 'Contribution incentives',
    description:
      'Earn governance tokens as you contribute to the EARLY ecosystem as an engineer, researcher, creator, or practitioner.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Community-first, privacy-forward platform',
    description:
      'Work in the open, collaborate with others and do it as yourself or a pseudonym.',
    icon: UserGroupIcon,
  },

  // {
  //   name: 'Short-form video',
  //   description:
  //     'Instructional videos on the foundational principles of longevity',
  //   icon: VideoCameraIcon,
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

    addEmailMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setIsSubmitted(true)
        },
        onError: (error) => {
          if (JSON.stringify(error).includes('Unique constraint failed')) {
            toast.error('You have already signed up!')
          } else {
            toast.error(`${error.message}`)
          }
        },
      }
    )
    setEmail('')
  }

  return (
    <>
      <Head>
        <title>EARLY - DAO for longevity practitioners</title>
        <meta
          name="description"
          content="Optimize your longevity, gain the tools, insights, and frameworks you need to live longer and more importantly, live better."
        />
      </Head>
      <section
        id="secondary-features"
        aria-label="Features for building a portfolio"
        className="py-20 sm:py-32"
      >
        <Container className={undefined}>
          <div className="mx-auto max-w-2xl text-center">
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
                Early access mint December 15, 2022
              </p>
            </>
          </div>

          <>
            <div className="items-center pt-8">
              {!isSubmitted ? (
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
              ) : (
                <p className="mt-2 text-lg text-secondary text-center">
                  You&apos;ll be the first to know!
                </p>
              )}
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
                  <feature.icon className="h-8 w-8" />

                  <h3 className="mt-2 font-semibold">{feature.name}</h3>
                  <p className="mt-2 text-secondary">{feature.description}</p>
                  {feature.link && (
                    <Link href={feature.link}>
                      <a target="_blank">
                        <div
                          aria-hidden="true"
                          className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
                        >
                          {feature.linkLabel}
                          <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
                        </div>
                      </a>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        </Container>
        <Container>
          <div className="mt-20 flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
            <div className="flex gap-x-6">
              <Link
                href="https://twitter.com/early_xyz"
                className="group"
                aria-label="EARLY on Twitter"
              >
                <a target="_blank">
                  <svg aria-hidden="true" className="h-6 w-6 fill-gray-300">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
                  </svg>
                </a>
              </Link>
              <Link
                href="https://github.com/earlydao"
                className="group"
                aria-label="EARLY on GitHub"
              >
                <a target="_blank">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 text-secondary fill-gray-300"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                  </svg>
                </a>
              </Link>
            </div>
            <p className="mt-6 text-sm text-secondary sm:mt-0">
              EARLYDAO {new Date().getFullYear()}
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
