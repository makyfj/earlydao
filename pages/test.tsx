import { trpc } from '@/lib/trpc'

const Test = () => {
  const { data } = trpc.greeting.useQuery()
  console.log('Data', data)
  return <div>Test</div>
}

export default Test
