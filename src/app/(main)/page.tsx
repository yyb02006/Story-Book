import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import sanitizeHtml from 'sanitize-html'

const getPosts = async () => {
  const session = getSession()
  if (!session) throw new Error('no user session')
  return await prisma.post.findMany({
    select: { created_at: true, htmlContent: true, title: true },
    take: 10,
    orderBy: { id: 'desc' },
  })
}

export default async function Home() {
  const posts = await getPosts()
  return (
    <div className="flex size-full flex-col items-center">
      {posts.map((post) => (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.htmlContent, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
              allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['data']),
            }),
          }}
          key={post.created_at.getDate()}
        />
      ))}
    </div>
  )
}
