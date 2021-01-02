import { vector, vectorZero } from '@arekrado/vector-2d'
import { componentName } from '../component'
import { Blueprint, GetDefaultComponent, MouseInteraction } from '../type'
import {
  Animation,
  CollideBox,
  CollideCircle,
  Sprite,
} from '../type'
import { generate } from './entity'

export const defaultAnimation: GetDefaultComponent<Animation> = ({
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
    entity: generate('-'),
    index: -1,
  },
  wrapMode: 'Once',
  ...data,
})

export const defaultCollideBox: GetDefaultComponent<CollideBox> = ({
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

export const defaultCollideCircle: GetDefaultComponent<CollideCircle> = ({
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

export const defaultSprite: GetDefaultComponent<Sprite> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.sprite,
  src: '',
  rotation: 0,
  scale: vectorZero(),
  ...data,
})

export const defaultBlueprint: GetDefaultComponent<Blueprint> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.blueprint,
  id: '',
  ...data,
})

export const defaultMouseInteraction: GetDefaultComponent<MouseInteraction> = ({
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
