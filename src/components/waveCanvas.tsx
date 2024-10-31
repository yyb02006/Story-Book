'use client'

import { useEffect, useRef } from 'react'

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ball = {
    x: 50,
    y: 50,
    radius: 20,
    dx: 2,
    dy: 2,
  }

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'blue'
    ctx.fill()
    ctx.closePath()
    if (ball.x + ball.radius > canvasRef.current.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx
    }
    if (ball.y + ball.radius > canvasRef.current.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy
    }
  }

  const updateBallPosition = () => {
    ball.y += ball.dy
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const animate = () => {
      updateBallPosition()
      drawBall(ctx)
      requestAnimationFrame(animate)
    }
    animate()
  }, [])
  return <canvas className="relative bg-red-500" ref={canvasRef}></canvas>
}
