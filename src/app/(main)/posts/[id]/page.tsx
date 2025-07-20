import PostDetailContainer from '#/components/PostDetailContainer'
import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import { notFound } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'

interface PostPageProps {
  params: {
    id: string
  }
}

const getPost = async (id: number) => {
  return await prisma.post.findUnique({
    where: { id },
    include: { user: { select: { username: true, avatar: true } } },
  })
}

const getIsOwner = async (id: number) => {
  const session = await getSession()
  if (session.id) {
    return session.id === id
  }
}

export default async function Posts({ params }: PostPageProps) {
  const id = Number(params.id)
  console.log(params)

  if (isNaN(id)) {
    return notFound()
  }
  const post = await getPost(id)
  console.log(post)

  if (!post) {
    return notFound()
  }
  const isOwner = getIsOwner(post.userId)
  const sanitizedHtml = sanitizeHtml(post.htmlContent, {
    allowedAttributes: { '*': ['style', 'class', 'dir', 'value'] },
  })
  return <PostDetailContainer dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
