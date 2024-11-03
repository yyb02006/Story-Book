'use client'

import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  initialX: number
  radius: number
  phaseX: number
  phaseShift: number
}

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveConfig = {
    width: 30,
    colors: ['blue', 'crimson', 'purple'],
    pointCount: 20,
    speed: 0.05,
  }

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const createPoint = (x: number, y: number, phaseShift: number): Point => {
    return { x, y, initialX: x, radius: 20, phaseX: 0, phaseShift }
  }

  const updateWaves = (wave: Point[]) => {
    wave.forEach((point, index, originalArray) => {
      if (index > 0 && index < originalArray.length - 1) {
        const { initialX, phaseShift } = point
        const offset = initialX
        const amplitudeScale = initialX * Math.sin(point.phaseX + phaseShift)
        point.phaseX += waveConfig.speed
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
        point.initialX * Math.sin(point.phaseX + point.phaseShift + shiftFactor)
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
    ctx.globalAlpha = 0.3
    ctx.fill()
    ctx.closePath()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    canvas.height = window.innerHeight

    // 여러개의 웨이브를 각자 생성하는 방법
    const waves = waveConfig.colors.map((color, waveIdx, originalArray) => {
      const shiftFactor = (2 * Math.PI * waveIdx) / (originalArray.length * 2)
      return {
        color,
        wave: Array.from({ length: waveConfig.pointCount }, (_, pointIdx) =>
          createPoint(
            canvas.width / 2,
            (canvas.height * pointIdx) / (waveConfig.pointCount - 1),
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
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      className="relative"
      ref={canvasRef}
      width={waveConfig.width}
      height={canvasRef.current?.height}
    />
  )
}
