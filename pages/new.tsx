import { Layout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import {
  eachQuarterOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  isWithinInterval,
  startOfQuarter,
  startOfWeek,
  startOfMonth,
  endOfQuarter,
  endOfMonth,
  endOfWeek,
  getWeek,
  getMonth,
  getQuarter,
} from 'date-fns'
import { Button } from '@/components/button'
import { RadioGroup } from '@headlessui/react'

function CheckIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const intervals = {
  Weekly: eachWeekOfInterval({
    start: new Date(),
    end: new Date(),
  }),
  Monthly: eachMonthOfInterval({
    start: new Date(),
    end: new Date(),
  }),
  Quarterly: eachQuarterOfInterval({
    start: new Date(),
    end: new Date(),
  }),
}

// iterate over each interval and check if it's within the specified range for the interval
// if it is, then the user can create a post for that interval
// if it's not, then the user can't create a post for that interval
// if the user can create a post, check if they have already created a post for that interval
// if they have, then they can't create a post for that interval

// if the user can create a post, then show the post form after they select the interval
// disable the form for the interval if the user has already created a post for that interval or if it is not within the last 3 days
// if they have already created a post for that interval, then show a message saying that they have already created a post for that interval and link to the post
// if deadline has passed, then show a message saying that the deadline has passed and display next date that the user can create a post for that interval
const cadenceOptions: {
  name: string
  number: string
  range: string
  disabled: boolean
  message: string
  endDate?: Date
}[] = []
for (const [key, value] of Object.entries(intervals)) {
  let start = new Date().setDate(new Date().getDate() - 0)
  let number = ``
  let rangeStart = new Date()
  let rangeEnd = value[0].setDate(value[0].getDate() - 1)
  let next = null
  if (key === 'Quarterly') {
    start = new Date().setDate(new Date().getDate() - 7)
    rangeStart = startOfQuarter(rangeEnd)
    number = `Q${getQuarter(rangeEnd)}`
    next = endOfQuarter(new Date())
  } else if (key === 'Monthly') {
    start = new Date().setDate(new Date().getDate() - 3)
    rangeStart = startOfMonth(rangeEnd)
    number = `M${getMonth(rangeEnd) + 1}`
    next = endOfMonth(new Date())
  } else if (key === 'Weekly') {
    start = new Date().setDate(new Date().getDate() - 5)
    rangeStart = startOfWeek(rangeEnd)
    number = `W${getWeek(rangeEnd)}`
    next = endOfWeek(new Date())
  }
  if (
    isWithinInterval(value[0], {
      start: start,
      end: new Date(),
    })
  ) {
    cadenceOptions.push({
      name: key,
      number: number,
      range: `${rangeStart.toLocaleDateString()} - ${new Date(
        rangeEnd
      ).toLocaleDateString()}`,
      disabled: false,
      message: `Create a ${key.toLowerCase()} post for ${number}`,
    })
  } else {
    cadenceOptions.push({
      name: key,
      number: number,
      range: `${rangeStart.toLocaleDateString()} - ${value[0].toLocaleDateString()}`,
      disabled: true,
      message: `Post deadline for ${number} has passed. Next period is ${next!.toLocaleDateString()}.`,
    })
  }
}

const NewPostPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addPostMutation = trpc.useMutation('post.add', {
    onError: (error) => {
      if (error.message.includes('Unique constraint failed')) {
        toast.error(`Post already exists for this date range and cadence.`)
        setIsLoading(false)
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  })
  const [selectedCadence, setSelectedCadence] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <>
      <Head>
        <title>New Post - EARLY</title>
      </Head>

      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        New post
      </h1>

      <div className="w-full px-4 py-16">
        <div className="mx-auto w-full max-w-md">
          <RadioGroup
            value={selectedCadence}
            onChange={(cadence) => setSelectedCadence(cadence)}
          >
            <RadioGroup.Label className="sr-only">
              Post cadence
            </RadioGroup.Label>
            <div className="space-y-2">
              {cadenceOptions.map((cadence) => (
                <RadioGroup.Option
                  key={cadence.name}
                  value={cadence.name}
                  disabled={cadence.disabled}
                  className={({ active, checked }) =>
                    `${
                      active
                        ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                        : ''
                    }
                  ${
                    checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={`font-medium  ${
                                checked ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {cadence.name}{' '}
                              <span aria-hidden="true">&middot;</span>{' '}
                              {cadence.range}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className={`inline ${
                                checked ? 'text-sky-100' : 'text-gray-500'
                              }`}
                            >
                              <span>{cadence.message}</span>{' '}
                              {/* <span aria-hidden="true">&middot;</span>{' '}
                            <span>{plan.disk}</span> */}
                            </RadioGroup.Description>
                          </div>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-white">
                            <CheckIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div>
          <Button
            onClick={async () => {
              const selectedOption = cadenceOptions.find(
                (c) => c.name === selectedCadence
              )
              setIsLoading(true)
              //TODO: pull data from user during data range and send to GPT-3
              // pull data for cadence and previous cadence for % change comparison

              // const res = await fetch(`/api/openai`, {
              //   body: JSON.stringify({ search }),
              //   headers: {
              //     'Content-Type': 'application/json',
              //   },
              //   method: 'POST',
              // })
              // const data = await res.json()

              //TODO: create a post with the generated text, start hidden, let user publish
              addPostMutation.mutate(
                {
                  endDate: selectedOption!.range.split(' ')[0],
                  cadence: `${selectedOption!.name.toLowerCase()}`,
                  title: `WIP: ${selectedOption!.number!} ${selectedOption!
                    .range!}`,
                  content: 'TODO boi!',
                  // TODO: JSONB for data metrics - display in accordian
                  // TODO: save GPT-3 prompt
                  // TODO: save GPT-3 response
                },
                {
                  onSuccess: (data) => router.push(`/post/${data.id}/edit`),
                }
              )
            }}
            type="submit"
            isLoading={isLoading}
            loadingChildren={`Creating`}
            disabled={!selectedCadence}
          >
            Create
          </Button>
        </div>
      </div>
    </>
  )
}

NewPostPage.auth = true

NewPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewPostPage
