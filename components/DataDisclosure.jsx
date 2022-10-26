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
]

export default function DataDisclosure() {
  return (
    <div className="w-full px-4 pt-5">
      <div className="mx-auto w-full rounded-2xl p-2">
        {questions.map((question, index) => (
          <Disclosure key={question} as="div" className="mt-2">
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
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm font-sm text-primary">
                  {question.answer}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}
