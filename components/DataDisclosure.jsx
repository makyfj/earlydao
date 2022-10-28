import { Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

const questions = [
  {
    question: 'What should I write about?',
    answer:
      'Reflect on your performance in key metrics. What went well? What could have gone better? Where did you try hard? Where did you not try hard enough?',
  },
  {
    question: 'Questions to ask yourself',
    answer:
      'What do I typically eat? What is my current diet? Am I generally tired or alert? Do I exercise? What form? How often? How much sleep do I get? What is my current weight?',
  },
  {
    question: 'Key metrics to consider',
    answer:
      'Resting heart rate, average sleep time, average blood glucose, VO2 max, MET hours.',
  },
  {
    question: 'Performance',
    answer: (
      <Fragment>
        <li>8h 17m Total Sleep Duration -5.4% WoW (prev: 8h 46m), (n=7)</li>
        <li>55.0 Average Resting Heart Rate 4.0% WoW (prev: 53.0), (n=7)</li>
        <li> 51.0 Average HRV -16.6% WoW (prev: 61.0), (n=7)</li>
        <li>8h 47m Inactive Time 1.1% WoW (prev: 8h 41m), (n=7)</li>
        <li>
          {' '}
          822.0 Active energy burned(Cal) -15.7% WoW (prev: 974.0), (n=7)
        </li>
        <li> 85.0 Exercise time(min) -19.3% WoW (prev: 106.0), (n=7)</li>
        <li> 52.0 VO2 Max(mL/min·kg) 1.6% WoW (prev: 52.8), (n=7)</li>
        <li> 9.0 Mindfulness(min) -16.9% WoW (prev: 11.0), (n=7)</li>
      </Fragment>
    ),
    ul: true,
  },
]

export default function DataDisclosure() {
  return (
    <div className="w-full px-4 pt-5">
      <div className="mx-auto w-full rounded-2xl p-2">
        {questions.map((question, index) => (
          <Disclosure key={index} as="div" className="mt-2">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-700 dark:hover:bg-opacity-20 focus:outline-none focus-visible:ring focus-visible:ring-bg-white focus-visible:ring-opacity-75">
                  <span>{question.question}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-bg-white`}
                  />
                </Disclosure.Button>
                {question.ul ? (
                  <Disclosure.Panel
                    as="ul"
                    className="px-4 pt-4 pb-2 text-sm text-bg-white"
                  >
                    {question.answer}
                  </Disclosure.Panel>
                ) : (
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm font-sm text-primary">
                    {question.answer}
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}
