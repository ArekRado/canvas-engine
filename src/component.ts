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

export type AnimationProperty = {
  path: string
  component: keyof State['component']
  entity: Entity
  index?: number
}

export type AnimationValueRangeNumber = {
  type: 'Number'
  value: Vector2D
}

export type AnimationValueRangeVector2D = {
  type: 'Vector2D'
  value: [Vector2D, Vector2D]
}

export type AnimationValueRange =
  | AnimationValueRangeNumber
  | AnimationValueRangeVector2D

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
  property: AnimationProperty
  wrapMode: WrapMode
}>

export type SpriteSrc = string

export type Sprite = Component<{ src: SpriteSrc }>

export type AnimatedProperty = {
  path: string
  type: 'number' | 'Vector2D'
}

export type ComponentFactoryOptions<Data> = {
  defaultData: GetDefaultComponent<Component<Data>>
  animatedProperties?: Array<AnimatedProperty>
}

export type ComponentFactory<Data> = {
  defaultData: GetDefaultComponent<Component<Data>>
  animatedProperties: Array<AnimatedProperty>
  set: (params: { state: State; data: Component<Data> }) => State
  get: (params: { entity: Entity; state: State }) => Component<Data> | undefined
  remove: (params: { entity: Entity; state: State }) => State
  removeByEntity: (params: { entity: Entity; state: State }) => State
}

const componentFactory = <Data>(
  componentName: keyof State['component'],
  { defaultData, animatedProperties }: ComponentFactoryOptions<Data>,
): ComponentFactory<Data> => ({
  defaultData,
  animatedProperties: animatedProperties || [],
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
  animatedProperties: [
    { path: 'rotation', type: 'number' },
    { path: 'localRotation', type: 'number' },
    { path: 'scale', type: 'Vector2D' },
    { path: 'localScale', type: 'Vector2D' },
    { path: 'position', type: 'Vector2D' },
    { path: 'localPosition', type: 'Vector2D' },
  ],
})

export const sprite = componentFactory<Sprite['data']>('sprite', {
  defaultData: defaultSprite,
  animatedProperties: [],
})
export const animation = componentFactory<Animation['data']>('animation', {
  defaultData: defaultAnimation,
  animatedProperties: [],
})
export const collideBox = componentFactory<CollideBox['data']>('collideBox', {
  defaultData: defaultCollideBox,
  animatedProperties: [
    { path: 'size', type: 'Vector2D' },
    { path: 'position', type: 'Vector2D' },
  ],
})
export const collideCircle = componentFactory<CollideCircle['data']>(
  'collideCircle',
  {
    defaultData: defaultCollideCircle,
    animatedProperties: [
      { path: 'radius', type: 'number' },
      { path: 'position', type: 'Vector2D' },
    ],
  },
)
export const fieldNumber = componentFactory<Field<number>['data']>(
  'fieldNumber',
  {
    defaultData: defaultFieldNumber,
    animatedProperties: [{ path: '', type: 'number' }],
  },
)
export const fieldVector = componentFactory<Field<Vector2D>['data']>(
  'fieldVector',
  {
    defaultData: defaultFieldVector,
    animatedProperties: [{ path: '', type: 'Vector2D' }],
  },
)
export const fieldString = componentFactory<Field<string>['data']>(
  'fieldString',
  {
    defaultData: defaultFieldString,
    animatedProperties: [],
  },
)
