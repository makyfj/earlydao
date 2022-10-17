import { Layout } from '@/components/layout'
import { PostForm } from '@/components/post-form'
import ImportTabs from '@/components/import-tabs'
import { trpc } from '@/lib/trpc'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from '@/components/button'

const ImportDataPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Import Data - EARLY</title>
      </Head>

      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Import data
      </h1>

      <div className="mt-6">
        <ImportTabs />
      </div>
    </>
  )
}

ImportDataPage.auth = true

ImportDataPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default ImportDataPage
