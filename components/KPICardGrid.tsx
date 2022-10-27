import { useState } from 'react'
import { Block, Card, ColGrid, Tab, TabList, Text, Title } from '@tremor/react'
import ChartView from './ChartView'
import TableView from './TableView'
import KpiCards from './KPICards'
import ActivityOverview from './ActivityOverview'
import Charts from './Charts'
import LineChartTabs from './LineChartTabs'
import MultipleAreaChart from './MultipleAreaChart'
import { addDays, sub } from 'date-fns'

export default function KpiCardGrid() {
  const [currentStartDate, setCurrentStartDate] = useState(new Date())
  const [currentEndDate, setCurrentEndDate] = useState(new Date())

  const [selectedView, setSelectedView] = useState('1W')
  return (
    <main className="p-6 sm:p-10">
      <Card>
        <Title>Sleep Overview</Title>
        <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

        <TabList
          defaultValue={selectedView}
          handleSelect={(value) => setSelectedView(value)}
          marginTop="mt-6"
        >
          <Tab value="1W" text="1W" />
          <Tab value="1M" text="1M" />
          <Tab value="1Q" text="1Q" />
          <Tab value="6M" text="6M" />
          <Tab value="YTD" text="YTD" />
          <Tab value="1Y" text="1Y" />
        </TabList>

        {selectedView === '1W' && (
          <>
            <KpiCards
              currentStartDate={sub(currentStartDate, { weeks: 1 })}
              currentEndDate={addDays(sub(currentEndDate, { weeks: 1 }), 1)}
            />

            <Block marginTop="mt-6">
              <ChartView />
            </Block>
          </>
        )}
      </Card>
      <Block marginTop="mt-6">
        <Charts />
      </Block>
      <Block marginTop="mt-6">
        <ActivityOverview />
      </Block>

      {/* <Block marginTop="mt-6">
        <LineChartTabs />
      </Block> */}
      <Block marginTop="mt-6">
        <MultipleAreaChart />
      </Block>
    </main>
  )
}
