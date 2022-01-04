import { Vector2D } from '@arekrado/vector-2d'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { Scene } from '@babylonjs/core/scene'
import { GlobalSystem, System } from './system/createSystem'
import { TimingFunction } from './util/bezierFunction'

export type Component<Data> = {
  entity: Guid
  name: string
} & Data

export type Dictionary<Value> = { [key: string]: Value }

export type Guid = string

export type Color = [number, number, number, number]

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

export type AnimationProperty = {
  path: string
  component: keyof State['component']
  entity: Guid
  index?: number
}

export type AnimationValueRangeNumber = {
  type: 'number'
  value: Vector2D
}

export type AnimationValueRangeVector2D = {
  type: 'vector2D'
  value: [Vector2D, Vector2D]
}

export type AnimationValueRangeVector3D = {
  type: 'vector3D'
  value: [Vector3D, Vector3D]
}

export type AnimationValueRangeString = {
  type: 'string'
  value: string
}

export type TimingMode = 'smooth' | 'step'

// export type AnimationValueRange =
//   | AnimationValueRangeNumber
//   | AnimationValueRangeVector2D
//   | AnimationValueRangeVector3D
//   | AnimationValueRangeString

export type WrapMode =
  //When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
  | 'once'
  // When time reaches the end of the animation clip, time will continue at the beginning.
  | 'loop'
  // When time reaches the end of the animation clip, time will ping pong back between beginning and end.
  | 'pingPong'
  // Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing.
  | 'clampForever'

export type Keyframe<AnimationValueRange> = {
  duration: number
  timingFunction: TimingFunction
  valueRange: AnimationValueRange
}

export type AnimationComponent<AnimationValueRange> = Component<{
  keyframes: Keyframe<AnimationValueRange>[]
  isPlaying: boolean
  isFinished: boolean
  currentTime: number
  property: AnimationProperty
  wrapMode: WrapMode
  timingMode: TimingMode
}>

export type AnimationNumber = AnimationComponent<[number, number]>
export type AnimationString = AnimationComponent<string>
export type AnimationVector2D = AnimationComponent<[Vector2D, Vector2D]>
export type AnimationVector3D = AnimationComponent<[Vector3D, Vector3D]>

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

export type Event = Component<{}>

export type EventHandler<Event> = (params: {
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

// @TODO
// scene
export type State = {
  entity: Dictionary<Entity>
  component: Dictionary<Dictionary<Component<any>>> & {
    // animation: Dictionary<Animation>

    animationNumber: Dictionary<AnimationNumber>
    animationString: Dictionary<AnimationString>
    animationVector2D: Dictionary<AnimationVector2D>
    animationVector3D: Dictionary<AnimationVector3D>

    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
    mouseInteraction: Dictionary<MouseInteraction>
    time: Dictionary<Time>
    camera: Dictionary<Camera>
    transform: Dictionary<Transform>
    event: Dictionary<Event>
    mouse: Dictionary<Mouse>
    keyboard: Dictionary<Keyboard>

    // text: Dictionary<Text>
    // line: Dictionary<Line>
    // rectangle: Dictionary<Rectangle>
    // ellipse: Dictionary<Ellipse>
  }
  // camera: Camera
  system: Array<System<any> | GlobalSystem>
  // asset: Asset
  // mouse: Mouse
  // keyboard: Keyboard
  isDebugInitialized: boolean
  isDrawEnabled: boolean

  // Babylonjs
  babylonjs: {
    sceneRef?: Scene
    cameraRef?: UniversalCamera
  }
}

export type GetDefaultComponent<X> = (
  params: Omit<Partial<Component<X>>, 'name'> & {
    entity: Guid
  },
) => Component<X>
