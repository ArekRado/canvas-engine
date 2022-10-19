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
import { WebGLRenderer } from 'Three'
// import { rigidBodySystem } from '../system/rigidBody/rigidBody'

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
  animationFrame: -1,
  three: {
    sceneRef: undefined,
    // cameraRef: undefined,
    // StandardMaterial: undefined,
    // MeshBuilder: undefined,
  },
})

export const getSystems = ({
  state,
  document,
  containerId,
  scene,
  renderer,
}: // camera,
// Vector3,
// StandardMaterial,
// MeshBuilder,
// Texture,
// Color3,
// Color4,
{
  state: AnyState
  renderer?: WebGLRenderer
  document?: Document
  containerId?: string
  scene?: AnyState['three']['sceneRef']
  // camera?: AnyState['three']['cameraRef']
  // Vector3?: AnyState['three']['Vector3']
  // StandardMaterial?: AnyState['three']['StandardMaterial']
  // MeshBuilder?: AnyState['three']['MeshBuilder']
  // Texture?: AnyState['three']['Texture']
  // Color3?: AnyState['three']['Color3']
  // Color4?: AnyState['three']['Color4']
}): InternalInitialState => {
  if (process.env.NODE_ENV === 'development') {
    if (
      !scene ||
      !renderer
      // !camera
      // !Vector3 ||
      // !StandardMaterial ||
      // !MeshBuilder ||
      // !Texture ||
      // !Color3
    ) {
      console.warn(
        'Babylonjs camera is not defined. Some features may not work properly.',
        {
          scene: !!scene,
          renderer: !!renderer,
          // camera: !!camera,
          // Vector3: !!Vector3,
          // StandardMaterial: !!StandardMaterial,
          // MeshBuilder: !!MeshBuilder,
          // Texture: !!Texture,
          // Color3: !!Color3,
          // Color4: !!Color4,
        },
      )
    }
  }

  state.three.sceneRef = scene
  state.three.rendererRef = renderer
  // state.three.cameraRef = camera
  // state.three.Vector3 = Vector3
  // state.three.StandardMaterial = StandardMaterial
  // state.three.MeshBuilder = MeshBuilder
  // state.three.Texture = Texture
  // state.three.Color3 = Color3
  // state.three.Color4 = Color4

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
  // internatlState = rigidBodySystem(internatlState) as InternalInitialState

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
  renderer,
}: // camera,
// Vector3,
// StandardMaterial,
// MeshBuilder,
// Texture,
// Color3,
// Color4,
{
  state?: State
  document?: Document
  containerId: string
  scene?: AnyState['three']['sceneRef']
  renderer?: WebGLRenderer
  // camera?: AnyState['three']['cameraRef']
  // Vector3?: AnyState['three']['Vector3']
  // StandardMaterial?: AnyState['three']['StandardMaterial']
  // MeshBuilder?: AnyState['three']['MeshBuilder']
  // Texture?: AnyState['three']['Texture']
  // Color3?: AnyState['three']['Color3']
  // Color4?: AnyState['three']['Color4']
}): InternalInitialState =>
  getSystems({
    state: state || getInitialState(),
    document,
    containerId,
    scene,
    renderer,
    // camera,
    // Vector3,
    // StandardMaterial,
    // MeshBuilder,
    // Texture,
    // Color3,
    // Color4,
  })
