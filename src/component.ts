import { Entity, State } from './main'
import { Vector2D } from '@arekrado/vector-2d'
import { TimingFunction } from './util/bezierFunction'
import { Dictionary } from './type'
import {
  defaultSprite,
  defaultTransform,
  GetDefaultComponent,
  defaultAnimation,
  defaultCollideBox,
  defaultCollideCircle,
  defaultFieldNumber,
  defaultFieldVector,
  defaultFieldString,
} from './util/defaultComponents'

export type Component<Data> = {
  entity: Entity
  data: Data
}

export type CollideType = {
  type: 'box' | 'circle'
  entity: Entity
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

export type Transform = Component<{
  rotation: number
  localRotation: number
  scale: Vector2D
  localScale: Vector2D
  position: Vector2D
  localPosition: Vector2D
  parent?: Entity
}>

export type Field<Value> = Component<Value>

export type AnimatedProperty = {
  path: string
  component: keyof State['component']
  entity: Entity
  index?: number
}

export type AnimationValueRange = {
  type: 'Number' | 'Vector2D'
  value: Vector2D | [Vector2D, Vector2D]
}

export type WrapMode =
  //When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
  | 'Once'
  // When time reaches the end of the animation clip, time will continue at the beginning.
  | 'Loop'
  // When time reaches the end of the animation clip, time will ping pong back between beginning and end.
  | 'PingPong'
  // Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing.
  | 'ClampForever'

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
  property: AnimatedProperty
  wrapMode: WrapMode
}>

export type SpriteSrc = string

export type Sprite = Component<{ src: SpriteSrc }>

export type ComponentFactory<Data> = {
  defaultData: GetDefaultComponent<Component<Data>>
  set: (params: { state: State; data: Component<Data> }) => State
  get: (params: { entity: Entity; state: State }) => Component<Data> | undefined
  remove: (params: { entity: Entity; state: State }) => State
  removeByEntity: (params: { entity: Entity; state: State }) => State
}

const componentFactory = <Data>(
  componentName: keyof State['component'],
  {
    defaultData,
  }: {
    defaultData: GetDefaultComponent<Component<Data>>
  },
): ComponentFactory<Data> => ({
  defaultData,
  set: ({ state, data }) => ({
    ...state,
    component: {
      ...state.component,
      [componentName]: {
        ...state.component[componentName],
        [data.entity.id]: data,
      },
    },
  }),

  remove: ({ entity, state }) => {
    const { [entity.id]: _, ...dictionaryWithoutComponent } = state.component[
      componentName
    ]

    return {
      ...state,
      component: {
        ...state.component,
        [componentName]: dictionaryWithoutComponent,
      },
    }
  },

  removeByEntity: ({ entity, state }) => {
    const entriesWithoutComponent = Object.entries(
      state.component[componentName],
    ).filter(([_, value]) => value.entity !== entity)

    return {
      ...state,
      component: {
        ...state.component,
        [componentName]: Object.fromEntries(entriesWithoutComponent),
      },
    }
  },

  get: ({ entity, state }) => {
    const c: Dictionary<Component<any>> = state.component[componentName]
    return c[entity.id] as Component<Data> | undefined
  },
})

export const transform = componentFactory<Transform['data']>('transform', {
  defaultData: defaultTransform,
})

export const sprite = componentFactory<Sprite['data']>('sprite', {
  defaultData: defaultSprite,
})
export const animation = componentFactory<Animation['data']>('animation', {
  defaultData: defaultAnimation,
})
export const collideBox = componentFactory<CollideBox['data']>('collideBox', {
  defaultData: defaultCollideBox,
})
export const collideCircle = componentFactory<CollideCircle['data']>(
  'collideCircle',
  {
    defaultData: defaultCollideCircle,
  },
)
export const fieldNumber = componentFactory<Field<number>['data']>(
  'fieldNumber',
  {
    defaultData: defaultFieldNumber,
  },
)
export const fieldVector = componentFactory<Field<Vector2D>['data']>(
  'fieldVector',
  {
    defaultData: defaultFieldVector,
  },
)
export const fieldString = componentFactory<Field<string>['data']>(
  'fieldString',
  {
    defaultData: defaultFieldString,
  },
)
