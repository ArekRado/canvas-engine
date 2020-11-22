import { vectorZero } from '@arekrado/vector-2d'
import { componentName } from '../component'
import { Entity } from '../type'
import {
  Animation,
  CollideBox,
  CollideCircle,
  Sprite,
  Transform,
  Component as CESComponent,
} from '../type'
import { generate } from './entity'

export type GetDefaultComponent<X> = (
  params: Partial<CESComponent<X>> & { entity: Entity },
) => X

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
    component: 'transform',
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
  ...data,
})

export const defaultTransform: GetDefaultComponent<Transform> = ({
  entity,
  ...data
}) => ({
  entity,
  name: componentName.transform,
  rotation: 0,
  localRotation: 0,
  scale: vectorZero(),
  localScale: vectorZero(),
  position: vectorZero(),
  localPosition: vectorZero(),
  ...data,
})
