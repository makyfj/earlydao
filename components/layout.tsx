import { Avatar } from '@/components/avatar'
import { ButtonLink } from '@/components/button-link'
import { Footer } from '@/components/footer'
import { IconButton } from '@/components/icon-button'
import { Logo, SearchIcon } from '@/components/icons'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { SearchDialog } from '@/components/search-dialog'
import { capitalize } from '@/lib/text'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Head from 'next/head'
import * as React from 'react'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const { theme, themes, setTheme } = useTheme()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)

  React.useEffect(() => {
    // set system mode by default on page load
    setTheme('system')
  }, [])

  return (
    <>
      <Head>
        <title>EARLY - DAO for longevity practitioners</title>
        <meta
          name="description"
          content="Optimize your longevity, gain the tools, insights, and frameworks you need to live longer and more importantly, live better."
        />
      </Head>
      <div className="max-w-4xl px-6 mx-auto">
        <header className="flex items-center justify-between gap-4 py-12 md:py-20">
          <Link href="/">
            {/* <a>
            <Logo className="w-auto text-red-light h-[34px]" />
          </a> */}
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              EARLY
            </h2>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <IconButton
              variant="secondary"
              onClick={() => {
                setIsSearchDialogOpen(true)
              }}
            >
              <SearchIcon className="w-4 h-4" />
            </IconButton>

            <Menu>
              <MenuButton className="relative inline-flex rounded-full group focus-ring">
                <Avatar
                  name={session!.user.name}
                  src={session!.user.image}
                  size="sm"
                />
              </MenuButton>

              <MenuItems className="w-48">
                <MenuItemsContent>
                  {/* <MenuItemLink href={`/dao`}>DAO</MenuItemLink> */}
                  {/* <MenuItemLink href={`/data`}>Data</MenuItemLink> */}
                  <MenuItemLink href={`/feed`}>Feed</MenuItemLink>
                  <MenuItemLink href={`/import`}>Import</MenuItemLink>
                  <MenuItemLink href={`/profile/${session!.user.id}`}>
                    Profile
                  </MenuItemLink>
                  {/* <MenuItemLink href={`/calendar`}>Calendar</MenuItemLink> */}
                  <MenuItemLink href={`/dashboard`}>Dashboard</MenuItemLink>
                  <MenuItemButton onClick={() => signOut()}>
                    Log out
                  </MenuItemButton>
                </MenuItemsContent>
                <div className="flex items-center gap-4 px-4 py-3 rounded-b bg-secondary">
                  <label htmlFor="theme" className="text-sm">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={theme}
                    onChange={(event) => {
                      setTheme(event.target.value)
                    }}
                    className="block w-full py-1.5 text-xs border rounded shadow-sm bg-primary border-secondary"
                  >
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {capitalize(theme)}
                      </option>
                    ))}
                  </select>
                </div>
              </MenuItems>
            </Menu>

            <ButtonLink href="/new">
              <span className="sm:hidden">Post</span>
              <span className="hidden sm:block shrink-0">New post</span>
            </ButtonLink>
          </div>
        </header>

        <main>{children}</main>

        <div className="py-20">
          <Footer />
        </div>

        <SearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => {
            setIsSearchDialogOpen(false)
          }}
        />
      </div>
    </>
  )
}
