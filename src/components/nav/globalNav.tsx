import WaveCanvas from '#/components/waveCanvas'
import { cls } from '#/libs/client/utils'

export default function GlobalNav() {
  const wave = {
    colors: ['rgba(29, 42, 120, 0.8)', 'rgba(44, 62, 80, 0.3)', 'rgba(236, 240, 241, 0.3)'],
    width: 40,
    pointCountEachWave: 60,
    speed: 0.05,
  }
  return (
    <nav className="fixed h-screen w-20">
      {wave.colors.map((color) => (
        <div key={color} className={cls('absolute size-full')} style={{ backgroundColor: color }} />
      ))}
      <ul className="relative">
        <h1>myname</h1>
        <li></li>
      </ul>
      <div className={cls('absolute top-0')} style={{ right: -wave.width }}>
        <WaveCanvas {...wave} />
      </div>
    </nav>
  )
}
