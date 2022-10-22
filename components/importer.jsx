import { useState } from 'react'
import { Importer, ImporterField } from 'react-csv-importer'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { trpc } from '@/lib/trpc'

const importedFields = [
  [
    {
      id: 1,
      name: 'date',
      label: 'date',
      optional: false,
    },
    {
      id: 2,
      name: 'totalSleep',
      label: 'Total Sleep Duration',
      optional: false,
    },
    {
      id: 3,
      name: 'bedTime',
      label: 'Bedtime Start',
      optional: false,
    },
    {
      id: 4,
      name: 'wakeUpTime',
      label: 'Bedtime End',
      optional: false,
    },
    {
      id: 5,
      name: 'totalAwake',
      label: 'Awake Time',
      optional: false,
    },
    {
      id: 6,
      name: 'totalREM',
      label: 'REM Sleep Duration',
      optional: false,
    },
    {
      id: 7,
      name: 'totalDeep',
      label: 'Deep Sleep Duration',
      optional: false,
    },
    {
      id: 8,
      name: 'sleepEfficiency',
      label: 'Sleep Efficiency',
      optional: false,
    },
    {
      id: 9,
      name: 'latencyDuration',
      label: 'Sleep Latency',
      optional: false,
    },
    {
      id: 10,
      name: 'lowestRestingHeartRate',
      label: 'Lowest Resting Heart Rate',
      optional: false,
    },
    {
      id: 11,
      name: 'averageRestingHeartRate',
      label: 'Average Resting Heart Rate',
      optional: false,
    },
    {
      id: 12,
      name: 'averageHRV',
      label: 'Average HRV',
      optional: false,
    },
    {
      id: 13,
      name: 'temperatureDeviation',
      label: 'Temperature Deviation (°C)',
      optional: false,
    },
    {
      id: 14,
      name: 'respiratoryRate',
      label: 'Respiratory Rate',
      optional: false,
    },
    {
      id: 15,
      name: 'inactiveTime',
      label: 'Inactive Time',
      optional: false,
    },
    {
      id: 16,
      name: 'averageMET',
      label: 'Average MET',
      optional: false,
    },
  ],
  [
    {
      id: 101,
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      id: 102,
      name: 'type',
      label: 'Activity',
      optional: false,
    },
    {
      id: 103,
      name: 'duration',
      label: 'Duration(s)',
      optional: false,
    },
    {
      id: 104,
      name: 'activeEnergy',
      label: 'Active energy burned(Cal)',
      optional: false,
    },
    {
      id: 105,
      name: 'maxHeartRate',
      label: 'Heart rate: Maximum(count/min)',
      optional: false,
    },
    {
      id: 106,
      name: 'avgHeartRate',
      label: 'Heart rate: Average(count/min)',
      optional: false,
    },
    {
      id: 107,
      name: 'zone1',
      label: 'Heart rate zone: A Easy (<115bpm)(%)',
      optional: false,
    },
    {
      id: 108,
      name: 'zone2',
      label: 'Heart rate zone: B Fat Burn (115-135bpm)(%)',
      optional: false,
    },
    {
      id: 109,
      name: 'zone3',
      label: 'Heart rate zone: C Moderate Training (135-155bpm)(%)',
      optional: false,
    },
    {
      id: 110,
      name: 'zone4',
      label: 'Heart rate zone: D Hard Training (155-175bpm)(%)',
      optional: false,
    },
    {
      id: 111,
      name: 'zone5',
      label: 'Heart rate zone: E Extreme Training (>175bpm)(%)',
      optional: false,
    },
    {
      id: 112,
      name: 'met',
      label: 'METs Average(kcal/hr·kg)',
      optional: false,
    },
  ],
  [
    {
      id: 201,
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      id: 202,
      name: 'activeEnergy',
      label: 'Active energy burned(Cal)',
      optional: false,
    },

    {
      id: 203,
      name: 'exerciseTime',
      label: 'Exercise time(min)',
      optional: false,
    },
    {
      id: 204,
      name: 'standHour',
      label: 'Apple Watch stand hours(hr)',
      optional: false,
    },
    {
      id: 205,
      name: 'standTime',
      label: 'Stand time(min)',
      optional: false,
    },
    {
      id: 206,
      name: 'flightsClimbed',
      label: 'Flights climbed(count)',
      optional: false,
    },
    {
      id: 207,
      name: 'mindfulMinutes',
      label: 'Mindfulness(min)',
      optional: false,
    },
    {
      id: 208,
      name: 'stepCount',
      label: 'Step count(count)',
      optional: false,
    },
    {
      id: 209,
      name: 'vo2Max',
      label: 'VO2 Max(mL/min·kg)',
      optional: false,
    },
    {
      id: 210,
      name: 'basalEnergy',
      label: 'Basal energy burned(Cal)',
      optional: false,
    },
    {
      id: 211,
      name: 'restingHeartRate',
      label: 'Resting heart rate(count/min)',
      optional: false,
    },
  ],
  [
    {
      id: 301,
      name: 'time',
      label: 'Time (Local)',
      optional: false,
    },
    {
      id: 302,
      name: 'type',
      label: 'Type',
      optional: false,
    },
    {
      id: 303,
      name: 'notes',
      label: 'Notes',
      optional: false,
    },
    {
      id: 304,
      name: 'photo_link',
      label: 'Photo Link',
      optional: true,
    },
  ],
  [
    {
      id: 401,
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      id: 402,
      name: 'weight',
      label: 'Weight (lb)',
      optional: true,
    },
  ],
]

export default function DataImporter({ fieldsIndex }) {
  const router = useRouter()
  const addLevelsMutation = trpc.useMutation('levels.add', {
    onError: (error) => {
      if (error.message.includes('Failed to fetch')) {
        toast.error('File too large, please break into chunks')
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  })
  const addMicroMutation = trpc.useMutation('apple_micro.add', {
    onError: (error) => {
      if (error.message.includes('Failed to fetch')) {
        toast.error('File too large, please break into chunks')
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  })
  const addMacroMutation = trpc.useMutation('apple_macro.add', {
    onError: (error) => {
      if (error.message.includes('Failed to fetch')) {
        toast.error('File too large, please break into chunks')
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  })
  const addOuraMutation = trpc.useMutation('oura.add', {
    onError: (error) => {
      if (error.message.includes('Failed to fetch')) {
        toast.error('File too large, please break into chunks')
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  })
  const addMiscMutation = trpc.useMutation('misc.add', {
    onError: (error) => {
      if (error.message.includes('Failed to fetch')) {
        toast.error('File too large, please break into chunks')
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  })

  async function processData(rows, schema) {
    switch (schema) {
      case 0:
        // Oura
        for (const row of rows) {
          if (row.bedTime) {
            addOuraMutation.mutate(
              {
                date: new Date(row.date),
                totalSleep: Number(row.totalSleep),
                bedTime: new Date(row.bedTime),
                wakeUpTime: new Date(row.wakeUpTime),
                totalAwake: Number(row.totalAwake),
                totalREM: Number(row.totalREM),
                totalDeep: Number(row.totalDeep),
                sleepEfficiency: Number(row.sleepEfficiency),
                latencyDuration: Number(row.latencyDuration),
                lowestRestingHeartRate: Number(row.lowestRestingHeartRate),
                averageRestingHeartRate: Number(row.averageRestingHeartRate),
                averageHRV: Number(row.averageHRV),
                temperatureDeviation: Number(row.temperatureDeviation),
                respiratoryRate: Number(row.respiratoryRate),
                inactiveTime: Number(row.inactiveTime),
                averageMET: Number(row.averageMET),
              },
              {
                onSuccess: (data) =>
                  toast.success(`Imported ${rows.length} rows successfully`),
              }
            )
          }
        }
        break
      case 1:
        // Workouts
        for (const row of rows) {
          addMicroMutation.mutate(
            {
              startTime: new Date(row.date),
              type: row.type,
              duration: Number(row.duration),
              activeEnergy: Number(row.activeEnergy),
              maxHeartRate: Number(row.maxHeartRate),
              averageHeartRate: Number(row.avgHeartRate),
              zone1: Number(row.zone1),
              zone2: Number(row.zone2),
              zone3: Number(row.zone3),
              zone4: Number(row.zone4),
              zone5: Number(row.zone5),
              met: Number(row.met),
            },
            {
              onSuccess: (data) =>
                toast.success(`Imported ${rows.length} rows successfully`),
            }
          )
        }
        break
      case 2:
        // Apple Health
        for (const row of rows) {
          addMacroMutation.mutate(
            {
              date: new Date(row.date),
              activeEnergy: Number(row.activeEnergy),
              basalEnergy: Number(row.basalEnergy),
              exerciseTime: Number(row.exerciseTime),
              standHour: Number(row.standHour),
              standTime: Number(row.standTime),
              flightsClimbed: Number(row.flightsClimbed),
              mindfulMinutes: Number(row.mindfulMinutes),
              stepCount: Number(row.stepCount),
              vo2Max: Number(row.vo2Max),
              restingHeartRate: Number(row.restingHeartRate),
            },
            {
              onSuccess: (data) =>
                toast.success(`Imported ${rows.length} rows successfully`),
            }
          )
        }
        break
      case 3:
        // Levels
        for (const row of rows) {
          addLevelsMutation.mutate(
            {
              time: new Date(row.time),
              notes: row.notes,
              link: row.photo_link,
              type: row.type,
            },
            {
              onSuccess: (data) =>
                toast.success(`Imported ${rows.length} rows successfully`),
            }
          )
        }
        break
      case 4:
        // Misc
        for (const row of rows) {
          addMiscMutation.mutate(
            {
              date: new Date(row.date),
              weight: Number(row.weight),
            },
            {
              onSuccess: (data) =>
                toast.success(`Imported ${rows.length} rows successfully`),
            }
          )
        }
        break
      default:
        // Invalid
        break
    }
  }

  return (
    <Importer
      assumeNoHeaders={false}
      restartable={true}
      processChunk={(rows, { startIndex }) => {
        Promise.resolve(processData(rows, fieldsIndex))
      }}
    >
      {importedFields[fieldsIndex].map(({ id, name, label, optional }) =>
        optional ? (
          <ImporterField key={id} name={name} label={label} optional />
        ) : (
          <ImporterField key={id} name={name} label={label} />
        )
      )}
    </Importer>
  )
}
