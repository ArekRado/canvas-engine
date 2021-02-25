import { vector, vectorZero } from '@arekrado/vector-2d'
import { componentName } from '../component'
import {
  Blueprint,
  Camera,
  GetDefaultComponent,
  MouseInteraction,
} from '../type'
import { Animation, CollideBox, CollideCircle, Sprite } from '../type'
import { generateEntity } from './entity'

export const animation: GetDefaultComponent<Animation> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.animation,
  keyframes: [],
  isPlaying: false,
  isFinished: false,
  currentTime: 0,
  property: {
    component: 'collideBox',
    path: '-',
    entityId: generateEntity('-').id,
    index: -1,
  },
  wrapMode: 'once',
  timingMode: 'smooth',
  ...data,
})

export const collideBox: GetDefaultComponent<CollideBox> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.collideBox,
  size: vectorZero(),
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const collideCircle: GetDefaultComponent<CollideCircle> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.collideCircle,
  radius: 1,
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const sprite: GetDefaultComponent<Sprite> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.sprite,
  src: '',
  rotation: 0,
  scale: vector(1, 1),
  anchor: vector(0, 1),
  ...data,
})

export const blueprint: GetDefaultComponent<Blueprint> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.blueprint,
  id: '',
  ...data,
})

export const mouseInteraction: GetDefaultComponent<MouseInteraction> = ({
  entityId,
  ...data
}) => ({
  entityId,
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

export const camera: GetDefaultComponent<Camera> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.camera,
  position: vectorZero(),
  zoom: 1,
  pivot: vectorZero(),
  ...data,
})
