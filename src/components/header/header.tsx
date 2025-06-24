import UserMenu from '#/components/header/userMenu'
import SearchForm from '#/components/searchForm'
import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import Link from 'next/link'

const getUser = async () => {
  const session = await getSession()
  if (session.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { username: true, avatar: true },
    })
    return user
  }
}

export default async function Header() {
  const user = await getUser()
  return (
    <div className="dark:bg-smooth-black bg-smooth-white dark:border-dark-border border-light-border pl-gnb-left absolute top-0 left-0 z-[1000] flex w-full justify-center border-b px-4 py-2">
      <div className="w-full max-w-[500px]">
        <SearchForm />
      </div>
      <div className="font-S-CoreDream-500 absolute top-0 right-0 flex h-full items-center justify-center py-3 pr-4">
        {user ? (
          <UserMenu {...user} />
        ) : (
          <Link
            className="bg-bright-blue flex h-full items-center justify-center rounded-full px-4 text-sm"
            href="/login"
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  )
}
