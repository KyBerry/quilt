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

      context()!.strokeStyle = 'white'
      context()!.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height)

      // Set the style for the guidelines
      context()!.strokeStyle = 'red'
      context()!.lineWidth = 1

      // Draw the width guideline
      context()!.beginPath()
      context()!.moveTo(currentRect.x, currentRect.y - 10)
      context()!.lineTo(currentRect.x + currentRect.width, currentRect.y - 10)
      context()!.stroke()

      // Draw the height guideline
      context()!.beginPath()
      context()!.moveTo(currentRect.x - 10, currentRect.y)
      context()!.lineTo(currentRect.x - 10, currentRect.y + currentRect.height)
      context()!.stroke()

      // Draw the width text
      context()!.fillStyle = 'red'
      context()!.textAlign = 'center'
      const widthText = `Width: ${currentRect.width}px`
      const widthTextX = currentRect.x + currentRect.width / 2
      const widthTextY = currentRect.y - 26
      context()!.fillText(widthText, widthTextX, widthTextY)

      // Draw the height text
      const heightText = `Height: ${currentRect.height}px`
      const heightTextX = currentRect.x - 50
      const heightTextY = currentRect.y + currentRect.height / 2
      context()!.fillText(heightText, heightTextX, heightTextY)
    }
  }

  const handleStopDrawing = () => {
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
