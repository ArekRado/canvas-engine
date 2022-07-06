import { colliderSystem } from '../system/collider/collider'
import { transformSystem } from '../system/transform/transform'
import { componentName } from '../component/componentName'
import { timeSystem } from '../system/time/time'
import { mouseInteractionSystem } from '../system/mouseInteraction/mouseInteraction'
import { mouseSystem } from '../system/mouse/mouse'
import { keyboardSystem } from '../system/keyboard/keyboard'
import { cameraSystem } from '../system/camera/camera'
import { animationSystem } from '../system/animation/animation'
import { meshSystem } from '../system/mesh/mesh'
import { materialSystem } from '../system/material/material'
import { eventSystem } from '../event'
import { AnyState, InternalInitialState } from '../type'
import { rigidBodySystem } from '../system/rigidBody/rigidBody'

export const getInitialState = (): InternalInitialState => ({
  entity: {},
  component: {
    [componentName.animation]: {},
    [componentName.collider]: {},
    [componentName.mouseInteraction]: {},
    [componentName.time]: {},
    [componentName.camera]: {},
    [componentName.transform]: {},
    [componentName.mouse]: {},
    [componentName.keyboard]: {},
    [componentName.mesh]: {},
    [componentName.material]: {},
    [componentName.rigidBody]: {},
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
  Color4,
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
  Color4?: AnyState['babylonjs']['Color4']
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
          Color4: !!Color4,
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
  state.babylonjs.Color4 = Color4

  let internatlState = state as InternalInitialState

  internatlState = eventSystem(internatlState) as InternalInitialState
  internatlState = timeSystem(internatlState) as InternalInitialState
  internatlState = cameraSystem(internatlState) as InternalInitialState
  internatlState = transformSystem(internatlState) as InternalInitialState
  internatlState = colliderSystem(internatlState) as InternalInitialState
  internatlState = animationSystem(internatlState) as InternalInitialState
  internatlState = mouseInteractionSystem(
    internatlState,
  ) as InternalInitialState
  internatlState = materialSystem(internatlState) as InternalInitialState
  internatlState = meshSystem(internatlState) as InternalInitialState
  internatlState = rigidBodySystem(internatlState) as InternalInitialState

  if (containerId) {
    internatlState = mouseSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    }) as InternalInitialState
    internatlState = keyboardSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    }) as InternalInitialState
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
  Color4,
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
  Color4?: AnyState['babylonjs']['Color4']
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
    Color4,
  })
