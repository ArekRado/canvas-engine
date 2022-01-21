import {
  AnimationComponent,
  AnimationString,
  AnimationVector2D,
  Component,
  InternalInitialState,
  Vector3D,
} from '../type'
import { TimingFunction, getValue } from '../util/bezierFunction'
import { Keyframe } from '../type'
import { add, magnitude, scale, sub, Vector2D } from '@arekrado/vector-2d'
import set from 'just-safe-set'
import { createSystem } from '../system/createSystem'
import { setComponent } from '../component'
import { componentName } from '../component'
import { getTime } from '../system/time'
import { AnimationNumber, AnimationVector3D } from '..'

type AnyAnimationType = Component<AnimationComponent<any>>

type UpdateAnimation<KeyframeValue, CurrentValue> = (params: {
  keyframe: Keyframe<KeyframeValue>
  timingMode: string
  progress: number
}) => CurrentValue

const vector3d = {
  add: (v1: Vector3D, v2: Vector3D): Vector3D => [
    v1[0] + v2[0],
    v1[1] + v2[1],
    v1[2] + v2[2],
  ],
  sub: (v1: Vector3D, v2: Vector3D): Vector3D => [
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2],
  ],
  scale: (value: number, v1: Vector3D): Vector3D => [
    v1[0] * value,
    v1[1] * value,
    v1[2] * value,
  ],
  isLesser: (v1: Vector3D, v2: Vector3D): boolean =>
    v1[0] + v1[1] + v1[2] < v2[0] + v2[1] + v2[2],
  isGreater: (v1: Vector3D, v2: Vector3D): boolean =>
    v1[0] + v1[1] + v1[2] > v2[0] + v2[1] + v2[2],
}

const getPercentageProgress = (
  currentTime: number,
  duration: number,
  timingFunction: TimingFunction,
): number => {
  const percentageProgress = currentTime === 0 ? 0 : currentTime / duration

  return getValue(timingFunction, percentageProgress)
}

type ActiveKeyframe = {
  keyframeCurrentTime: number
  keyframeIndex: number
  timeExceeded: boolean
}

export const getActiveKeyframe = (
  animation:
    | AnimationNumber
    | AnimationString
    | AnimationVector2D
    | AnimationVector3D,
  secondLoop: boolean,
): ActiveKeyframe => {
  const size = animation.keyframes.length

  const { sum, activeIndex } = animation.keyframes
    .map(({ duration }) => duration)
    .reduce(
      (acc, duration, index) => {
        if (acc.breakLoop === true) {
          return acc
        } else if (animation.currentTime > duration + acc.sum) {
          if (size === index + 1) {
            return {
              // timeExceeded
              sum: duration + acc.sum,
              activeIndex: -1,
              breakLoop: true,
            }
          } else {
            return {
              sum: duration + acc.sum,
              activeIndex: index,
              breakLoop: false,
            }
          }
        } else {
          return {
            sum: acc.sum,
            activeIndex: index,
            breakLoop: true,
          }
        }
      },
      {
        sum: 0,
        activeIndex: 0,
        breakLoop: false,
      },
    )

  if (activeIndex === -1 && animation.wrapMode === 'loop') {
    return getActiveKeyframe(
      {
        ...animation,
        // mod_number prevents from unnecessary loops, instantly moves to last keyframe
        currentTime: animation.currentTime % sum,
      },
      true,
    )
  } else {
    return {
      keyframeCurrentTime: animation.currentTime - sum,
      keyframeIndex: activeIndex,
      timeExceeded: secondLoop || activeIndex === -1,
    }
  }
}

export const updateNumberAnimation: UpdateAnimation<
  [number, number],
  number
> = ({ keyframe, timingMode, progress }) => {
  const v1 = keyframe.valueRange[0] as number
  const v2 = keyframe.valueRange[1] as number

  if (timingMode === 'step') {
    return v1
  }

  const isNegative = v2 > v1
  const normalizedMax = v2 - v1
  const newValue = v1 + progress * normalizedMax

  return isNegative
    ? newValue > v2
      ? v2
      : newValue
    : newValue < v2
    ? v2
    : newValue
}

const isGreater = (v1: Vector2D, v2: Vector2D): boolean =>
  magnitude(v1) > magnitude(v2)

const isLesser = (v1: Vector2D, v2: Vector2D): boolean =>
  magnitude(v1) < magnitude(v2)

export const updateVector2DAnimation: UpdateAnimation<
  [Vector2D, Vector2D],
  Vector2D
> = ({ keyframe, progress, timingMode }) => {
  const v1 = keyframe.valueRange[0] as Vector2D
  const v2 = keyframe.valueRange[1] as Vector2D

  if (timingMode === 'step') {
    return v1
  }

  const isNegative = isLesser(v1, v2)
  const normalizedMax = sub(v2, v1)
  const newValue = add(v1, scale(progress, normalizedMax))

  return isNegative
    ? isGreater(newValue, v2)
      ? v2
      : newValue
    : isLesser(newValue, v2)
    ? v2
    : newValue
}

export const updateVector3DAnimation: UpdateAnimation<
  [Vector3D, Vector3D],
  Vector3D
> = ({ keyframe, progress, timingMode }) => {
  const v1 = keyframe.valueRange[0] as Vector3D
  const v2 = keyframe.valueRange[1] as Vector3D

  if (timingMode === 'step') {
    return v1
  }

  const normalizedMax = vector3d.sub(v2, v1)
  const newValue = vector3d.add(v1, vector3d.scale(progress, normalizedMax))
  const isNegative = vector3d.isLesser(v1, v2)

  return isNegative
    ? vector3d.isGreater(newValue, v2)
      ? v2
      : newValue
    : vector3d.isLesser(newValue, v2)
    ? v2
    : newValue
}

export const updateStringAnimation: UpdateAnimation<string, string> = ({
  keyframe,
}) => {
  return keyframe.valueRange
}

export const createAnimationSystem =
  <AnimationType extends AnyAnimationType>({
    name,
    updateAnimation,
  }: {
    name:
      | componentName.animationNumber
      | componentName.animationString
      | componentName.animationVector2D
      | componentName.animationVector3D
    updateAnimation:
      | UpdateAnimation<[number, number], number>
      | UpdateAnimation<[Vector2D, Vector2D], Vector2D>
      | UpdateAnimation<[Vector3D, Vector3D], Vector3D>
      | UpdateAnimation<string, string>
  }) =>
  (state: InternalInitialState) =>
    createSystem<AnimationType, InternalInitialState>({
      state,
      name,
      componentName: name,
      create: ({ state }) => state,
      remove: ({ state }) => state,
      tick: ({ state, component: animation }) => {
        if (animation.isPlaying === false) {
          return state
        }

        const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
          getActiveKeyframe(animation, false)

        if (timeExceeded === true && animation.wrapMode === 'once') {
          return setComponent({
            state,
            data: {
              ...animation,
              currentTime: 0,
              isPlaying: false,
              isFinished: true,
            },
          })
        } else {
          const time = getTime({ state })
          if (!time) return state

          const keyframe = animation.keyframes[keyframeIndex]

          const progress = getPercentageProgress(
            keyframeCurrentTime,
            keyframe.duration,
            keyframe.timingFunction,
          )

          const currentTime = timeExceeded
            ? keyframeCurrentTime + time.delta
            : animation.currentTime + time.delta

          // todo next value should be taken from next keyframe, not from valueRange
          const value = updateAnimation({
            keyframe,
            timingMode: animation.timingMode,
            progress,
          })

          const { component, entity, path } = animation.property

          component &&
            set(state.component, `${component}.${entity}.${path}`, value)

          return setComponent({
            state,
            data: {
              ...animation,
              currentTime,
              isFinished: timeExceeded,
            },
          })
        }
      },
    })

export const animationNumberSystem = createAnimationSystem<AnimationNumber>({
  name: componentName.animationNumber,
  updateAnimation: updateNumberAnimation,
})

export const animationStringSystem = createAnimationSystem<AnimationString>({
  name: componentName.animationString,
  updateAnimation: updateStringAnimation,
})

export const animationVector2DSystem = createAnimationSystem<AnimationVector2D>(
  {
    name: componentName.animationVector2D,
    updateAnimation: updateVector2DAnimation,
  },
)

export const animationVector3DSystem = createAnimationSystem<AnimationVector3D>(
  {
    name: componentName.animationVector3D,
    updateAnimation: updateVector3DAnimation,
  },
)
