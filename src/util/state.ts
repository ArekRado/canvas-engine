import { componentName } from '../component/componentName'
import { mouseSystem } from '../system/mouse/mouse'
import { keyboardSystem } from '../system/keyboard/keyboard'
import { eventSystem } from '../event'
import { AnyState, InternalInitialState } from '../type'

export const getInitialState = (): InternalInitialState => ({
  entity: {},
  component: {
    [componentName.mouse]: {},
    [componentName.keyboard]: {},
  },
  globalSystem: [],
  system: [],
  animationFrame: -1,
})

export const getSystems = ({
  state,
  document,
  containerId,
}: {
  state: AnyState
  document?: Document
  containerId?: string
}): InternalInitialState => {
  let internatlState = state as InternalInitialState

  internatlState = eventSystem(internatlState) as InternalInitialState

  if (containerId) {
    internatlState = mouseSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    }) as InternalInitialState
    internatlState = keyboardSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    }) as InternalInitialState
  }

  return internatlState
}

export const getState = () => 
   getSystems({
    state: getInitialState(),
    document,
  })

