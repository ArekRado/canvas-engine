import {
  animationNumberSystem,
  animationStringSystem,
  animationVector2DSystem,
  animationVector3DSystem,
} from '../system/animation'
import { collideBoxSystem } from '../system/collideBox'
import { transformSystem } from '../system/transform'
import { componentName } from '../component'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'
import { mouseSystem } from '../system/mouse'
import { keyboardSystem } from '../system/keyboard'
import { Scene } from '@babylonjs/core/scene'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { cameraSystem } from '../system/cameraSystem'
import { AnyState, InternalInitialState } from '..'

export const getInitialState = (): InternalInitialState => ({
  entity: {},
  component: {
    [componentName.animationNumber]: {},
    [componentName.animationString]: {},
    [componentName.animationVector2D]: {},
    [componentName.animationVector3D]: {},

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
  globalSystem: [],
  system: [],
  babylonjs: {
    sceneRef: undefined,
    cameraRef: undefined,
  },
})

export const getSystems = ({
  state,
  document,
  containerId,
  scene,
  camera,
}: {
  state: AnyState
  document?: Document
  containerId?: string
  scene?: Scene
  camera?: UniversalCamera
}): InternalInitialState => {
  state.babylonjs.cameraRef = camera
  state.babylonjs.sceneRef = scene

  state = timeSystem(state)
  state = cameraSystem(state)
  state = transformSystem(state)
  state = collideBoxSystem(state)
  state = animationNumberSystem(state)
  state = animationStringSystem(state)
  state = animationVector2DSystem(state)
  state = animationVector3DSystem(state)
  state = mouseInteractionSystem(state)

  if (containerId) {
    state = mouseSystem({
      state: state,
      document: document ?? window.document,
      containerId,
    })
    state = keyboardSystem({
      state: state,
      document: document ?? window.document,
      containerId,
    })
  }

  return state
}

export const getState = ({
  state,
  document,
  containerId,
  scene,
  camera,
}: {
  state?: AnyState
  document?: Document
  containerId?: string
  scene?: Scene
  camera?: UniversalCamera
}): InternalInitialState =>
  getSystems({
    state: state || getInitialState(),
    document,
    containerId,
    scene,
    camera,
  })
