import { WideLayout } from '@/components/wide-layout'
import { trpc } from '@/lib/trpc'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import DataDashboard from '@/components/DataDashboard'

const DataPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Data - EarlyDAO</title>
      </Head>

      <div className="">
        <DataDashboard />
      </div>
    </>
  )
}

DataPage.auth = true

DataPage.getLayout = function getLayout(page: React.ReactElement) {
  return <WideLayout>{page}</WideLayout>
}

export default DataPage
