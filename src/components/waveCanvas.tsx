'use client'

import { useEffect, useRef } from 'react'

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ball = {
    x: 50,
    y: 50,
    radius: 20,
    dx: 0,
    dy: 2,
    max: Math.random() * 100 + 150,
  }

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'blue'
    ctx.fill()
    ctx.closePath()
    console.log(ball.y, ball.dx)
    if (ball.y < 20) {
      ball.dy = -ball.dy
    }
  }

  const updateBallPosition = () => {
    ball.dx += 0.05
    ball.y = 50 + 50 * Math.sin(ball.dx)
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
