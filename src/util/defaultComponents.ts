import { vectorZero } from '@arekrado/vector-2d'
import { Camera, GetDefaultComponent, Mouse, MouseInteraction } from '../type'
import {
  Animation,
  Keyboard,
  Transform,
  CollideBox,
  CollideCircle,
} from '../type'

export const defaultAnimation: GetDefaultComponent<
  Animation.AnimationComponent
> = (data = {}) => ({
  isPlaying: false,
  isFinished: false,
  deleteWhenFinished: false,
  currentTime: 0,
  properties: [],
  wrapMode: Animation.WrapMode.once,
  timingMode: Animation.TimingMode.smooth,
  ...data,
})

export const defaultCollideBox: GetDefaultComponent<CollideBox> = (
  data = {},
) => ({
  size: vectorZero(),
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const defaultCollideCircle: GetDefaultComponent<CollideCircle> = (
  data,
) => ({
  radius: 1,
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const defaultMouseInteraction: GetDefaultComponent<MouseInteraction> = (
  data,
) => ({
  clickSpeed: 200,
  doubleClickSpeed: 200,
  isClicked: false,
  isDoubleClicked: false,
  isMouseOver: false,
  isMouseEnter: false,
  isMouseLeave: false,
  ...data,
})

export const defaultCamera: GetDefaultComponent<Camera> = (data = {}) => ({
  position: vectorZero(),
  distance: 1,
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
  ...data,
})

export const defaultTransform: GetDefaultComponent<Transform> = (
  data = {},
) => ({
  rotation: vectorZero(),
  fromParentRotation: vectorZero(),
  scale: [1, 1],
  fromParentScale: [1, 1],
  position: vectorZero(),
  fromParentPosition: vectorZero(),
  ...data,
})

export const defaultMouse: GetDefaultComponent<Mouse> = (data = {}) => ({
  buttons: 0,
  position: [0, 0],
  isButtonUp: false,
  isButtonDown: false,
  isMoving: false,
  lastClick: {
    timestamp: -1,
    buttons: 0,
  },
  wheel: {
    deltaMode: 0,
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
  },
  ...data,
})

export const defaultKeyboard: GetDefaultComponent<Keyboard> = (data = {}) => ({
  keys: {},
  ...data,
})
