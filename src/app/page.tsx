import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div>Story Book</div>
      <Link href="/story">나만의 이야기 만들기</Link>
    </div>
  )
}
