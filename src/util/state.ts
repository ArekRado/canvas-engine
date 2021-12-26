import { State } from '../type'
import { animationSystem } from '../system/animation'
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

export const getInitialState = () => ({
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
  babylonjs: {
    sceneRef: undefined,
    cameraRef: undefined,
  },
})

export const getSystems = ({
  state,
  document,
  containerId,
  isDrawEnabled = false,
  scene,
  camera,
}: {
  state: State
  isDrawEnabled?: boolean
  document?: Document
  containerId?: string
  scene?: Scene
  camera?: UniversalCamera
}): State => {
  state.babylonjs.cameraRef = camera
  state.babylonjs.sceneRef = scene

  state = timeSystem(state)
  state = cameraSystem(state)
  state = transformSystem(state)
  state = collideBoxSystem(state)
  state = animationSystem(state)
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

  return {
    ...(state ?? {}),
    ...state,
    isDrawEnabled,
  }
}

export const getState = ({
  state,
  document,
  containerId,
  isDrawEnabled = false,
  scene,
  camera,
}: {
  state?: State
  isDrawEnabled?: boolean
  document?: Document
  containerId?: string
  scene?: Scene
  camera?: UniversalCamera
}): State =>
  getSystems({
    state: state || getInitialState(),
    document,
    containerId,
    isDrawEnabled,
    scene,
    camera,
  })
