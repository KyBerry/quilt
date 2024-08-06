import type { Component } from 'solid-js'

import { onMount } from 'solid-js'

import styles from './BaseCanvas.module.scss'

const { canvas } = styles

const BaseCanvas: Component = () => {
  let canvasRef!: HTMLCanvasElement

  onMount(() => {
    canvasRef.width = window.innerWidth
    canvasRef.height = window.innerHeight
  })

  return <canvas id={canvas} ref={canvasRef} />
}

export default BaseCanvas
