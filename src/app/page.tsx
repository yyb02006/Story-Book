import Link from 'next/link'

export default function Home() {
  return (
    <section className="h-screen w-screen bg-gradient-to-br from-[#000428] to-[#004e92] universe-box-shadow">
      <h1>Story Book</h1>
      <Link href="/story">나만의 이야기 만들기</Link>
    </section>
  )
}
