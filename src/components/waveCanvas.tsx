'use client'

import { useEffect, useRef } from 'react'

interface Ball {
  x: number
  y: number
  fixedY: number
  radius: number
  dx: number
  max: number
}

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const createBall = (x: number, y: number) => {
    return { x, y, fixedY: y, radius: 20, dx: 0, max: 150 }
  }

  const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
    if (!canvasRef.current) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'blue'
    ctx.fill()
    ctx.closePath()
  }

  const updateBallPosition = (ball: Ball) => {
    ball.dx += 0.05
    ball.x = ball.max + ball.fixedY * Math.sin(ball.dx)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const animateWrapper = (x: number, y: number) => {
      const ball: Ball = createBall(x, y)
      const animate = () => {
        updateBallPosition(ball)
        drawBall(ctx, ball)
        requestAnimationFrame(animate)
      }
      animate()
    }
    animateWrapper(50, 50)
  }, [])

  return <canvas className="relative bg-red-500" ref={canvasRef} width={480} height={270}></canvas>
}
