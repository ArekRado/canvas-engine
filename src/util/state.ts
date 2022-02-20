import { collideBoxSystem } from '../system/collideBox'
import { transformSystem } from '../system/transform'
import { componentName } from '../component/componentName'
import { timeSystem } from '../system/time'
import { mouseInteractionSystem } from '../system/mouseInteraction'
import { mouseSystem } from '../system/mouse'
import { keyboardSystem } from '../system/keyboard'
import { cameraSystem } from '../system/camera'
import { animationSystem } from '../system/animation'
import { meshSystem } from '../system/mesh'
import { materialSystem } from '../system/material'
import { eventSystem } from '../system/event'
import { AnyState, InternalInitialState } from '../type'

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
    [componentName.mesh]: {},
    [componentName.material]: {},
  },
  globalSystem: [],
  system: [],
  babylonjs: {
    sceneRef: undefined,
    cameraRef: undefined,
    StandardMaterial: undefined,
    MeshBuilder: undefined,
  },
})

export const getSystems = ({
  state,
  document,
  containerId,
  scene,
  camera,
  Vector3,
  StandardMaterial,
  MeshBuilder,
  Texture,
  Color3,
}: {
  state: AnyState
  document?: Document
  containerId?: string
  scene?: AnyState['babylonjs']['sceneRef']
  camera?: AnyState['babylonjs']['cameraRef']
  Vector3?: AnyState['babylonjs']['Vector3']
  StandardMaterial?: AnyState['babylonjs']['StandardMaterial']
  MeshBuilder?: AnyState['babylonjs']['MeshBuilder']
  Texture?: AnyState['babylonjs']['Texture']
  Color3?: AnyState['babylonjs']['Color3']
}): InternalInitialState => {
  if (process.env.NODE_ENV === 'development') {
    if (
      !scene ||
      !camera ||
      !Vector3 ||
      !StandardMaterial ||
      !MeshBuilder ||
      !Texture ||
      !Color3
    ) {
      console.warn(
        'Babylonjs camera is not defined. Some features may not work properly.',
        {
          scene: !!scene,
          camera: !!camera,
          Vector3: !!Vector3,
          StandardMaterial: !!StandardMaterial,
          MeshBuilder: !!MeshBuilder,
          Texture: !!Texture,
          Color3: !!Color3,
        },
      )
    }
  }

  state.babylonjs.cameraRef = camera
  state.babylonjs.sceneRef = scene
  state.babylonjs.Vector3 = Vector3
  state.babylonjs.StandardMaterial = StandardMaterial
  state.babylonjs.MeshBuilder = MeshBuilder
  state.babylonjs.Texture = Texture
  state.babylonjs.Color3 = Color3

  let internatlState = state as InternalInitialState

  internatlState = eventSystem(internatlState)
  internatlState = timeSystem(internatlState)
  internatlState = cameraSystem(internatlState)
  internatlState = transformSystem(internatlState)
  internatlState = collideBoxSystem(internatlState)
  internatlState = animationSystem(internatlState)
  internatlState = mouseInteractionSystem(internatlState)
  internatlState = materialSystem(internatlState)
  internatlState = meshSystem(internatlState)

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
  StandardMaterial,
  MeshBuilder,
  Texture,
  Color3,
}: {
  state?: State
  document?: Document
  containerId?: string
  scene?: AnyState['babylonjs']['sceneRef']
  camera?: AnyState['babylonjs']['cameraRef']
  Vector3?: AnyState['babylonjs']['Vector3']
  StandardMaterial?: AnyState['babylonjs']['StandardMaterial']
  MeshBuilder?: AnyState['babylonjs']['MeshBuilder']
  Texture?: AnyState['babylonjs']['Texture']
  Color3?: AnyState['babylonjs']['Color3']
}): InternalInitialState =>
  getSystems({
    state: state || getInitialState(),
    document,
    containerId,
    scene,
    camera,
    Vector3,
    StandardMaterial,
    MeshBuilder,
    Texture,
    Color3,
  })
