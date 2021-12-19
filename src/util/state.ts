import { State } from '../type'
import { animationSystem } from '../system/animation'
import { collideBoxSystem } from '../system/collideBox'
import { transformSystem } from '../system/transform'
import { componentName } from '../component'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'
import { mouseSystem } from '../system/mouse'
import { keyboardSystem } from '../system/keyboard'

export const getInitialState = ({
  state,
  document,
  containerId,
  isDrawEnabled = false,
}: {
  state?: State
  isDrawEnabled?: boolean
  document?: Document
  containerId?: string
}): State => {
  let initialState: State = {
    entity: {},
    component: {
      [componentName.animation]: {},
      [componentName.collideBox]: {},
      [componentName.collideCircle]: {},
      [componentName.mouseInteraction]: {},

      [componentName.time]: {},
      [componentName.camera]: {},
      [componentName.transform]: {},
      [componentName.event]: {},
      [componentName.mouse]: {},
      [componentName.keyboard]: {},
    },
    // asset: {
    //   sprite: [],
    //   blueprint: [],
    // },
    system: [],
    isDebugInitialized: false,
    isDrawEnabled: true,
  }

  initialState = timeSystem(initialState)
  initialState = transformSystem(initialState)
  initialState = collideBoxSystem(initialState)
  initialState = animationSystem(initialState)
  initialState = mouseInteractionSystem(initialState)

  if (containerId) {
    initialState = mouseSystem({
      state: initialState,
      document: document ?? window.document,
      containerId,
    })
    initialState = keyboardSystem({
      state: initialState,
      document: document ?? window.document,
      containerId,
    })
  }

  return {
    ...(initialState ?? {}),
    ...state,
    isDrawEnabled,
  }
}
