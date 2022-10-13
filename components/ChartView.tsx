import { useState } from 'react'
import {
  AreaChart,
  Block,
  ButtonInline,
  Card,
  Flex,
  Footer,
  Icon,
  Text,
  Title,
  Toggle,
  ToggleItem,
} from '@tremor/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

export const performance = [
  {
    date: '2021-01-01',
    Sleep: 900.73,
    RHR: 173,
    HRV: 73,
  },
  {
    date: '2021-01-02',
    Sleep: 1000.74,
    RHR: 174.6,
    HRV: 74,
  },
  // ...
  {
    date: '2021-03-13',
    Sleep: 882,
    RHR: 682,
    HRV: 682,
  },
]

// Basic formatters for the chart values
const dollarFormatter = (value: number) =>
  `$ ${Intl.NumberFormat('us').format(value).toString()}`

const numberFormatter = (value: number) =>
  `${Intl.NumberFormat('us').format(value).toString()}`

export default function ChartView() {
  const [selectedKpi, setSelectedKpi] = useState('Sleep')

  // map formatters by selectedKpi
  const formatters: { [key: string]: any } = {
    Sleep: numberFormatter,
    RHR: numberFormatter,
    HRV: numberFormatter,
  }

  return (
    <Card>
      <div className="md:flex justify-between">
        <Block>
          <Flex
            justifyContent="justify-start"
            spaceX="space-x-0.5"
            alignItems="items-center"
          >
            <Title> Performance History </Title>
            <Icon
              Icon={InformationCircleIcon}
              variant="simple"
              tooltip="Shows day-over-day (%) changes of past performance"
            />
          </Flex>
          <Text> Daily increase or decrease per domain </Text>
        </Block>
        <div className="mt-6 md:mt-0">
          <Toggle
            color="zinc"
            defaultValue={selectedKpi}
            handleSelect={(value) => setSelectedKpi(value)}
          >
            <ToggleItem value="Sleep" text="Sleep" />
            <ToggleItem value="RHR" text="RHR" />
            <ToggleItem value="HRV" text="HRV" />
          </Toggle>
        </div>
      </div>
      <AreaChart
        data={performance}
        dataKey="date"
        categories={[selectedKpi]}
        colors={['blue']}
        showLegend={false}
        valueFormatter={formatters[selectedKpi]}
        yAxisWidth="w-14"
        height="h-96"
        marginTop="mt-8"
      />
    </Card>
  )
}
