import getSession from '#/libs/server/session'
import { NextRequest, NextResponse } from 'next/server'

interface Routes {
  [key: string]: boolean
}

const publicOnlyUrls: Routes = {
  '/login': true,
  '/signup': true,
}

const signedOnlyUrls: Routes = {
  '/write': true,
  '/favortie': true,
  '/story': true,
  '/search': true,
}

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const {
    nextUrl: { pathname },
    url,
  } = request
  if (!session.id) {
    console.log('no session')

    if (signedOnlyUrls[pathname]) {
      return NextResponse.redirect(new URL('/', url))
    }
  } else {
    console.log('no session')
    if (publicOnlyUrls[pathname]) {
      return NextResponse.redirect(new URL('/', url))
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.png$).*)'],
}
