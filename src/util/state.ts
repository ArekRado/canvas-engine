import { State } from '../type'
import { animationSystem } from '../system/animation'
import { collideBoxSystem } from '../system/collideBox'
import { transformSystem } from '../system/transform'
import { componentName } from '../component'
import { ioSystem } from '../system/io'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'

let state: State = {
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

state = timeSystem(state)
state = ioSystem(state)
state = transformSystem(state)
state = collideBoxSystem(state)
state = animationSystem(state)
state = mouseInteractionSystem(state)

export const initialState = state

export const initialStateWithDisabledDraw: State = {
  ...initialState,
  isDrawEnabled: false,
}

export const getInitialState = (state?: State): State => ({
  ...initialState,
  ...state,
})

export const setScene = (state: State) => ({
  ...state,
})
