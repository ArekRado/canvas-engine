import { State } from '../type'
import { animationSystem } from '../system/animation'
import { collideBoxSystem } from '../system/collideBox'
import { drawSystem } from '../system/draw'
import { transformSystem } from '../system/transform'
import { componentName } from '..'

const v1: State = {
  entity: [],
  component: {
    [componentName.transform]: {},
    [componentName.sprite]: {},
    [componentName.animation]: {},
    [componentName.collideBox]: {},
    [componentName.collideCircle]: {},
  },
  asset: {
    sprite: [],
  },
  time: {
    timeNow: 0.0,
    delta: 0.0,
  },
  mouse: {
    buttons: 0,
    position: [0, 0],
  },
  system: {},
  isDebugInitialized: false,
  isDrawEnabled: false,
}

const v2 = transformSystem(v1)
const v3 = drawSystem(v2)
const v4 = collideBoxSystem(v3)
const v5 = animationSystem(v4)

export const initialState = v5
