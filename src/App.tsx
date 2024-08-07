import { createSignal } from 'solid-js'

import { Toolbar } from './components'
import { BaseCanvas, DrawCanvas } from './components/canvas'

import type { Mode } from './types'

import styles from './App.module.scss'

const { container } = styles

const App = () => {
  const [mode, setMode] = createSignal<Mode>('select')

  return (
    <div id={container}>
      <Toolbar mode={mode} setMode={setMode} />
      <BaseCanvas />
      {mode() !== 'select' && <DrawCanvas setMode={setMode} />}
    </div>
  )
}

export default App
