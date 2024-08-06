import type { Accessor, Component, Setter } from 'solid-js'
import type { ChangeEvent, Mode } from '../../types'

import styles from './Toolbar.module.scss'

const { toolbar } = styles

type ToolbarProps = {
  mode: Accessor<Mode>
  setMode: Setter<Mode>
}

const Toolbar: Component<ToolbarProps> = ({ mode, setMode }) => {
  const handleModeChange = (e: ChangeEvent) => {
    setMode(e.currentTarget.value as Mode)
  }

  return (
    <section id={toolbar}>
      <div>
        <label for="select">Select</label>
        <input
          checked={mode() === 'select'}
          id="select"
          name="mode"
          type="radio"
          value="select"
          onChange={handleModeChange}
        />
      </div>
      <div>
        <label for="rectangle">Rectangle</label>
        <input
          checked={mode() === 'rectangle'}
          id="rectangle"
          name="mode"
          type="radio"
          value="rectangle"
          onChange={handleModeChange}
        />
      </div>
    </section>
  )
}

export default Toolbar
