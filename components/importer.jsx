import { useEffect } from 'react'
import { Importer, ImporterField } from 'react-csv-importer'
import toast from 'react-hot-toast'

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
      name: 'total_sleep',
      label: 'Total Sleep',
      optional: false,
    },
    {
      id: 3,
      name: 'bed_time',
      label: 'Time to Bed',
      optional: false,
    },
  ],
  [
    {
      id: 4,
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      id: 5,
      name: 'total_micro',
      label: 'Total Micro',
      optional: false,
    },
    {
      id: 6,
      name: 'zone_two',
      label: 'Zone 2',
      optional: false,
    },
  ],
  [
    {
      id: 7,
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      id: 8,
      name: 'total_macro',
      label: 'Total Macro',
      optional: false,
    },
    {
      id: 9,
      name: 'calories_burned',
      label: 'Calories Burned',
      optional: false,
    },
  ],
  [
    {
      name: 'date',
      label: 'Date',
      optional: false,
    },
    {
      name: 'total_nutrition',
      label: 'Total Nutrition',
      optional: false,
    },
    {
      name: 'calories_eaten',
      label: 'Calories Eaten',
      optional: false,
    },
  ],
]

export default function DataImporter({ fieldsIndex }) {
  console.log(importedFields[fieldsIndex])
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
