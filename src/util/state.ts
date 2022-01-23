import { collideBoxSystem } from '../system/collideBox'
import { transformSystem } from '../system/transform'
import { componentName } from '../component'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'
import { mouseSystem } from '../system/mouse'
import { keyboardSystem } from '../system/keyboard'
import { Scene } from '@babylonjs/core/scene'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { cameraSystem } from '../system/camera'
import { AnyState, InternalInitialState } from '..'
import { animationSystem } from '../system/animation'

export const getInitialState = (): InternalInitialState => ({
  entity: {},
  component: {
    [componentName.animation]: {},
    [componentName.collideBox]: {},
    [componentName.collideCircle]: {},
    [componentName.mouseInteraction]: {},
    [componentName.time]: {},
    [componentName.camera]: {},
    [componentName.transform]: {},
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
  Vector3,
}: {
  state: AnyState
  document?: Document
  containerId?: string
  scene?: Scene
  camera?: UniversalCamera
  Vector3?: any // babylonjs Vector3
}): InternalInitialState => {
  if (process.env.NODE_ENV !== 'test') {
    if (!camera) {
      console.warn(
        'Babylonjs camera is not defined. Some features may not work properly.',
      )
    }
    if (!scene) {
      console.warn(
        'Babylonjs scene is not defined. Some features may not work properly.',
      )
    }
    if (!Vector3) {
      console.warn(
        'Babylonjs Vector3 is not defined. Some features may not work properly.',
      )
    }
  }

  state.babylonjs.cameraRef = camera
  state.babylonjs.sceneRef = scene
  state.babylonjs.Vector3 = Vector3

  let internatlState = state as InternalInitialState

  internatlState = timeSystem(internatlState)
  internatlState = cameraSystem(internatlState)
  internatlState = transformSystem(internatlState)
  internatlState = collideBoxSystem(internatlState)
  internatlState = animationSystem(internatlState)
  internatlState = mouseInteractionSystem(internatlState)

  if (containerId) {
    internatlState = mouseSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    })
    internatlState = keyboardSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    })
  }

  return internatlState
}

export const getState = <State extends AnyState = AnyState>({
  state,
  document,
  containerId,
  scene,
  camera,
  Vector3,
}: {
  state?: State
  document?: Document
  containerId?: string
  scene?: Scene
  camera?: UniversalCamera
  Vector3?: any
}): InternalInitialState =>
  getSystems({
    state: state || getInitialState(),
    document,
    containerId,
    scene,
    camera,
    Vector3,
  })
