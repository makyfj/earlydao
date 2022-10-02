import { useEffect } from 'react'
import { Importer, ImporterField } from 'react-csv-importer'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const importedFields = [
  [
    {
      id: 1,
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      id: 2,
      name: 'bed_time',
      label: 'Bedtime Start',
      optional: false,
    },
    {
      id: 3,
      name: 'wake_up_time',
      label: 'Bedtime End',
      optional: false,
    },
    {
      id: 4,
      name: 'total_sleep_duration',
      label: 'Total Sleep Duration',
      optional: false,
    },
    {
      id: 5,
      name: 'awake_time',
      label: 'Awake Time',
      optional: false,
    },
    {
      id: 6,
      name: 'rem_sleep',
      label: 'REM Sleep Duration',
      optional: false,
    },
    {
      id: 7,
      name: 'deep_sleep',
      label: 'Deep Sleep Duration',
      optional: false,
    },
    {
      id: 8,
      name: 'sleep_efficiency',
      label: 'Sleep Efficiency',
      optional: false,
    },
    {
      id: 9,
      name: 'sleep_latency',
      label: 'Sleep Latency',
      optional: false,
    },
    {
      id: 10,
      name: 'lowest_resting_heart_rate',
      label: 'Lowest Resting Heart Rate',
      optional: false,
    },
    {
      id: 11,
      name: 'average_resting_heart_rate',
      label: 'Average Resting Heart Rate',
      optional: false,
    },
    {
      id: 12,
      name: 'average_heart_rate_variability',
      label: 'Average HRV',
      optional: false,
    },
    {
      id: 13,
      name: 'temperature_deviation',
      label: 'Temperature Deviation (°C)',
      optional: false,
    },
    {
      id: 14,
      name: 'respiratory_rate',
      label: 'Respiratory Rate',
      optional: false,
    },
    {
      id: 15,
      name: 'inactive_time',
      label: 'Inactive Time',
      optional: false,
    },
    {
      id: 16,
      name: 'average_met',
      label: 'Average MET',
      optional: false,
    },
  ],
  [
    {
      id: 101,
      name: 'start', // TODO: date not on workouts export, need to derive from start
      label: 'Start',
      optional: false,
    },
    {
      id: 102,
      name: 'type', // TODO: type does not fit into our framework ((stability, strength, aerobic performance, anaerobic output, rucking, walking, NEAT))
      label: 'Type',
      optional: false,
    },
    {
      id: 103,
      name: 'duration',
      label: 'Duration',
      optional: false,
    },
    {
      id: 104,
      name: 'active_energy',
      label: 'Active Energy (kcal)',
      optional: false,
    },
    {
      id: 105,
      name: 'max_heart_rate',
      label: 'Max Heart Rate (bpm)',
      optional: false,
    },
    {
      id: 106,
      name: 'average_heart_rate',
      label: 'Avg Heart Rate (bpm)',
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
      name: 'active_energy',
      label: 'Active Energy (kcal)',
      optional: false,
    },
    {
      id: 203,
      name: 'exercise_time',
      label: 'Apple Exercise Time (min)',
      optional: false,
    },
    {
      id: 204,
      name: 'stand_hour',
      label: 'Apple Stand Hour (count)',
      optional: false,
    },
    {
      id: 205,
      name: 'stand_time',
      label: 'Apple Stand Time (min)',
      optional: false,
    },
    {
      id: 206,
      name: 'flights_climbed',
      label: 'Apple Exercise Time (min)',
      optional: false,
    },
    {
      id: 207,
      name: 'exercise_time',
      label: 'Flights Climbed (count)',
      optional: false,
    },
    {
      id: 208,
      name: 'mindful_minutes',
      label: 'Mindful Minutes (min)',
      optional: false,
    },
    {
      id: 209,
      name: 'step_count',
      label: 'Step Count (count)',
      optional: false,
    },
    {
      id: 210,
      name: 'vo2_max',
      label: 'VO2 Max (ml/(kg·min))',
      optional: false,
    },
  ],
  [
    {
      id: 301,
      name: 'time', // TODO: date not on levels export, need to derive from time
      label: 'Time (Local)',
      optional: false,
    },
    {
      id: 302,
      name: 'type', // TODO: ignore all non-food types
      label: 'Type',
      optional: false,
    },
    {
      id: 303,
      name: 'notes', // TODO: derive fullness from notes
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
]

export default function DataImporter({ fieldsIndex }) {
  const router = useRouter()

  return (
    <Importer
      assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
      restartable={false} // optional, lets user choose to upload another file when import is complete
      onStart={({ file, preview, fields, columnFields }) => {
        // optional, invoked when user has mapped columns and started import
        // prepMyAppForIncomingData()
        console.log('1')
        console.log(file, preview, fields, columnFields)
      }}
      processChunk={async (rows, { startIndex }) => {
        // required, may be called several times
        // receives a list of parsed objects based on defined fields and user column mapping;
        // (if this callback returns a promise, the widget will wait for it before parsing more data)
        console.log('2')
        console.log(startIndex)
        console.log(rows)
        for (row of rows) {
          //   await console.log(row)
          console.log('processing')
        }
      }}
      onComplete={({ file, preview, fields, columnFields }) => {
        // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
        // showMyAppToastNotification()
        console.log('3')
        toast.success('Imported')
      }}
      onClose={({ file, preview, fields, columnFields }) => {
        // optional, if this is specified the user will see a "Finish" button after import is done,
        // which will call this when clicked
        // goToMyAppNextPage()
        console.log('4')
        router.reload(window.location.pathname)
      }}

      // CSV options passed directly to PapaParse if specified:
      // delimiter={...}
      // newline={...}
      // quoteChar={...}
      // escapeChar={...}
      // comments={...}
      // skipEmptyLines={...}
      // delimitersToGuess={...}
      // chunkSize={...} // defaults to 10000
      // encoding={...} // defaults to utf-8, see FileReader API
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
