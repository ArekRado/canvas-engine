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

  let internatlState = state as InternalInitialState

  internatlState = timeSystem(internatlState)
  internatlState = cameraSystem(internatlState)
  internatlState = transformSystem(internatlState)
  internatlState = collideBoxSystem(internatlState)
  internatlState = animationNumberSystem(internatlState)
  internatlState = animationStringSystem(internatlState)
  internatlState = animationVector2DSystem(internatlState)
  internatlState = animationVector3DSystem(internatlState)
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
}: {
  state?: State
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
