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
  const pointConfig = { pointCount: 10, pointSpeed: 0.05 }

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const createPoint = (x: number, y: number, phaseShift: number): Point => {
    return { x, y, initialX: x, radius: 20, phaseX: 0, phaseShift }
  }

  const updatePoints = (points: Point[]) => {
    points.forEach((point, index, originalArray) => {
      if (index > 0 && index < originalArray.length - 1) {
        const { initialX, phaseShift } = point
        const offset = initialX
        const amplitudeScale = initialX * Math.sin(point.phaseX + phaseShift)
        point.phaseX += pointConfig.pointSpeed
        point.x = offset + amplitudeScale
      }
    })
  }

  // quadraticCurveTo 작동 원리 알아보기 (이전 점과 현재 점의 평균 좌표를 넘겨줘야하는 이유에 대해)
  // resize시 곡선도 따라가거나 안따라가더라도 찌그러지지 않도록 기능 추가 필요
  const drawPoints = (ctx: CanvasRenderingContext2D, canvasHeight: number, points: Point[]) => {
    const [firstPoint, lastPoint] = [points[0], points[points.length - 1]]

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)

    points.forEach((point, index, originalArray) => {
      if (index === 0) return
      const prevPoint = originalArray[index - 1]
      ctx.quadraticCurveTo(
        prevPoint.x,
        prevPoint.y,
        (prevPoint.x + point.x) / 2,
        (prevPoint.y + point.y) / 2,
      )

      // 마지막 point 추가
      if (index === originalArray.length - 1) ctx.lineTo(lastPoint.x, lastPoint.y)
    })

    ctx.lineTo(0, canvasHeight)
    ctx.lineTo(0, 0)
    ctx.fillStyle = 'blue'
    ctx.fill()
    ctx.closePath()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    canvas.height = window.innerHeight

    const points = Array.from({ length: pointConfig.pointCount }).map((_, index, originalArray) =>
      createPoint(canvas.width / 2, (canvas.height * index) / (originalArray.length - 1), index),
    )

    const animate = () => {
      clearCanvas(ctx)
      drawPoints(ctx, canvas.height, points)
      updatePoints(points)
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
      className="relative bg-red-500"
      ref={canvasRef}
      width={480}
      height={canvasRef.current?.height}
    ></canvas>
  )
}
