/* eslint-disable react/function-component-definition */
import { Card, AreaChart, Title, Text } from '@tremor/react'

const data = [
  {
    Month: 'Jun 22',
    Weight: 157.5,
    Muscle: 133.8,
    Bone: 7.0,
    Fat: 16.6,
  },
  {
    Month: 'Jul 22',
    Weight: 159.1,
    Muscle: 134.6,
    Bone: 7.1,
    Fat: 17.4,
  },
  {
    Month: 'Aug 22',
    Weight: 160.3,
    Muscle: 136.0,
    Bone: 7.2,
    Fat: 17.2,
  },
  {
    Month: 'Sep 22',
    Weight: 160.3,
    Muscle: 135.8,
    Bone: 7.2,
    Fat: 17.2,
  },
  {
    Month: 'Oct 22',
    Weight: 160.4,
    Muscle: 135.8,
    Bone: 7.1,
    Fat: 17.4,
  },
]

const valueFormatter = (number: number) => `${number.toString()} lbs`

export default function MultipleAreaChart() {
  return (
    <Card>
      <Title>Body Composition</Title>
      <Text>Comparison between Weight, Muscle, Bone, and Fat mass</Text>
      <AreaChart
        marginTop="mt-4"
        data={data}
        categories={['Weight', 'Muscle', 'Bone', 'Fat']}
        dataKey="Month"
        colors={['indigo', 'fuchsia', 'teal', 'rose']}
        valueFormatter={valueFormatter}
        height="h-80"
      />
    </Card>
  )
}
