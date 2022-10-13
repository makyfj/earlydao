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
      { name: 'Walking', value: 288 },
      { name: 'Strength Training', value: 138 },
      { name: 'Zone 2', value: 65 },
      { name: 'Zone 5', value: 20 },
      { name: 'Stability', value: 15 },
    ],
    time: [
      { name: 'Walking', value: 113 },
      { name: 'Strength Training', value: 79 },
      { name: 'Zone 2', value: 56 },
      { name: 'Zone 5', value: 31 },
      { name: 'Stability', value: 10 },
    ],
    bpm: [
      { name: 'Walking', value: 105 },
      { name: 'Strength Training', value: 140 },
      { name: 'Zone 2', value: 145 },
      { name: 'Zone 5', value: 170 },
      { name: 'Stability', value: 95 },
    ],
    kcal: [
      { name: 'Walking', value: 89 },
      { name: 'Strength Training', value: 279 },
      { name: 'Zone 2', value: 370 },
      { name: 'Zone 5', value: 201 },
      { name: 'Stability', value: 95 },
    ],
  },
]

const valueFormatter = (number: number) =>
  Intl.NumberFormat('us').format(number).toString()

export default function ActivityOverview() {
  const [selectedRunner, setSelectedRunner] = useState(Runners.Workouts)
  return (
    <Card>
      <Title>Exercise Overview</Title>
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
                <Bold>Activity by calories (kcal)</Bold>
              </Text>
              <BarList
                marginTop="mt-4"
                data={item.kcal}
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
