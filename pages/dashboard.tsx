import { WideLayout } from '@/components/wide-layout'
import KpiCardGrid from '@/components/KpiCardGrid'
import { trpc } from '@/lib/trpc'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Dashboard - EarlyDAO</title>
      </Head>

      <div className="">
        <KpiCardGrid />
      </div>
    </>
  )
}

DashboardPage.auth = true

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <WideLayout>{page}</WideLayout>
}

export default DashboardPage
