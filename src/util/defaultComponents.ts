import { vector, vectorZero } from '@arekrado/vector-2d'
import { componentName } from '../component'
import {
  Blueprint,
  Camera,
  GetDefaultComponent,
  Mouse,
  MouseInteraction,
} from '../type'
import { Animation, CollideBox, CollideCircle } from '../type'
import { createEntity } from '../entity'
import { Keyboard, Transform } from '..'

export const animation: GetDefaultComponent<Animation> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.animation,
  keyframes: [],
  isPlaying: false,
  isFinished: false,
  currentTime: 0,
  property: {
    component: 'collideBox',
    path: '-',
    entity: createEntity({ name: '-' }),
    index: -1,
  },
  wrapMode: 'once',
  timingMode: 'smooth',
  ...data,
})

export const collideBox: GetDefaultComponent<CollideBox> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.collideBox,
  size: vectorZero(),
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const collideCircle: GetDefaultComponent<CollideCircle> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.collideCircle,
  radius: 1,
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const blueprint: GetDefaultComponent<Blueprint> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.blueprint,
  id: '',
  ...data,
})

export const mouseInteraction: GetDefaultComponent<MouseInteraction> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.mouseInteraction,
  clickSpeed: 200,
  doubleClickSpeed: 200,
  isClicked: false,
  isDoubleClicked: false,
  isMouseOver: false,
  isMouseEnter: false,
  isMouseLeave: false,
  ...data,
})

export const camera: GetDefaultComponent<Camera> = ({ entity, ...data }) => ({
  entity,
  name: componentName.camera,
  position: vectorZero(),
  distance: 1,
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
  ...data,
})

export const transform: GetDefaultComponent<Transform> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.transform,
  rotation: vectorZero(),
  fromParentRotation: vectorZero(),
  scale: vectorZero(),
  fromParentScale: vectorZero(),
  position: vectorZero(),
  fromParentPosition: vectorZero(),
  ...data,
})

export const mouse: GetDefaultComponent<Mouse> = ({ entity, ...data }) => ({
  entity,
  name: componentName.mouse,
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

export const keyboard: GetDefaultComponent<Keyboard> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.keyboard,
  keys: {},
  ...data,
})
