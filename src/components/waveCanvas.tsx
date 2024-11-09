'use client'

import { cls } from '#/libs/client/utils'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  initialX: number
  radius: number
  phaseX: number
  phaseXShift: number
}

interface WaveCanvasProps {
  width: number
  colors: string[]
  pointCountEachWave: number
  speed: number
}

export function WaveCanvas({ colors, pointCountEachWave, speed, width }: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const createPoint = (x: number, y: number, phaseXShift: number): Point => {
    const min = Math.round(width / 8)
    const initialX = Math.random() * (x - min) + min
    return { x, y, initialX, radius: 20, phaseX: 0, phaseXShift }
  }

  const updateWaves = (wave: Point[]) => {
    wave.forEach((point, index, originalArray) => {
      if (index > 0 && index < originalArray.length - 1) {
        const { initialX, phaseXShift } = point
        const offset = initialX
        const amplitudeScale = initialX * Math.sin(point.phaseX + phaseXShift)
        point.phaseX += speed
        point.x = offset + amplitudeScale
      }
    })
  }

  // quadraticCurveTo 작동 원리 알아보기 (이전 점과 현재 점의 평균 좌표를 넘겨줘야하는 이유에 대해)
  // resize시 곡선도 따라가거나 안따라가더라도 찌그러지지 않도록 기능 추가 필요
  const drawWave = (
    ctx: CanvasRenderingContext2D,
    canvasHeight: number,
    wave: Point[],
    color: string,
    // waveCount: number,
  ) => {
    const [firstPoint, lastPoint] = [wave[0], wave[wave.length - 1]]

    /*
    하나의 웨이브를 기준으로 여러개의 다른 웨이브를 생성하는 방법
    
    const getShiftedPoint = (point: Point, waveIdx: number) => {
      const currentOffset = point.initialX
      const shiftFactor = (2 * Math.PI * waveIdx) / waveCount
      const currentAmplitudeScale =
        point.initialX * Math.sin(point.phaseX + point.phaseXShift + shiftFactor)
      return currentOffset + currentAmplitudeScale
    } 
      
    Array.from({ length: waveCount }).forEach((_, waveIdx) => {
      ctx.beginPath()
      ctx.moveTo(firstPoint.x, firstPoint.y)

      wave.forEach((point, pointIdx, originalArray) => {
        if (pointIdx === 0) return
        const currentX = getShiftedPoint(point, waveIdx)

        const prevPoint = originalArray[pointIdx - 1]
        const prevX = getShiftedPoint(prevPoint, waveIdx)

        ctx.quadraticCurveTo(
          prevX,
          prevPoint.y,
          (prevX + currentX) / 2,
          (prevPoint.y + point.y) / 2,
        )

        // 마지막 point 추가
        if (pointIdx === originalArray.length - 1) ctx.lineTo(lastPoint.x, lastPoint.y)
      })

      ctx.lineTo(0, canvasHeight)
      ctx.lineTo(0, 0)
      ctx.fillStyle = 'blue'
      ctx.fill()
      ctx.closePath()
    })
    */

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)

    wave.forEach((point, pointIdx, originalArray) => {
      if (pointIdx === 0) return
      const prevPoint = originalArray[pointIdx - 1]

      ctx.quadraticCurveTo(
        prevPoint.x,
        prevPoint.y,
        (prevPoint.x + point.x) / 2,
        (prevPoint.y + point.y) / 2,
      )

      // 마지막 point 추가
      if (pointIdx === originalArray.length - 1) ctx.lineTo(lastPoint.x, lastPoint.y)
    })

    ctx.lineTo(0, canvasHeight)
    ctx.lineTo(0, 0)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  }

  useEffect(() => {
    const breakPoint = 1080
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const setCanvasHeight = (breakPoint: number) => {
      canvas.height = window.innerHeight > breakPoint ? window.innerHeight : breakPoint
    }

    setCanvasHeight(breakPoint)

    // 여러개의 웨이브를 각자 생성하는 방법
    const waves = colors.map((color, waveIdx, originalArray) => {
      const shiftFactor = (2 * Math.PI * waveIdx) / (originalArray.length * 2)
      return {
        color,
        wave: Array.from({ length: pointCountEachWave }, (_, pointIdx) =>
          createPoint(
            canvas.width / 2,
            (canvas.height * pointIdx) / (pointCountEachWave - 1),
            pointIdx + shiftFactor,
          ),
        ),
      }
    })

    const animate = () => {
      clearCanvas(ctx)
      waves.forEach(({ color, wave }) => {
        drawWave(ctx, canvas.height, wave, color)
        updateWaves(wave)
      })
      requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      setCanvasHeight(breakPoint)
      waves.map((wave) =>
        wave.wave.map(
          (point, index) => (point.y = (canvas.height * index) / (pointCountEachWave - 1)),
        ),
      )
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas className="relative" ref={canvasRef} width={width} height={canvasRef.current?.height} />
  )
}

export const WaveWithInitAnim = (wave: WaveCanvasProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0, originX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      className={cls('absolute top-0')}
      style={{ right: -wave.width }}
    >
      <WaveCanvas {...wave} />
    </motion.div>
  )
}
