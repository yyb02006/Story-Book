import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import Image from 'next/image'

const getPosts = async () => {
  const session = getSession()
  if (!session) throw new Error('no user session')
  return await prisma.post.findMany({
    select: { title: true, created_at: true, id: true, previewImageUrl: true, previewText: true },
    take: 10,
    orderBy: { id: 'desc' },
  })
}

export default async function Home() {
  const posts = await getPosts()
  return (
    <div className="font-spoqa flex flex-col items-center gap-4 px-60 font-light text-[#d0d0d0]">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex w-full min-w-[600px] space-x-3 rounded-lg bg-[#1a1a1a] px-4 py-3"
        >
          <div className="relative h-[100px] min-w-[100px]">
            {post.previewImageUrl ? (
              <Image
                src={post.previewImageUrl}
                fill={true}
                sizes="100px"
                className="rounded-md object-cover"
                alt={'no image'}
                priority
              />
            ) : (
              <div className="h-[100px] w-[100px] rounded-md bg-[#131313]" />
            )}
          </div>
          <ul className="flex w-full flex-col gap-2">
            <h1 className="font-spoqa text-2xl font-normal">{post.title}</h1>
            <li className="font-spoqa h-full text-sm font-thin">{post.previewText}</li>
            <li className="text-xs">{post.created_at.toLocaleDateString('ko-KR')}</li>
          </ul>
        </div>
      ))}
    </div>
  )
}
