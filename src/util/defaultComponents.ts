import { vectorZero } from '@arekrado/vector-2d'
import {
  Camera,
  GetDefaultComponent,
  Mouse,
  RigidBody,
  Material,
} from '../type'
import { Animation, Keyboard, Transform, Collider } from '../type'

export const defaultAnimation: GetDefaultComponent<
  Animation.AnimationComponent
> = (data = {}) => ({
  isPlaying: false,
  isFinished: false,
  deleteWhenFinished: true,
  currentTime: 0,
  properties: [],
  wrapMode: Animation.WrapMode.once,
  timingMode: Animation.TimingMode.smooth,
  ...data,
})

export const defaultCollider: GetDefaultComponent<Collider> = (data = {}) => ({
  // _previousCollision: undefined,
  collision: undefined,
  emitEventCollision: false,
  data: {
    type: 'point',
    position: vectorZero(),
  },
  _rectangleContour: [0, 0, 0, 0],
  layer: {
    belongs: [],
    interacts: [],
  },
  ...data,
})
export const defaultRigidBody: GetDefaultComponent<RigidBody> = (
  data = {},
) => ({
  mass: 1,
  friction: 0,
  force: vectorZero(),
  isStatic: false,
  ...data,
})

export const defaultCamera: GetDefaultComponent<Camera> = (data = {}) => ({
  position: [0, 0, 0],
  lookAt: [1, 1, 1],
  fov: 90,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  ...data,
})

export const defaultTransform: GetDefaultComponent<Transform> = (
  data = {},
) => ({
  rotation: [0, 0, 0],
  fromParentRotation: 0,
  scale: [1, 1],
  fromParentScale: [1, 1],
  position: [0, 0, 0],
  fromParentPosition: [0, 0, 0],
  parentId: undefined,
  _children: [],
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

export const defaultMaterial: GetDefaultComponent<Material> = (data = {}) => ({
  type: 'LineBasicMaterial',
  ...data,
})
