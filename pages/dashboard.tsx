import { WideLayout } from '@/components/wide-layout'
import KpiCardGrid from '@/components/KPICardGrid'
import { trpc } from '@/lib/trpc'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import LineChartTabs from '@/components/LineChartTabs'
import { subDays } from 'date-fns'

const DashboardPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Dashboard - EARLY</title>
      </Head>

      <div className="flex flex-col items-center justify-center">
        <KpiCardGrid />
        <LineChartTabs />
      </div>
    </>
  )
}

DashboardPage.auth = true

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <WideLayout>{page}</WideLayout>
}

export default DashboardPage
