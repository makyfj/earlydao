import { useState } from 'react'
import { Block, Card, ColGrid, Tab, TabList, Text, Title } from '@tremor/react'
import ChartView from './ChartView'
import TableView from './TableView'
import KpiCards from './KPICards'
import ActivityOverview from './ActivityOverview'
import Charts from './Charts'
import LineChartTabs from './LineChartTabs'

export default function KpiCardGrid() {
  const [selectedView, setSelectedView] = useState(1)
  return (
    <main className="p-6 sm:p-10">
      <Title>Dashboard</Title>
      {/* <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text> */}

      <TabList
        defaultValue={1}
        handleSelect={(value) => setSelectedView(value)}
        marginTop="mt-6"
      >
        <Tab value={1} text="Overview" />
        <Tab value={2} text="Detail" />
      </TabList>

      {selectedView === 1 ? (
        <>
          <KpiCards />

          <Block marginTop="mt-6">
            <Card>
              <ChartView />
            </Card>
          </Block>
        </>
      ) : (
        <Block marginTop="mt-6">
          <Card>
            <TableView />
          </Card>
        </Block>
      )}
      <Block marginTop="mt-6">
        <ActivityOverview />
      </Block>
      <Block marginTop="mt-6">
        <Charts />
      </Block>
      <Block marginTop="mt-6">
        <LineChartTabs />
      </Block>
    </main>
  )
}
