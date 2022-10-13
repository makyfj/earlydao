import {
  Card,
  Metric,
  Text,
  AreaChart,
  BadgeDelta,
  Flex,
  DeltaType,
  ColGrid,
  Title,
  TabList,
  Tab,
} from '@tremor/react'
import { useState } from 'react'

const data = [
  {
    Month: 'Jan 21',
    'Calories Burned': 700,
    'Exercise Time': 65,
    'Inactive Time': 4938,
  },
  {
    Month: 'Feb 21',
    'Calories Burned': 680,
    'Exercise Time': 75,
    'Inactive Time': 4938,
  },
  {
    Month: 'Mar 21',
    'Calories Burned': 620,
    'Exercise Time': 60,
    'Inactive Time': 4938,
  },
  {
    Month: 'Apr 21',
    'Calories Burned': 650,
    'Exercise Time': 52,
    'Inactive Time': 4938,
  },
  {
    Month: 'May 21',
    'Calories Burned': 640,
    'Exercise Time': 55,
    'Inactive Time': 4938,
  },
  {
    Month: 'Jun 21',
    'Calories Burned': 610,
    'Exercise Time': 53,
    'Inactive Time': 4938,
  },
  {
    Month: 'Jul 21',
    'Calories Burned': 620,
    'Exercise Time': 58,
    'Inactive Time': 4938,
  },
]

const categories: {
  title: string
  metric: string
  metricPrev: string
  delta: string
  deltaType: DeltaType
}[] = [
  {
    title: 'Calories Burned',
    metric: '631 kcal',
    metricPrev: '695 kcal',
    delta: '9.3%',
    deltaType: 'moderateDecrease',
  },
  {
    title: 'Exercise Time',
    metric: '58 min',
    metricPrev: '62.8',
    delta: '7.2',
    deltaType: 'moderateDecrease',
  },
  {
    title: 'Inactive Time',
    metric: '8h 38m',
    metricPrev: '8h 25m',
    delta: '2.5%',
    deltaType: 'moderateIncrease',
  },
]

const valueFormatter = (number: number) => `${number.toString()}`

export default function Charts() {
  const [selectedView, setSelectedView] = useState(1)
  return (
    <Card>
      <Title>Activity Overview</Title>
      <TabList
        defaultValue={1}
        handleSelect={(value) => setSelectedView(value)}
        marginTop="mt-6"
      >
        <Tab value={1} text="Overview" />
        {/* <Tab value={2} text="Detail" /> */}
      </TabList>
      <ColGrid
        numColsSm={2}
        numColsLg={3}
        marginTop="mt-6"
        gapX="gap-x-6"
        gapY="gap-y-6"
      >
        {categories.map((item) => (
          <Card key={item.title}>
            <Flex alignItems="items-start">
              <Text>{item.title}</Text>
              <BadgeDelta deltaType={item.deltaType} text={item.delta} />
            </Flex>
            <Flex
              justifyContent="justify-start"
              alignItems="items-baseline"
              spaceX="space-x-3"
              truncate={true}
            >
              <Metric>{item.metric}</Metric>
              <Text>from {item.metricPrev}</Text>
            </Flex>
            <AreaChart
              marginTop="mt-4"
              data={data}
              dataKey="Month"
              valueFormatter={valueFormatter}
              categories={[item.title]}
              colors={['blue']}
              showXAxis={true}
              showGridLines={false}
              startEndOnly={true}
              showYAxis={false}
              showLegend={false}
              height="h-40"
            />
          </Card>
        ))}
      </ColGrid>
    </Card>
  )
}
