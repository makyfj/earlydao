import { Button } from '@/components/button'
import { ButtonLink } from '@/components/button-link'
import { MarkdownIcon } from '@/components/icons'
import { MarkdownEditor } from '@/components/markdown-editor'
import { TextField } from '@/components/text-field'
import { DatePicker } from '@/components/date-picker'
import { useLeaveConfirm } from '@/lib/form'
import * as React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { trpc } from '@/lib/trpc'
// @ts-ignore
import mean from 'lodash/mean'
import {
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  DeltaType,
  Color,
  ColGrid,
} from '@tremor/react'

const colors: { [key: string]: Color } = {
  increase: 'emerald',
  moderateIncrease: 'emerald',
  unchanged: 'orange',
  moderateDecrease: 'rose',
  decrease: 'rose',
}

const categories: {
  title: string
  metric: string
  metricPrev: string
  delta: string
  deltaType: DeltaType
}[] = [
  {
    title: 'Sleep',
    metric: '8h 32m',
    metricPrev: '8h 18m',
    delta: '2.7%',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Resting Heart Rate',
    metric: '46 bpm',
    metricPrev: '48 bpm',
    delta: '4.2%',
    deltaType: 'moderateDecrease',
  },
  {
    title: 'Heart Rate Variability',
    metric: '57 ms',
    metricPrev: '49 ms',
    delta: '16.3%',
    deltaType: 'moderateIncrease',
  },
]

type FormData = {
  cadence?: any
  endDate?: string
  title: string
  content: string
}

type PostFormProps = {
  defaultValues?: FormData
  isSubmitting?: boolean
  backTo: string
  onSubmit: SubmitHandler<FormData>
}

function secondsToDuration(seconds: number) {
  var hours = Math.floor(seconds / 3600)
  var minutes = Math.floor((seconds - hours * 3600) / 60)
  var seconds = seconds - hours * 3600 - minutes * 60

  return `${hours}h ${minutes}m`
}

export function PostForm({
  defaultValues,
  isSubmitting,
  backTo,
  onSubmit,
}: PostFormProps) {
  const {
    control,
    register,
    formState,
    getValues,
    reset,
    handleSubmit,
    watch,
  } = useForm<FormData>({
    defaultValues,
  })

  useLeaveConfirm({ formState })

  const { isSubmitSuccessful } = formState

  const watchAllFields = watch() // when pass nothing as argument, you are watching everything
  // const watchFields = watch(['showAge', 'number']) // you can also target specific fields by their names

  const sleepQuery = trpc.useQuery([
    'oura.key_metrics',
    {
      cadence: watchAllFields.cadence,
      endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
    },
  ])

  // const microQuery = trpc.useQuery([
  //   'oura.key_metrics',
  //   {
  //     cadence: watchAllFields.cadence,
  //     endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
  //   },
  // ])

  const macroQuery = trpc.useQuery([
    'apple_macro.key_metrics',
    {
      cadence: watchAllFields.cadence,
      endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
    },
  ])

  // const levelsQuery = trpc.useQuery([
  //   'oura.key_metrics',
  //   {
  //     cadence: watchAllFields.cadence,
  //     endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
  //   },
  // ])

  const sleepQueryImprovment = trpc.useQuery([
    'oura.key_metrics',
    {
      cadence: watchAllFields.cadence,
      endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
      improvementFlag: true,
    },
  ])

  // const microQuery = trpc.useQuery([
  //   'oura.key_metrics',
  //   {
  //     cadence: watchAllFields.cadence,
  //     endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
  //   },
  // ])

  // const macroQuery = trpc.useQuery([
  //   'apple_macro.key_metrics',
  //   {
  //     cadence: watchAllFields.cadence,
  //     endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
  //   },
  // ])

  // const levelsQuery = trpc.useQuery([
  //   'oura.key_metrics',
  //   {
  //     cadence: watchAllFields.cadence,
  //     endDate: watchAllFields.endDate || new Date().toLocaleDateString(),
  //   },
  // ])

  const cadenceMap: any = {
    weekly: 7,
    monthly: 30,
    quarterly: 120,
    annually: 365,
  }

  const keyMetrics = [
    {
      name: 'Total Sleep',
      value: secondsToDuration(
        mean(sleepQuery.data?.entries.map((i: any) => i.totalSleep))
      ),
      improvement: secondsToDuration(
        mean(sleepQueryImprovment.data?.entries.map((i: any) => i.totalSleep))
      ),
    },
    {
      name: 'Lowest Resting Heart Rate (bpm)',
      value: parseInt(
        mean(sleepQuery.data?.entries.map((i: any) => i.lowestRestingHeartRate))
      ),
      improvement: parseInt(
        mean(
          sleepQueryImprovment.data?.entries.map(
            (i: any) => i.lowestRestingHeartRate
          )
        )
      ),
    },
    {
      name: 'Average HRV (ms)',
      value: parseInt(
        mean(sleepQuery.data?.entries.map((i: any) => i.averageHRV))
      ),
      improvement: parseInt(
        mean(sleepQueryImprovment.data?.entries.map((i: any) => i.averageHRV))
      ),
    },
    {
      name: 'Inactive Time',
      value: secondsToDuration(
        mean(sleepQuery.data?.entries.map((i: any) => i.inactiveTime))
      ),
      improvement: secondsToDuration(
        mean(sleepQueryImprovment.data?.entries.map((i: any) => i.inactiveTime))
      ),
    },
    {
      name: 'Average METs',
      value: mean(
        sleepQuery.data?.entries.map((i: any) => i.averageMET)
      ).toFixed(4),
      improvement: mean(
        sleepQueryImprovment.data?.entries.map((i: any) => i.averageMET)
      ).toFixed(4),
    },
    {
      name: 'Total Sleep',
      value: secondsToDuration(
        mean(sleepQuery.data?.entries.map((i: any) => i.totalSleep))
      ),
      improvement: secondsToDuration(
        mean(sleepQueryImprovment.data?.entries.map((i: any) => i.totalSleep))
      ),
    },
    {
      name: 'Average Calories Burned',
      value: parseInt(
        mean(
          macroQuery.data?.entries
            .reduce(function (filtered: any, option: any) {
              if (option?.activeEnergy) {
                filtered.push(option.activeEnergy)
              }
              return filtered
            }, [])
            .map((i: any) => i)
        )
      ),
    },
    {
      name: 'Average VO2 Max',
      value: mean(
        macroQuery.data?.entries
          .reduce(function (filtered: any, option: any) {
            if (option.vo2Max) {
              filtered.push(option.vo2Max)
            }
            return filtered
          }, [])
          .map((i: any) => i)
      ).toFixed(2),
    },
    // {
    //   name: 'Average Mindful Minutes',
    //   value: parseInt(
    //     mean(macroQuery.data?.entries.map((i: any) => i.mindfulMinutes))
    //   ),
    // },
    {
      name: 'Average Step Count',
      value: parseInt(
        mean(
          macroQuery.data?.entries
            .reduce(function (filtered: any, option: any) {
              if (option.stepCount) {
                filtered.push(option.stepCount)
              }
              return filtered
            }, [])
            .map((i: any) => i)
        )
      ),
    },

    // {
    //   name: 'Average Bed Time',
    //   value: calculateAverageOfHours(
    //     sleepQuery.data?.entries.map((i: any) => i.bedTime),
    //     new Date(
    //       Math.min.apply(
    //         null,
    //         sleepQuery.data?.entries.map((i: any) => i.bedTime)
    //       )
    //     )
    //   )?.toLocaleTimeString(),
    // },
  ]

  const keyMetricsImprovment = [
    {
      name: 'Total Sleep',
    },
    {
      name: 'Lowest Resting Heart Rate (bpm)',
    },
    {
      name: 'Average HRV (ms)',
    },
    {
      name: 'Inactive Time',
    },
    {
      name: 'Average METs',
    },
    {
      name: 'Total Sleep',
    },
    {
      name: 'Average Calories Burned',
      value: parseInt(
        mean(
          macroQuery.data?.entries
            .reduce(function (filtered: any, option: any) {
              if (option?.activeEnergy) {
                filtered.push(option.activeEnergy)
              }
              return filtered
            }, [])
            .map((i: any) => i)
        )
      ),
    },
    {
      name: 'Average VO2 Max',
      value: mean(
        macroQuery.data?.entries
          .reduce(function (filtered: any, option: any) {
            if (option.vo2Max) {
              filtered.push(option.vo2Max)
            }
            return filtered
          }, [])
          .map((i: any) => i)
      ).toFixed(2),
    },
    // {
    //   name: 'Average Mindful Minutes',
    //   value: parseInt(
    //     mean(macroQuery.data?.entries.map((i: any) => i.mindfulMinutes))
    //   ),
    // },
    {
      name: 'Average Step Count',
      value: parseInt(
        mean(
          macroQuery.data?.entries
            .reduce(function (filtered: any, option: any) {
              if (option.stepCount) {
                filtered.push(option.stepCount)
              }
              return filtered
            }, [])
            .map((i: any) => i)
        )
      ),
    },

    // {
    //   name: 'Average Bed Time',
    //   value: calculateAverageOfHours(
    //     sleepQueryImprovment.data?.entries.map((i: any) => i.bedTime),
    //     new Date(
    //       Math.min.apply(
    //         null,
    //         sleepQueryImprovment.data?.entries.map((i: any) => i.bedTime)
    //       )
    //     )
    //   )?.toLocaleTimeString(),
    // },
  ]

  console.log()

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    )
    return () => subscription.unsubscribe()
  }, [watch])

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues())
    }
  }, [isSubmitSuccessful, reset, getValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6">
        <TextField
          {...register('title', { required: true })}
          label="Title"
          required
          autoFocus
          className="text-lg font-semibold !py-1.5"
        />
      </div>
      {!defaultValues?.title && (
        <>
          <div className="mt-6">
            <DatePicker
              {...register('endDate', { required: !defaultValues?.title })}
              label="End date"
              required
              className="text-lg font-semibold !py-1.5"
            />
          </div>

          <div className="mt-6">
            <label htmlFor="cadence" className="block mb-2 font-semibold">
              Cadence
            </label>
            <Controller
              name="cadence"
              control={control}
              rules={{ required: true }}
              {...(register('cadence'), { required: !defaultValues?.title })}
              render={({ field }) => (
                <select
                  {...field}
                  {...register('cadence')}
                  className="block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring text-lg font-semibold !py-1.5"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              )}
            />
          </div>
        </>
      )}

      {/* {JSON.stringify(macroQuery.data, null, 2)} */}

      {/* <div className="mt-6">{JSON.stringify(keyMetrics, null, 2)}</div> */}
      {/* <div className="-mx-4 mt-3 flex flex-col sm:-mx-6 md:mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 md:pl-0"
              >
                Key Metric
              </th>
              <th
                scope="col"
                className="hidden py-3.5 px-3 text-right text-sm font-semibold sm:table-cell"
              >
                Previous {watchAllFields.cadence}
              </th>
              <th
                scope="col"
                className="hidden py-3.5 px-3 text-right text-sm font-semibold sm:table-cell"
              >
                Change
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-6 md:pr-0"
              >
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {keyMetrics.map((km, kmIdx) => (
              <tr key={kmIdx} className="border-b border-gray-200">
                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                  <div className="font-medium">{km.name}</div>
                </td>
                <td className="hidden py-4 px-3 text-right text-sm sm:table-cell">
                  {sleepQueryImprovment.isLoading ? 'Loading' : km?.improvement}
                </td>
                <td className="hidden py-4 px-3 text-right text-sm  sm:table-cell">
                  {sleepQuery.isLoading &&sleepQueryImprovment.isLoading ? 'Coming soon' : km?.improvement}
                  ...
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm sm:pr-6 md:pr-0">
                  {sleepQuery.isLoading ? 'Loading' : km.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <></> */}

      <div className="mt-5">
        <ColGrid numColsSm={2} numColsLg={3} gapX="gap-x-6" gapY="gap-y-6">
          {categories.map((item) => (
            <Card key={item.title}>
              <Text>{item.title}</Text>
              <Flex
                justifyContent="justify-start"
                alignItems="items-baseline"
                spaceX="space-x-3"
                truncate={true}
              >
                <Metric>{item.metric}</Metric>
                <Text truncate={true}>from {item.metricPrev}</Text>
              </Flex>
              <Flex
                justifyContent="justify-start"
                spaceX="space-x-2"
                marginTop="mt-4"
              >
                <BadgeDelta deltaType={item.deltaType} />
                <Flex
                  justifyContent="justify-start"
                  spaceX="space-x-1"
                  truncate={true}
                >
                  <Text color={colors[item.deltaType]}>{item.delta}</Text>
                  <Text truncate={true}> to previous month </Text>
                </Flex>
              </Flex>
            </Card>
          ))}
        </ColGrid>
      </div>

      <div className="mt-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MarkdownEditor
              label="Post"
              value={field.value}
              onChange={field.onChange}
              onTriggerSubmit={handleSubmit(onSubmit)}
              required
            />
          )}
        />
      </div>
      <div className="flex items-center justify-between gap-4 mt-8">
        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingChildren={`${defaultValues ? 'Saving' : 'Publishing'}`}
          >
            {defaultValues?.title ? 'Save' : 'Publish'}
          </Button>
          <ButtonLink href={backTo} variant="secondary">
            Cancel
          </ButtonLink>
        </div>
        {!isSubmitting && (
          <a
            href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-colors text-secondary hover:text-blue"
          >
            <MarkdownIcon />
            <span className="text-xs">Markdown supported</span>
          </a>
        )}
      </div>
    </form>
  )
}
