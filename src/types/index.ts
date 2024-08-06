import type { DOMElement } from 'solid-js/jsx-runtime'

export type ChangeEvent = Event & {
  currentTarget: HTMLInputElement
  target: HTMLInputElement
}

export type TMouseEvent = MouseEvent & {
  currentTarget: HTMLCanvasElement
  target: DOMElement
}

export type Mode = 'select' | 'rectangle'

export type Rectangle = {
  x: number
  y: number
  width: number
  height: number
}
