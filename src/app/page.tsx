import Link from 'next/link'

export default function Home() {
  return (
    <section>
      <h1>Story Book</h1>
      <Link href="/story">나만의 이야기 만들기</Link>
    </section>
  )
}
