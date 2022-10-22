import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { Importer, ImporterField } from 'react-csv-importer'
import { useRouter } from 'next/router'
import 'react-csv-importer/dist/index.css'
import DataImporter from './importer'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ImportTabs() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  let [categories] = useState({
    Oura: [
      {
        id: 1,
        title: 'What data does EARLY pull from Oura?',

        href: 'https://longevitydocs.vercel.app/docs/sleep-metrics',
      },
      {
        id: 2,
        title: 'How to export your data from Oura and import into EARLY',
      },
      {
        id: 3,
        title: 'Download sample CSV',
        href: 'https://earlydao.vercel.app/sample_data/sample_oura.csv',
      },
    ],
    'Apple Workouts': [
      {
        id: 1,
        title: 'What data does EARLY pull from Apple Workouts?',
        href: 'https://longevitydocs.vercel.app/docs/exercise-metrics#workouts',
      },
      {
        id: 2,
        title:
          'How to export your workout data from Apple and import into EARLY',
      },
      {
        id: 3,
        title: 'Download sample CSV',
        href: 'https://earlydao.vercel.app/sample_data/sample_workouts.csv',
      },
    ],
    'Apple Health': [
      {
        id: 1,
        title: 'What data does EARLY pull from Apple Health?',
        href: 'https://longevitydocs.vercel.app/docs/exercise-metrics#aggregated-health',
      },
      {
        id: 2,
        title:
          'How to export your health data from Apple and import into EARLY',
      },
      {
        id: 3,
        title: 'Download sample CSV',
        href: 'https://earlydao.vercel.app/sample_data/sample_apple_health.csv',
      },
    ],
    Levels: [
      {
        id: 1,
        title: 'What data does EARLY pull from Levels?',
        href: 'https://longevitydocs.vercel.app/docs/docs/nutrition-metrics',
      },
      {
        id: 2,
        title: 'How to export your data from Levels and import into EARLY',
      },
      {
        id: 3,
        title: 'Download sample CSV',
        href: 'https://earlydao.vercel.app/sample_data/sample_levels.csv',
      },
    ],
    Misc: [
      {
        id: 1,
        title: 'What miscellaneous data does EARLY pull?',
      },
      {
        id: 2,
        title: 'How to import miscellaneous into EARLY',
      },
      {
        id: 3,
        title: 'Download sample CSV',
        href: 'https://earlydao.vercel.app/sample_data/sample_misc.csv',
      },
    ],
  })

  return (
    <div className="w-full px-2 py-8 sm:px-0">
      <Tab.Group
        onChange={(index) => {
          setSelectedIndex(index)
        }}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 focus:ring-2',
                  '',
                  selected
                    ? 'text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse shadow'
                    : 'hover:bg-primary-inverse hover:text-secondary-inverse'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel key={idx} className={classNames('rounded-xl p-3', '')}>
              <ul>
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative rounded-md p-3 hover:text-primary-inverse hover:bg-primary-inverse"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {post.title}
                    </h3>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-secondary hover:text-secondary-inverse">
                      <li>{post.href}</li>
                      {/* <li>&middot;</li>
                      <li>{post.commentCount} comments</li>
                      <li>&middot;</li>
                      <li>{post.shareCount} shares</li> */}
                    </ul>

                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={post.href}
                      className={classNames(
                        'absolute inset-0 rounded-md',
                        'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
      <DataImporter fieldsIndex={selectedIndex} />
    </div>
  )
}
