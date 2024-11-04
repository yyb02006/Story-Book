'use client'

import { WaveWithInitAnim } from '#/components/waveCanvas'
import { cls } from '#/libs/client/utils'
import { motion } from 'framer-motion'

export default function GlobalNav() {
  const wave = {
    colors: ['rgba(29, 42, 120, 0.8)', 'rgba(44, 62, 80, 0.3)', 'rgba(236, 240, 241, 0.3)'],
    width: 20,
    pointCountEachWave: 60,
    speed: 0.05,
  }
  return (
    <motion.nav
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      className="fixed h-screen w-20"
    >
      {wave.colors.map((color) => (
        <div key={color} className={cls('absolute size-full')} style={{ backgroundColor: color }} />
      ))}
      <ul className="relative">
        <h1>myname</h1>
        <li></li>
      </ul>
      <WaveWithInitAnim {...wave} />
    </motion.nav>
  )
}
