import { State } from '../type'
import { animationSystem } from '../system/animation'
import { collideBoxSystem } from '../system/collideBox'
import { spriteSystem } from '../system/sprite'
import { transformSystem } from '../system/transform'
import { componentName } from '../component'
import { ioSystem } from '../system/io'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'
import { drawSystem } from '../system/draw'
import { vectorZero } from '@arekrado/vector-2d'

let state: State = {
  entity: {},
  component: {
    [componentName.sprite]: {},
    [componentName.animation]: {},
    [componentName.collideBox]: {},
    [componentName.collideCircle]: {},
    [componentName.mouseInteraction]: {},
    [componentName.text]: {},
    [componentName.line]: {},
    [componentName.rectangle]: {},
    [componentName.ellipse]: {},
  },
  regl: undefined,
  camera: {
    position: vectorZero(),
    size: 1,
  },
  asset: {
    sprite: [],
    blueprint: [],
  },
  time: {
    previousTimeNow: 0.0,
    timeNow: 0.0,
    delta: 0.0,
  },
  mouse: {
    buttons: 0,
    position: [0, 0],
    isButtonUp: false,
    isButtonDown: false,
    isMoving: false,
    lastClick: {
      timestamp: -1,
      buttons: 0,
    },
    wheel: {
      deltaMode: 0,
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
    }
  },
  keyboard: {},
  system: [],
  isDebugInitialized: false,
  isDrawEnabled: true,
}

state = timeSystem(state)
state = ioSystem(state)
state = transformSystem(state)
state = drawSystem(state)
state = collideBoxSystem(state)
state = animationSystem(state)
state = mouseInteractionSystem(state)
state = spriteSystem(state)

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
