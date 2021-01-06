import { vectorZero } from '@arekrado/vector-2d'
import { componentName } from '../component'
import { Blueprint, GetDefaultComponent, MouseInteraction } from '../type'
import {
  Animation,
  CollideBox,
  CollideCircle,
  Sprite,
} from '../type'
import { generateEntity } from './entity'

export const defaultAnimation: GetDefaultComponent<Animation> = ({
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
    entity: generateEntity('-'),
    index: -1,
  },
  wrapMode: 'Once',
  ...data,
})

export const defaultCollideBox: GetDefaultComponent<CollideBox> = ({
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

export const defaultCollideCircle: GetDefaultComponent<CollideCircle> = ({
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

export const defaultSprite: GetDefaultComponent<Sprite> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.sprite,
  src: '',
  rotation: 0,
  scale: vectorZero(),
  ...data,
})

export const defaultBlueprint: GetDefaultComponent<Blueprint> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.blueprint,
  id: '',
  ...data,
})

export const defaultMouseInteraction: GetDefaultComponent<MouseInteraction> = ({
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
