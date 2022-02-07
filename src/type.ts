import { Vector2D } from '@arekrado/vector-2d'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Scene } from '@babylonjs/core/scene'
import { TimingFunction } from './util/bezierFunction'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core'

////////////////////////////////////
//
//
//
// Util
//
//
//
////////////////////////////////////

export type Dictionary<Value> = { [key: string]: Value }

export type Guid = string

export type Color = [number, number, number, number]

////////////////////////////////////
//
//
//
// Component
//
//
//
////////////////////////////////////

export type Component<Data> = {
  entity: Guid
  name: string
} & Data

export type CollideType = {
  type: 'box' | 'circle'
  entity: Guid
}

export type CollideBox = Component<{
  size: Vector2D
  position: Vector2D
  collisions: CollideType[]
}>

export type CollideCircle = Component<{
  radius: number
  position: Vector2D
  collisions: CollideType[]
}>

export namespace Animation {
  // export type ValueRangeNumber = {
  //   type: 'number'
  //   value: Vector2D
  // }

  // export type ValueRangeVector2D = {
  //   type: 'vector2D'
  //   value: [Vector2D, Vector2D]
  // }

  // export type ValueRangeVector3D = {
  //   type: 'vector3D'
  //   value: [Vector3D, Vector3D]
  // }

  // export type ValueRangeString = {
  //   type: 'string'
  //   value: string
  // }

  export enum TimingMode {
    smooth = 'smooth',
    step = 'step',
  }

  export enum WrapMode {
    /**
     * When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
     */
    once = 'once',
    /**
     * When time reaches the end of the animation clip, time will continue at the beginning.
     */
    loop = 'loop',
    /**
     * When time reaches the end of the animation clip, time will ping pong back between beginning and end.
     */
    pingPong = 'pingPong',
    /**
     * Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing.
     */
    clampForever = 'clampForever',
  }

  export type Keyframe = {
    duration: number
    timingFunction: TimingFunction
    valueRange: Vector2D | [Vector2D, Vector2D] | [Vector3D, Vector3D] | string
    endFrameEvent?: ECSEvent<any, any>
  }

  export type Property = {
    /**
     * entity.component[index].path
     */
    path: string
    component: string // it should be keyof State['component']
    entity: Guid
    index?: number
    keyframes: Keyframe[]
  }

  export type AnimationComponent = Component<{
    currentTime: number
    isPlaying: boolean
    /**
     * is true when wrapMode === 'once' and currentTime exceded
     */
    isFinished: boolean
    wrapMode: WrapMode
    timingMode: TimingMode
    properties: Array<Property>
  }>
}

export type MouseInteraction = Component<{
  // doubleClickSpeed: number

  // When the user clicks on an element
  isClicked: boolean
  // When the user double-clicks on an element
  isDoubleClicked: boolean
  // When the user presses a mouse button over an element
  isMouseOver: boolean
  // When the pointer is moved onto an element
  isMouseEnter: boolean
  // When the pointer is moved out of an element
  isMouseLeave: boolean
}>

export enum MeshType {
  plane = 'plane',
}

export type Mesh = Component<{
  type: MeshType
  uniqueId: number
  width: number
  height: number
  updatable: boolean
  sideOrientation: number

  materialEntity: Entity[]
  // sourcePlane: Plane
  // frontUVs: Vector4
  // backUVs: Vector4
}>

export type Material = Component<{
  uniqueId: number
  diffuseColor?: Color
  specularColor?: Color
  emissiveColor?: Color
  ambientColor?: Color
  alpha?: number
  backFaceCulling?: boolean
  wireframe?: boolean
  useAlphaFromDiffuseTexture?: boolean

  diffuseTexture?: string
  bumpTexture?: string
}>

export type AnimatedProperty = {
  path: string
  type: 'number' | 'vector2D' | 'string'
}

export type Entity = Guid

export type Time = Component<{
  previousTimeNow: number
  timeNow: number
  delta: number
  dataOverwrite:
    | {
        previousTimeNow?: number
        timeNow?: number
        delta?: number
      }
    | undefined
}>

export type Mouse = {
  buttons: number
  position: Vector2D
  isMoving: boolean
  isButtonUp: boolean
  isButtonDown: boolean
  lastClick: {
    timestamp: number
    buttons: number
  }
  wheel: {
    deltaMode: number
    deltaX: number
    deltaY: number
    deltaZ: number
  }
}

export type KeyData = {
  // Key was released.
  isUp: boolean
  // Key was pressed.
  isDown: boolean
  // @TODO Key is held.
  isPressed: boolean
}

export type Keyboard = {
  keys: { [key: string]: KeyData | undefined }
}

export type Camera = Component<{
  position: Vector2D
  distance: number
  // ortho
  bottom: number
  top: number
  left: number
  right: number
}>

export type ECSEvent<Type, Payload> = {
  type: Type
  payload: Payload
}

export type EmitEvent = <AllEvents = ECSEvent<any, any>>(event: AllEvents) => void

// export type Event = Component<{}>

export type EventHandler<Event, State extends AnyState = AnyState> = (params: {
  event: Event
  state: State
}) => State

export type Vector3D = [number, number, number]

export type Transform = Component<{
  rotation: Vector2D | Vector3D
  fromParentRotation: Vector2D | Vector3D
  scale: Vector2D | Vector3D
  fromParentScale: Vector2D | Vector3D
  position: Vector2D | Vector3D
  fromParentPosition: Vector2D | Vector3D
  parentId?: Guid
}>

////////////////////////////////////
//
//
//
// System
//
//
//
////////////////////////////////////

export type AnyStateForSystem = EmptyState<AnyComponent, any>

export type GetDefaultComponent<X> = (
  params: Omit<Partial<Component<X>>, 'name'> & {
    entity: Guid
  },
) => Component<X>

export type SystemMethodParams<
  ComponentData,
  State extends AnyStateForSystem,
> = {
  state: State
  component: Component<ComponentData>
}

export type System<
  Component,
  State extends AnyStateForSystem = AnyStateForSystem,
> = {
  name: string
  componentName: string
  priority: number
  /**
   * Called on each component create if state.component[name] and system name are the same
   */
  create: ((params: SystemMethodParams<Component, State>) => State) | undefined
  /**
   * Called on each runOneFrame
   */
  tick: ((params: { state: State }) => State) | undefined
  remove: ((params: SystemMethodParams<Component, State>) => State) | undefined
  update:
    | ((
        params: SystemMethodParams<Component, State> & {
          previousComponent: Component
        },
      ) => State)
    | undefined
}

export type CreateGlobalSystemParams<State extends AnyStateForSystem> = {
  state: State
  name: string
  create?: (params: { state: State }) => State
  tick?: (params: { state: State }) => State
  priority?: number
}

export type GlobalSystem<State extends AnyStateForSystem> = {
  name: string
  tick?: (params: { state: State }) => State
  create: undefined
  remove: (params: { state: State }) => State
  priority: number
}

////////////////////////////////////
//
//
//
// State
//
//
//
////////////////////////////////////

export type StateDefaultComponents = {
  animation: Dictionary<Animation.AnimationComponent>
  collideBox: Dictionary<CollideBox>
  collideCircle: Dictionary<CollideCircle>
  mouseInteraction: Dictionary<MouseInteraction>
  time: Dictionary<Time>
  camera: Dictionary<Camera>
  transform: Dictionary<Transform>
  mouse: Dictionary<Mouse>
  keyboard: Dictionary<Keyboard>
  material: Dictionary<Material>
  mesh: Dictionary<Mesh>
}

export type StateDefaultSystems =
  | System<Animation.AnimationComponent, AnyStateForSystem>
  | System<CollideBox, AnyStateForSystem>
  | System<CollideCircle, AnyStateForSystem>
  | System<MouseInteraction, AnyStateForSystem>
  | System<Time, AnyStateForSystem>
  | System<Camera, AnyStateForSystem>
  | System<Transform, AnyStateForSystem>
  | System<Event, AnyStateForSystem>
  | System<Mouse, AnyStateForSystem>
  | System<Keyboard, AnyStateForSystem>
  | System<Material, AnyStateForSystem>
  | System<Mesh, AnyStateForSystem>

/**
 * Describes empty state without internal components and systems
 */
export type EmptyState<Component, System> = {
  entity: Dictionary<Entity>
  component: Component
  system: Array<System>
  globalSystem: Array<GlobalSystem<AnyState>>

  // Babylonjs
  babylonjs: {
    sceneRef?: Scene
    cameraRef?: UniversalCamera
    Vector3?: typeof Vector3
    StandardMaterial?: typeof StandardMaterial
    MeshBuilder?: typeof MeshBuilder
    Texture?: typeof Texture
    Color3?: typeof Color3
  }
}

/**
 * Describes extendable state with internal components and systems
 */
export type InitialState<Component, System> = EmptyState<
  StateDefaultComponents & Component,
  StateDefaultSystems & System
>

export type AnyComponent = Dictionary<Dictionary<Component<unknown | any>>>
export type AnySystem = System<Component<any>, AnyStateForSystem>
export type AnyGlobalSystem = GlobalSystem<AnyStateForSystem>
export type AnyState = EmptyState<AnyComponent, AnySystem>

/**
 * Describes state with internal components and systems
 */
export type InternalInitialState = EmptyState<
  StateDefaultComponents,
  StateDefaultSystems
>
