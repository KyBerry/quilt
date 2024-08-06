import { createSignal, onMount } from 'solid-js'

import type { Component } from 'solid-js'
import type { TMouseEvent } from '../../../types'

import styles from './DrawCanvas.module.scss'

const { canvas } = styles

const DrawCanvas: Component = () => {
  let canvasRef!: HTMLCanvasElement

  const [isDrawing, setIsDrawing] = createSignal(false)
  const [startX, setStartX] = createSignal(0)
  const [startY, setStartY] = createSignal(0)
  const [context, setContext] = createSignal<CanvasRenderingContext2D>()

  const handleStartDrawing = (e: TMouseEvent) => {
    setIsDrawing(true)
    setStartX(e.offsetX)
    setStartY(e.offsetY)
  }

  const handleDrawing = (e: TMouseEvent) => {
    if (!isDrawing()) return

    if (context()) {
      context()!.clearRect(0, 0, canvasRef.width, canvasRef.height)

      const width = e.offsetX - startX()
      const height = e.offsetY - startY()

      const currentRect = {
        x: width > 0 ? startX() : startX() + width,
        y: height > 0 ? startY() : startY() + height,
        width: Math.abs(width),
        height: Math.abs(height),
      }

      context()!.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height)
    }
  }

  const handleStopDrawing = (e: TMouseEvent) => {
    setIsDrawing(false)
  }

  onMount(() => {
    canvasRef.width = window.innerWidth
    canvasRef.height = window.innerHeight

    setContext(canvasRef.getContext('2d')!)
  })

  return (
    <canvas
      id={canvas}
      ref={canvasRef}
      onMouseDown={handleStartDrawing}
      onMouseMove={handleDrawing}
      onMouseUp={handleStopDrawing}
    />
  )
}

export default DrawCanvas
