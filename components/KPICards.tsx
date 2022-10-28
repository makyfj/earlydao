import { trpc } from '@/lib/trpc'
import {
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  DeltaType,
  Color,
  ColGrid,
} from '@tremor/react'

const colors: { [key: string]: Color } = {
  increase: 'emerald',
  moderateIncrease: 'emerald',
  unchanged: 'orange',
  moderateDecrease: 'rose',
  decrease: 'rose',
}

const categories: {
  title: string
  metric: string
  metricPrev: string
  delta: string
  deltaType: DeltaType
}[] = [
  {
    title: 'Sleep',
    metric: '8h 32m',
    metricPrev: '8h 18m',
    delta: '2.7%',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Resting Heart Rate',
    metric: '46 bpm',
    metricPrev: '48 bpm',
    delta: '4.2%',
    deltaType: 'moderateDecrease',
  },
  {
    title: 'Heart Rate Variability',
    metric: '57 ms',
    metricPrev: '49 ms',
    delta: '16.3%',
    deltaType: 'moderateIncrease',
  },
]

type DateProps = {
  currentStartDate: Date
  currentEndDate: Date
}
export default function KPICards({
  currentStartDate,
  currentEndDate,
}: DateProps) {
  const ouraQueryCurrent = trpc.useQuery([
    'oura.get-range',
    {
      startDate: currentStartDate,
      endDate: currentEndDate,
    },
  ])

  console.log(ouraQueryCurrent)

  return (
    <ColGrid
      numColsSm={2}
      numColsLg={3}
      marginTop="mt-6"
      gapX="gap-x-6"
      gapY="gap-y-6"
    >
      {categories.map((item) => (
        <Card key={item.title}>
          <Text>{item.title}</Text>
          <Flex
            justifyContent="justify-start"
            alignItems="items-baseline"
            spaceX="space-x-3"
            truncate={true}
          >
            <Metric>{item.metric}</Metric>
            <Text truncate={true}>from {item.metricPrev}</Text>
          </Flex>
          <Flex
            justifyContent="justify-start"
            spaceX="space-x-2"
            marginTop="mt-4"
          >
            <BadgeDelta deltaType={item.deltaType} />
            <Flex
              justifyContent="justify-start"
              spaceX="space-x-1"
              truncate={true}
            >
              <Text color={colors[item.deltaType]}>{item.delta}</Text>
              <Text truncate={true}> to previous month </Text>
            </Flex>
          </Flex>
        </Card>
      ))}
    </ColGrid>
  )
}
