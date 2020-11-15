import { Vector2D, vectorZero } from '@arekrado/vector-2d'
import { Entity } from 'main'
import {
  Animation,
  CollideBox,
  CollideCircle,
  Field,
  Sprite,
  Transform,
  Component as CESComponent,
} from '../component'
import { generate } from './entity'

export type GetDefaultComponent<
  Component extends CESComponent<any>
> = (params: { entity: Entity; data?: Partial<Component['data']> }) => Component

export const defaultAnimation: GetDefaultComponent<Animation> = ({
  entity,
  data = {},
}) => ({
  entity,
  data: {
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
  },
})

export const defaultCollideBox: GetDefaultComponent<CollideBox> = ({
  entity,
  data = {},
}) => ({
  entity,
  data: {
    size: vectorZero(),
    position: vectorZero(),
    collisions: [],
    ...data,
  },
})

export const defaultCollideCircle: GetDefaultComponent<CollideCircle> = ({
  entity,
  data = {},
}) => ({
  entity,
  data: {
    radius: 1,
    position: vectorZero(),
    collisions: [],
    ...data,
  },
})

export const defaultFieldNumber: GetDefaultComponent<Field<number>> = ({
  entity,
  data = 0,
}) => ({ entity, data })

export const defaultFieldString: GetDefaultComponent<Field<string>> = ({
  entity,
  data = '',
}) => ({ entity, data })

export const defaultFieldVector: GetDefaultComponent<Field<Vector2D>> = ({
  entity,
  data = vectorZero() as any,
}) => ({ entity, data })

export const defaultSprite: GetDefaultComponent<Sprite> = ({
  entity,
  data = {},
}) => ({
  entity,
  data: {
    src: '',
    ...data,
  },
})

export const defaultTransform: GetDefaultComponent<Transform> = ({
  entity,
  data = {},
}) => ({
  entity,
  data: {
    rotation: 0,
    localRotation: 0,
    scale: vectorZero(),
    localScale: vectorZero(),
    position: vectorZero(),
    localPosition: vectorZero(),
    parent: data.parent || generate('-'),
    ...data,
  },
})
