import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
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

      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Dashboard
      </h1>

      <div className="mt-6"></div>
    </>
  )
}

DashboardPage.auth = true

DashboardPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default DashboardPage
