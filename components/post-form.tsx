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
import Select from 'react-select'
import { sleep } from 'react-query/types/core/utils'

import mean from 'lodash/mean'
import sum from 'lodash/sum'

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
    'oura.post_metrics',
    { cadence: watchAllFields.cadence, endDate: watchAllFields.endDate },
  ])

  const keyMetrics = [
    {
      name: 'Total Sleep',
      value: secondsToDuration(
        mean(sleepQuery.data?.entries.map((i: any) => i.totalSleep))
      ),
    },
    {
      name: 'Lowest Resting Heart Rate',
      value: mean(
        sleepQuery.data?.entries.map((i: any) => i.lowestRestingHeartRate)
      ),
    },
    {
      name: 'Average HRV',
      value: mean(sleepQuery.data?.entries.map((i: any) => i.averageHRV)),
    },
    {
      name: 'Inactive Time',
      value: secondsToDuration(
        mean(sleepQuery.data?.entries.map((i: any) => i.inactiveTime))
      ),
    },
    {
      name: 'Average METs',
      value: mean(sleepQuery.data?.entries.map((i: any) => i.averageMET)),
    },
    // {
    //   name: 'Average Bed Time',
    //   value: new Date(
    //     sum(
    //       sleepQuery.data?.entries.map((i: any) =>
    //         new Date(i.bedTime).getTime()
    //       )
    //     ) / 7 //sleepQuery.data?.entries.length ?? 1
    //   ).getTime(),
    // },
  ]

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
          className="text-lg font-semibold !py-1.5"
        />
      </div>
      {!defaultValues?.title && (
        <>
          <div className="mt-6">
            <DatePicker
              {...register('endDate', { required: !defaultValues?.title })}
              label="End date"
              autoFocus
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

      {JSON.stringify(sleepQuery.data, null, 2)}

      {/* <div className="mt-6">{JSON.stringify(keyMetrics, null, 2)}</div> */}
      <div className="-mx-4 mt-3 flex flex-col sm:-mx-6 md:mx-0">
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
              ></th>
              <th
                scope="col"
                className="hidden py-3.5 px-3 text-right text-sm font-semibold sm:table-cell"
              ></th>
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
                <td className="hidden py-4 px-3 text-right text-sm sm:table-cell"></td>
                <td className="hidden py-4 px-3 text-right text-sm  sm:table-cell"></td>
                <td className="py-4 pl-3 pr-4 text-right text-sm sm:pr-6 md:pr-0">
                  {km.value ? km.value : 'Loading'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
