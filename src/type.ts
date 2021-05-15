import { Vector2D } from '@arekrado/vector-2d'
import { GlobalSystem, System } from './system/createSystem'
import { TimingFunction } from './util/bezierFunction'
import REGL from 'regl'

export type Dictionary<Value> = { [key: string]: Value }

export type Guid = string

export type Color = [number, number, number, number]

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

export type Blueprint = Component<{
  id: Guid
}>

export type AnimationProperty = {
  path: string
  component?: keyof State['component']
  entityId: Guid
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

export type AnimationValueRangeString = {
  type: 'string'
  value: string
}

export type TimingMode = 'smooth' | 'step'

export type AnimationValueRange =
  | AnimationValueRangeNumber
  | AnimationValueRangeVector2D
  | AnimationValueRangeString

export type WrapMode =
  //When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
  | 'once'
  // When time reaches the end of the animation clip, time will continue at the beginning.
  | 'loop'
  // When time reaches the end of the animation clip, time will ping pong back between beginning and end.
  | 'pingPong'
  // Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing.
  | 'clampForever'

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
  timingMode: TimingMode
}>

export type SpriteSrc = string

export type Sprite = Component<{
  src: SpriteSrc
  rotation: number
  scale: Vector2D
  anchor: Vector2D
  texture: undefined | REGL.Texture
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
  type: 'number' | 'vector2D' | 'string'
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
  isUp: boolean
  // Key was pressed.
  isDown: boolean
  // @TODO Key is held.
  isPressed: boolean
}

export type Keyboard = {
  [key: string]: KeyData | undefined
}

export type Camera = {
  position: Vector2D
  zoom: number
  pivot: Vector2D

  // todo
  theta?: number
  phi?: number
  distance?: number
  up?: Vector2D
  minDistance?: number
  maxDistance?: number
}

export type Text = Component<{
  value: string
  rotation: number
  skew: Vector2D
  anchor: Vector2D
  // skewText.skew.set(0.65,-0.3);
  // skewText.anchor.set(0.5, 0.5);
  // skewText.x = 300;
  // skewText.y = 480;

  fontFamily: string
  dropShadow: boolean
  dropShadowAlpha: number
  dropShadowAngle: number
  dropShadowBlur: number
  dropShadowColor: Color
  dropShadowDistance: number
  fill: string[]
  stroke: string
  fontSize: number
  fontStyle: 'italic'
  fontWeight: 'lighter' | 'bold'
  lineJoin: 'round'
  wordWrap: boolean
  strokeThickness: number
}>

export type Line = Component<{
  path: Vector2D[]
  borderColor: Color
}>

export type Rectangle = Component<{
  size: Vector2D
  fillColor: Color
}>

export type Ellipse = Component<{
  size: Vector2D
  fillColor: Color
}>

// @TODO
// scene
export type State = {
  entity: Dictionary<Entity>
  component: Dictionary<Dictionary<Component<any>>> & {
    sprite: Dictionary<Sprite>
    animation: Dictionary<Animation>
    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
    mouseInteraction: Dictionary<MouseInteraction>

    text: Dictionary<Text>
    line: Dictionary<Line>
    rectangle: Dictionary<Rectangle>
    ellipse: Dictionary<Ellipse>
  }
  camera: Camera
  system: Array<System<any> | GlobalSystem>
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
