import getSession from '#/libs/server/session'
import { NextRequest, NextResponse } from 'next/server'

interface Routes {
  [key: string]: boolean
}

const publicOnlyUrls: Routes = {
  '/': true,
  '/login': true,
  '/signup': true,
  '/find': true,
  '/github/start': true,
  '/github/complete': true,
  '/sns_auth/github/start': true,
}

export async function middleware(request: NextRequest) {
  const session = await getSession()
  if (!session.id) {
    if (!publicOnlyUrls[request.nextUrl.pathname]) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else {
  }
  /*   console.log(request.nextUrl)
  console.log(publicOnlyUrls[request.nextUrl.pathname])
  console.log(request.url) */
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.png$).*)'],
}
