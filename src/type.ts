import { Vector2D } from '@arekrado/vector-2d'
import { GlobalSystem, System } from './system/createSystem'
import { TimingFunction } from './util/bezierFunction'

export type Dictionary<Value> = { [key: string]: Value }

export type Guid = string

export type Component<Data> = {
  entityId: Guid
  name: string
} & Data

export type CollideType = {
  type: 'box' | 'circle'
  entityId: Guid
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

// export type Transform = Component<{
//   rotation: number
//   fromParentRotation: number
//   scale: Vector2D
//   fromParentScale: Vector2D
//   position: Vector2D
//   fromParentPosition: Vector2D
//   parent?: Entity
// }>

export type Blueprint = Component<{
  id: Guid
}>

export type AnimationProperty = {
  path: string
  component: keyof State['component']
  entity: Entity
  index?: number
}

export type AnimationValueRangeNumber = {
  type: 'Number'
  value: Vector2D
}

export type AnimationValueRangeVector2D = {
  type: 'Vector2D'
  value: [Vector2D, Vector2D]
}

export type AnimationValueRange =
  | AnimationValueRangeNumber
  | AnimationValueRangeVector2D

export type WrapMode =
  //When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
  | 'Once'
  // When time reaches the end of the animation clip, time will continue at the beginning.
  | 'Loop'
  // When time reaches the end of the animation clip, time will ping pong back between beginning and end.
  | 'PingPong'
  // Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing.
  | 'ClampForever'

export type Keyframe = {
  duration: number
  timingFunction: TimingFunction
  valueRange: AnimationValueRange
}

export type Animation = Component<{
  keyframes: Keyframe[]
  isPlaying: boolean
  isFinished: boolean
  currentTime: number
  property: AnimationProperty
  wrapMode: WrapMode
}>

export type SpriteSrc = string

export type Sprite = Component<{
  src: SpriteSrc
  rotation: number
  scale: Vector2D
}>

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
  type: 'number' | 'Vector2D'
}

export type Entity = {
  id: Guid
  name: string
  persistOnSceneChange: boolean

  rotation: number
  fromParentRotation: number
  scale: Vector2D
  fromParentScale: Vector2D
  position: Vector2D
  fromParentPosition: Vector2D
  parentId?: Guid
}

export type Time = {
  previousTimeNow: number
  timeNow: number
  delta: number
}

export type AssetSprite = {
  src: string
  name: string
}

export type AssetBlueprint = {
  name: string
  entityId: Guid
  data: Dictionary<Component<any>>
}

export type Asset = {
  sprite: AssetSprite[]
  blueprint: AssetBlueprint[]
}

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
}

export type KeyData = {
  // Key was released.
  isUp: boolean,
  // Key was pressed.
  isDown: boolean,
  // @TODO Key is held.
  isPressed: boolean,
}

export type Keyboard = {
  [key: string]: KeyData | undefined
}

/* blueprint: Belt.Map.String.t({
      connectedEntites: []
    }), */
// @TODO
// event
// scene
export type State = {
  entity: Entity[]
  component: Dictionary<Dictionary<Component<any>>> & {
    sprite: Dictionary<Sprite>
    animation: Dictionary<Animation>
    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
    mouseInteraction: Dictionary<MouseInteraction>
  }
  system: Dictionary<System<any> | GlobalSystem>
  asset: Asset
  mouse: Mouse
  keyboard: Keyboard
  time: Time
  isDebugInitialized: boolean
  isDrawEnabled: boolean
}

export type GetDefaultComponent<X> = (
  params: Partial<Component<X>> & { entityId: Guid },
) => X
