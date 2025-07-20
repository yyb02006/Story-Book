interface PostDetailContainerProps {
  dangerouslySetInnerHTML:
    | {
        __html: string | TrustedHTML
      }
    | undefined
}

export default function PostDetailContainer({ dangerouslySetInnerHTML }: PostDetailContainerProps) {
  return (
    <div className="flex justify-center">
      <div
        className="font-spoqa post max-w-[1000px] font-thin"
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    </div>
  )
}
