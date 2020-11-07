import { Vector2D, vectorZero } from '@arekrado/vector-2d'
import {
  Animation,
  CollideBox,
  CollideCircle,
  Field,
  Sprite,
  Transform,
  Component as CESComponent,
} from '../component'
import { Guid } from '../util/uuid'

type GetDefaultComponent<Component extends CESComponent<any>> = (params: {
  entity: Guid
  name: string
  data?: Partial<Component['data']>
}) => Component

export const defaultAnimation: GetDefaultComponent<Animation> = ({
  entity,
  name,
  data = {},
}) => ({
  entity,
  name,
  data: {
    keyframes: [],
    isPlaying: false,
    isFinished: false,
    currentTime: 0,
    property: {
      component: 'transform',
      path: '-',
      entity: '',
      name: '',
    },
    wrapMode: 'Once',
    ...data,
  },
})

export const defaultCollideBox: GetDefaultComponent<CollideBox> = ({
  entity,
  name,
  data = {},
}) => ({
  entity,
  name,
  data: {
    size: vectorZero(),
    position: vectorZero(),
    collisions: [],
    ...data,
  },
})

export const defaultCollideCircle: GetDefaultComponent<CollideCircle> = ({
  entity,
  name,
  data = {},
}) => ({
  entity,
  name,
  data: {
    radius: 1,
    position: vectorZero(),
    collisions: [],
    ...data,
  },
})

export const defaultFieldNumber: GetDefaultComponent<Field<number>> = ({
  entity,
  name,
  data = 0,
}) => ({ entity, name, data })

export const defaultFieldString: GetDefaultComponent<Field<string>> = ({
  entity,
  name,
  data = '',
}) => ({ entity, name, data })

export const defaultFieldVector: GetDefaultComponent<Field<Vector2D>> = ({
  entity,
  name,
  data = (vectorZero() as any)
}) => ({ entity, name, data })

export const defaultSprite: GetDefaultComponent<Sprite> = ({
  entity,
  name,
  data = {},
}) => ({
  entity,
  name,
  data: {
    src: '',
    ...data,
  },
})

export const defaultTransform: GetDefaultComponent<Transform> = ({
  entity,
  name,
  data = {},
}) => ({
  entity,
  name,
  data: {
    rotation: 0,
    localRotation: 0,
    scale: vectorZero(),
    localScale: vectorZero(),
    position: vectorZero(),
    localPosition: vectorZero(),
    parent: '',
    ...data,
  },
})
