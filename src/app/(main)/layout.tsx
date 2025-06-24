import GlobalNav from '#/components/nav/globalNav'
import Header from '#/components/header/header'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <GlobalNav />
      <div className="pl-gnb-left pt-gsb-top universe-box-shadow h-full min-h-screen">
        {children}
      </div>
    </>
  )
}
