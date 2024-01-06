import { componentName } from '../component/componentName'
import { mouseSystem } from '../system/mouse/mouse'
import { keyboardSystem } from '../system/keyboard/keyboard'
import { eventSystem } from '../event'
import { InitialState } from '../type'

export const getInitialState = (): InitialState => ({
  entity: new Map(),
  component: {
    [componentName.mouse]: new Map(),
    [componentName.keyboard]: new Map(),
  },
  globalSystem: [],
  system: [],
})

export const getSystems = ({
  state,
  document,
  containerId,
}: {
  state: InitialState
  document?: Document
  containerId?: string
}) => {
  state = eventSystem(state)

  if (containerId) {
    state = mouseSystem({
      state,
      document: document ?? window.document,
      containerId,
    })
    state = keyboardSystem({
      state,
      document: document ?? window.document,
      containerId,
    })
  }

  return state
}

export const getInitialStateWithSystems = () =>
  getSystems({
    state: getInitialState(),
    document,
  })
