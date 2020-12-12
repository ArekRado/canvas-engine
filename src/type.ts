import { Vector2D } from '@arekrado/vector-2d'
import { GlobalSystem, System } from './system/createSystem'
import { TimingFunction } from './util/bezierFunction'

export type Dictionary<Value> = { [key: string]: Value }

export type Guid = string

export type Component<Data> = {
  entity: Entity
  name: string
} & Data

export type CollideType = {
  type: 'box' | 'circle'
  entity: Entity
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

export type Transform = Component<{
  rotation: number
  fromParentRotation: number
  scale: Vector2D
  fromParentScale: Vector2D
  position: Vector2D
  fromParentPosition: Vector2D
  parent?: Entity
}>

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

export type Sprite = Component<{ src: SpriteSrc }>

export type AnimatedProperty = {
  path: string
  type: 'number' | 'Vector2D'
}

export type Entity = {
  id: Guid
  name: string
  persistOnSceneChange: boolean
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
  entity: Entity
  data: Dictionary<Component<any>>
}

export type Asset = {
  sprite: AssetSprite[]
  blueprint: AssetBlueprint[]
}

export type Mouse = {
  buttons: number
  position: Vector2D
}

/* blueprint: Belt.Map.String.t({
      connectedEntites: []
    }), */
// TODO
// event
// scene
export type State = {
  entity: Entity[]
  component: Dictionary<Dictionary<Component<any>>> & {
    sprite: Dictionary<Sprite>
    transform: Dictionary<Transform>
    animation: Dictionary<Animation>
    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
  }
  system: Dictionary<System<any> | GlobalSystem>
  asset: Asset
  mouse: Mouse
  time: Time
  isDebugInitialized: boolean
  isDrawEnabled: boolean
}
