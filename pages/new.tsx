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
  sub,
  addDays,
} from 'date-fns'
import { Button } from '@/components/button'
import { RadioGroup } from '@headlessui/react'
import { AppleMacro, AppleMicro, Oura, Misc } from '@prisma/client'

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
    start = new Date().setDate(new Date().getDate() - 5)
    rangeStart = startOfQuarter(rangeEnd)
    number = `Q${getQuarter(rangeEnd)}`
    next = endOfQuarter(new Date())
  } else if (key === 'Monthly') {
    start = new Date().setDate(new Date().getDate() - 3)
    rangeStart = startOfMonth(rangeEnd)
    number = `M${getMonth(rangeEnd) + 1}`
    next = endOfMonth(new Date())
  } else if (key === 'Weekly') {
    start = new Date().setDate(new Date().getDate() - 7)
    rangeStart = startOfWeek(rangeEnd, { weekStartsOn: 0 })
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
      message: `${number} post deadline has passed. 
      ${number.charAt(0)}${Number(number.charAt(1)) + 1}
       opens ${next!.toLocaleDateString()}.`,
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
  const [currentStartDate, setCurrentStartDate] = React.useState(new Date())
  const [currentEndDate, setCurrentEndDate] = React.useState(new Date())
  const [prevStartDate, setPrevStartDate] = React.useState(new Date())
  const [prevEndDate, setPrevEndDate] = React.useState(new Date())

  const { data: currMacro, refetch } = trpc.useQuery([
    'apple_macro.get-range',
    {
      startDate: currentStartDate,
      endDate: currentEndDate,
    },
  ])

  const utils = trpc.useContext()

  // const macroQueryPast = trpc.useQuery([
  //   'apple_macro.get-range',
  //   {
  //     startDate: prevStartDate,
  //     endDate: prevEndDate,
  //   },
  // ])
  // const microQueryCurrent = trpc.useQuery([
  //   'apple_micro.get-range',
  //   {
  //     startDate: currentStartDate,
  //     endDate: currentEndDate,
  //   },
  // ])
  // const microQueryPast = trpc.useQuery([
  //   'apple_micro.get-range',
  //   {
  //     startDate: prevStartDate,
  //     endDate: prevEndDate,
  //   },
  // ])
  // const ouraQueryCurrent = trpc.useQuery([
  //   'oura.get-range',
  //   {
  //     startDate: currentStartDate,
  //     endDate: currentEndDate,
  //   },
  // ])
  // const ouraQueryPast = trpc.useQuery([
  //   'oura.get-range',
  //   {
  //     startDate: prevStartDate,
  //     endDate: prevEndDate,
  //   },
  // ])
  // const miscQueryCurrent = trpc.useQuery([
  //   'misc.get-range',
  //   {
  //     startDate: currentStartDate,
  //     endDate: currentEndDate,
  //   },
  // ])
  // const miscQueryPast = trpc.useQuery([
  //   'misc.get-range',
  //   {
  //     startDate: prevStartDate,
  //     endDate: prevEndDate,
  //   },
  // ])

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
            onChange={(cadence: React.SetStateAction<undefined>) =>
              setSelectedCadence(cadence)
            }
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
                        ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-300'
                        : ''
                    }
                  ${
                    checked
                      ? 'bg-blue-700 bg-opacity-20 text-white'
                      : 'bg-white'
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
                                checked ? 'text-blue-100' : 'text-gray-500'
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
              setIsLoading(true)
              const selectedOption = cadenceOptions.find(
                (c) => c.name === selectedCadence
              )
              const dateSplit = selectedOption!.range.split('-')
              const startDate = new Date(dateSplit[0])
              const endDate = new Date(dateSplit[dateSplit.length - 1])
              setCurrentStartDate(startDate)
              setCurrentEndDate(addDays(endDate, 1))
              if (selectedCadence === 'Quarterly') {
                setPrevStartDate(sub(startDate, { months: 3 }))
                setPrevEndDate(addDays(sub(endDate, { months: 3 }), 1))
              } else if (selectedCadence === 'Monthly') {
                setPrevStartDate(sub(startDate, { months: 1 }))
                setPrevEndDate(addDays(sub(endDate, { months: 1 }), 1))
              } else if (selectedCadence === 'Weekly') {
                setPrevStartDate(sub(startDate, { weeks: 1 }))
                setPrevEndDate(addDays(sub(endDate, { weeks: 1 }), 1))
              }

              // await refetch()

              const test = await utils.invalidateQueries([
                'apple_macro.get-range',
                {
                  startDate: currentStartDate,
                  endDate: currentEndDate,
                },
              ])

              console.log(test)

              const prompt = `Write a reflective essay about the following health
               data and give recommendations on how to improve going forward.
              \n\Data: ${JSON.stringify({ test })}:\n`

              const res = await fetch(`/api/openai`, {
                body: JSON.stringify({ prompt }),
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              })
              const data = await res.json()

              addPostMutation.mutate(
                {
                  endDate: selectedOption!.range.split(' ')[0],
                  cadence: `${selectedOption!.name.toLowerCase()}`,
                  title: `WIP: ${selectedOption!.number!} ${selectedOption!
                    .range!}`,
                  content: data.data.replace(/[^a-zA-Z0-9 ]/g, ''),
                  prompt: prompt,
                  response: data.data.replace(/[^a-zA-Z0-9 ]/g, ''),
                  inputData: { test },
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
