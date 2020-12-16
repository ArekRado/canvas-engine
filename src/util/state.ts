import { State } from '../type'
import { animationSystem } from '../system/animation'
import { collideBoxSystem } from '../system/collideBox'
import { drawSystem } from '../system/draw'
import { transformSystem } from '../system/transform'
import { componentName } from '../component'
import { ioSystem } from '../system/io'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'

const v1: State = {
  entity: [],
  component: {
    [componentName.transform]: {},
    [componentName.sprite]: {},
    [componentName.animation]: {},
    [componentName.collideBox]: {},
    [componentName.collideCircle]: {},
    [componentName.mouseInteraction]: {},
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
  },
  system: {},
  isDebugInitialized: false,
  isDrawEnabled: true,
}

const v2 = timeSystem(v1)
const v3 = ioSystem(v2)
const v4 = transformSystem(v3)
const v5 = drawSystem(v4)
const v6 = collideBoxSystem(v5)
const v7 = animationSystem(v6)
const v8 = mouseInteractionSystem(v7)

export const initialState = v8

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
