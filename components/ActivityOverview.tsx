import {
  Card,
  Title,
  Bold,
  Text,
  Tab,
  TabList,
  Footer,
  ButtonInline,
  BarList,
  ColGrid,
  Block,
} from '@tremor/react'

import { ArrowRightIcon } from '@heroicons/react/20/solid'

import React, { useState } from 'react'

const Runners = {
  Workouts: 'Workouts',
}

const data = [
  {
    name: 'Workouts',
    session: [
      { name: 'Long runs', value: 56 },
      { name: 'Fartlek runs', value: 45 },
      { name: 'Recover runs', value: 34 },
      { name: 'Runs with Lena', value: 12 },
      { name: 'Functional strength', value: 10 },
    ],
    time: [
      { name: 'Long runs', value: 120.9 },
      { name: 'Fartlek runs', value: 63.6 },
      { name: 'Recover runs', value: 41.3 },
      { name: 'Runs with Lena', value: 6.2 },
      { name: 'Functional strength', value: 6.1 },
    ],
    bpm: [
      { name: 'Long runs', value: 162 },
      { name: 'Fartlek runs', value: 172 },
      { name: 'Recover runs', value: 142 },
      { name: 'Runs with Lena', value: 165 },
      { name: 'Functional strength', value: 128 },
    ],
    km: [
      { name: 'Long runs', value: 1243.45 },
      { name: 'Fartlek runs', value: 342.32 },
      { name: 'Recover runs', value: 278.12 },
      { name: 'Runs with Lena', value: 190.04 },
      { name: 'Functional strength', value: 0 },
    ],
  },
]

const valueFormatter = (number: number) =>
  Intl.NumberFormat('us').format(number).toString()

export default function ActivityOverview() {
  const [selectedRunner, setSelectedRunner] = useState(Runners.Workouts)
  return (
    <Card>
      <Title> Activity Overview</Title>
      <TabList
        defaultValue={selectedRunner}
        handleSelect={(value) => setSelectedRunner(value)}
        marginTop="mt-8"
      >
        <Tab value={Runners.Workouts} text="Workouts" />
      </TabList>

      {data
        .filter((item) => item.name === selectedRunner)
        .map((item) => (
          <ColGrid key={item.name} numColsMd={2} gapX="gap-x-8" gapY="gap-y-2">
            <Block>
              <Text marginTop="mt-8">
                <Bold>Activity by session (#)</Bold>
              </Text>
              <BarList
                marginTop="mt-4"
                data={item.session}
                valueFormatter={valueFormatter}
              />
            </Block>
            <Block>
              <Text marginTop="mt-8">
                <Bold>Activity by time (h)</Bold>
              </Text>
              <BarList
                marginTop="mt-4"
                data={item.time}
                valueFormatter={valueFormatter}
              />
            </Block>
            <Block>
              <Text marginTop="mt-8">
                <Bold>Activity by heart rate (bpm)</Bold>
              </Text>
              <BarList
                marginTop="mt-4"
                data={item.bpm}
                valueFormatter={valueFormatter}
              />
            </Block>
            <Block>
              <Text marginTop="mt-8">
                <Bold>Activity by calories (kacal)</Bold>
              </Text>
              <BarList
                marginTop="mt-4"
                data={item.km}
                valueFormatter={valueFormatter}
              />
            </Block>
          </ColGrid>
        ))}

      <Footer>
        <ButtonInline
          size="sm"
          text="View details"
          Icon={ArrowRightIcon}
          iconPosition="right"
          handleClick={() => null}
        />
      </Footer>
    </Card>
  )
}
