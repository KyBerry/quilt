import { createSignal, onMount, onCleanup } from 'solid-js'
import type { Component } from 'solid-js'
import type { TMouseEvent } from '../../../types'
import styles from './DrawCanvas.module.scss'

const { canvas } = styles

const DrawCanvas: Component = () => {
  let canvasRef!: HTMLCanvasElement
  const [dpi, setDpi] = createSignal(window.devicePixelRatio)
  const [isDrawing, setIsDrawing] = createSignal(false)
  const [startPos, setStartPos] = createSignal({ x: 0, y: 0 })
  const [context, setContext] = createSignal<CanvasRenderingContext2D>()

  const getTransformedPoint = (e: TMouseEvent) => {
    const ctx = context()
    if (!ctx) return { x: e.offsetX, y: e.offsetY }
    const rect = canvasRef.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvasRef.width / rect.width)
    const y = (e.clientY - rect.top) * (canvasRef.height / rect.height)
    const transform = ctx.getTransform()
    const invertedScaleX = 1 / transform.a
    const invertedScaleY = 1 / transform.d
    return {
      x: x * invertedScaleX,
      y: y * invertedScaleY,
    }
  }

  const handleStartDrawing = (e: TMouseEvent) => {
    const pos = getTransformedPoint(e)
    setIsDrawing(true)
    setStartPos(pos)
  }

  const handleDrawing = (e: TMouseEvent) => {
    if (!isDrawing()) return
    const ctx = context()
    if (!ctx) return

    const currentPos = getTransformedPoint(e)
    const start = startPos()

    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
    const width = currentPos.x - start.x
    const height = currentPos.y - start.y
    const currentRect = {
      x: width > 0 ? start.x : start.x + width,
      y: height > 0 ? start.y : start.y + height,
      width: Math.abs(width),
      height: Math.abs(height),
    }

    ctx.strokeStyle = 'white'
    ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height)

    // Set the style for the guidelines
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 1

    // Draw the width guideline
    ctx.beginPath()
    ctx.moveTo(currentRect.x, currentRect.y - 10)
    ctx.lineTo(currentRect.x + currentRect.width, currentRect.y - 10)
    ctx.stroke()

    // Draw the height guideline
    ctx.beginPath()
    ctx.moveTo(currentRect.x - 10, currentRect.y)
    ctx.lineTo(currentRect.x - 10, currentRect.y + currentRect.height)
    ctx.stroke()

    // Draw the width text
    ctx.fillStyle = 'red'
    ctx.textAlign = 'center'
    const widthText = `Width: ${Math.round(currentRect.width)}px`
    const widthTextX = currentRect.x + currentRect.width / 2
    const widthTextY = currentRect.y - 26
    ctx.fillText(widthText, widthTextX, widthTextY)

    // Draw the height text
    const heightText = `Height: ${Math.round(currentRect.height)}px`
    const heightTextX = currentRect.x - 50
    const heightTextY = currentRect.y + currentRect.height / 2
    ctx.fillText(heightText, heightTextX, heightTextY)
  }

  const handleStopDrawing = () => {
    setIsDrawing(false)
  }

  const resizeCanvas = () => {
    const { innerWidth, innerHeight } = window
    const currentDpi = window.devicePixelRatio

    canvasRef.width = innerWidth * currentDpi
    canvasRef.height = innerHeight * currentDpi
    canvasRef.style.width = `${innerWidth}px`
    canvasRef.style.height = `${innerHeight}px`

    const ctx = canvasRef.getContext('2d')!
    ctx.scale(currentDpi, currentDpi)
    setContext(ctx)
    setDpi(currentDpi)
  }

  onMount(() => {
    resizeCanvas()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    onCleanup(() => {
      window.removeEventListener('resize', handleResize)
    })
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
