import { Card, Title, Text, Tab, TabList, ColGrid, Block } from '@tremor/react'

import { useState } from 'react'
import TableView from './TableView'

export default function DataDashboard() {
  const [selectedView, setSelectedView] = useState(1)
  return (
    <main className="p-6 sm:p-10">
      <Card>
        <Title>Data</Title>
        <Text>
          All the data you have uploaded to the platform in one place.
        </Text>

        <TabList
          defaultValue={1}
          handleSelect={(value) => setSelectedView(value)}
          marginTop="mt-6"
        >
          <Tab value={1} text="Oura" />
          <Tab value={2} text="Apple Workouts" />
          <Tab value={3} text="Apple Health" />
          <Tab value={4} text="Levels" />
          <Tab value={5} text="Misc" />
        </TabList>

        {selectedView === 1 ? (
          <Block marginTop="mt-6">
            <TableView />
          </Block>
        ) : (
          <Block marginTop="mt-6">
            <TableView />
          </Block>
        )}
      </Card>
    </main>
  )
}
