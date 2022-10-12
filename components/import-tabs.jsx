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
        title: 'Schema: What data EARLY pulls from Oura',
        date: 'Sep 30, 2022',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: 'Tutorial: Export your sleep data from Oura',
        date: 'Sep 30, 2022',
        commentCount: 3,
        shareCount: 2,
      },
      {
        id: 3,
        title: 'Download sample CSV',
        date: 'Sep 30, 2022',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    'Apple Workouts': [
      {
        id: 1,
        title: 'Schema: What data EARLY looks for in your workouts',
        date: 'Sep 30, 2022',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'Tutorial: Export your workouts from Apple Health',
        date: 'Sep 30, 2022',
        commentCount: 24,
        shareCount: 12,
      },
      {
        id: 3,
        title: 'Download sample CSV',
        date: 'Sep 30, 2022',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    'Apple Health': [
      {
        id: 1,
        title: 'Schema: What data EARLY looks for in your fitness data',
        date: 'Sep 30, 2022',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'Tutorial: Export your fitness data from Apple Health',
        date: 'Sep 30, 2022',
        commentCount: 24,
        shareCount: 12,
      },
      {
        id: 3,
        title: 'Download sample CSV',
        date: 'Sep 30, 2022',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Levels: [
      {
        id: 1,
        title: 'Schema: What data EARLY looks for in your nutrition data',
        date: 'Sep 30, 2022',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'Tutorial: Export your nutrition data from Levels',
        date: 'Sep 30, 2022',
        commentCount: 24,
        shareCount: 12,
      },
      {
        id: 3,
        title: 'Download sample CSV',
        date: 'Sep 30, 2022',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Misc: [
      {
        id: 1,
        title: 'Schema: What data EARLY looks for in your misc data',
        date: 'Sep 30, 2022',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'Tutorial: Import misc data',
        date: 'Sep 30, 2022',
        commentCount: 24,
        shareCount: 12,
      },
      {
        id: 3,
        title: 'Download sample CSV',
        date: 'Sep 30, 2022',
        commentCount: 3,
        shareCount: 2,
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
                      <li>{post.date}</li>
                      {/* <li>&middot;</li>
                      <li>{post.commentCount} comments</li>
                      <li>&middot;</li>
                      <li>{post.shareCount} shares</li> */}
                    </ul>

                    <a
                      href="#"
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
