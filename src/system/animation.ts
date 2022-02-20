import { Animation, InternalInitialState, Vector3D } from '../type'
import { TimingFunction, getValue } from '../util/bezierFunction'
import { add, magnitude, scale, sub, Vector2D } from '@arekrado/vector-2d'
import set from 'just-safe-set'
import { createSystem, systemPriority } from '../system/createSystem'
import { setComponent } from '../component/setComponent'
import { updateComponent } from '../component/updateComponent'
import { componentName } from '../component/componentName'

import { getTime } from '../system/time'
import { emitEvent } from './event'

type UpdateAnimationParams = {
  keyframe: Animation.Keyframe
  timingMode: string
  progress: number
}

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

export const getActiveKeyframe = ({
  wrapMode,
  currentTime,
  animationProperty,
  secondLoop,
}: {
  wrapMode: Animation.WrapMode
  currentTime: number
  animationProperty: Animation.Property
  secondLoop: boolean
}): ActiveKeyframe => {
  const size = animationProperty.keyframes.length

  const { sum, activeIndex } = animationProperty.keyframes
    .map(({ duration }) => duration)
    .reduce(
      (acc, duration, index) => {
        if (acc.breakLoop === true) {
          return acc
        } else if (currentTime > duration + acc.sum) {
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

  if (activeIndex === -1 && wrapMode === 'loop') {
    return getActiveKeyframe({
      wrapMode,
      animationProperty,
      secondLoop: true,
      // mod_number prevents from unnecessary loops, instantly moves to last keyframe
      currentTime: currentTime % sum,
    })
  } else {
    return {
      keyframeCurrentTime: currentTime - sum,
      keyframeIndex: activeIndex,
      timeExceeded: secondLoop || activeIndex === -1,
    }
  }
}

export const updateNumberAnimation = ({
  keyframe,
  timingMode,
  progress,
}: UpdateAnimationParams) => {
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

export const updateVector2DAnimation = ({
  keyframe,
  progress,
  timingMode,
}: UpdateAnimationParams) => {
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

export const updateVector3DAnimation = ({
  keyframe,
  progress,
  timingMode,
}: UpdateAnimationParams) => {
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

export const updateStringAnimation = ({ keyframe }: UpdateAnimationParams) => {
  return keyframe.valueRange as string
}

export const updateAnimation = (params: UpdateAnimationParams) => {
  const valueRange = params.keyframe.valueRange

  if (typeof valueRange === 'string') {
    return updateStringAnimation(params)
  }

  if (typeof valueRange[0] === 'number') {
    return updateNumberAnimation(params)
  }

  if (Array.isArray(valueRange)) {
    if (valueRange[0].length === 2) {
      return updateVector2DAnimation(params)
    } else if (valueRange[0].length === 3) {
      return updateVector3DAnimation(params)
    }
  }

  return 0 // :<
}

export const animationSystem = (state: InternalInitialState) =>
  createSystem<Animation.AnimationComponent, InternalInitialState>({
    state,
    name: componentName.animation,
    componentName: componentName.animation,
    priority: systemPriority.animation,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: animation }) => {
      if (animation.isPlaying === false) {
        return state
      }

      let animationTimeExceeded = false

      animation.properties.forEach((property) => {
        const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
          getActiveKeyframe({
            wrapMode: animation.wrapMode,
            currentTime: animation.currentTime,
            animationProperty: property,
            secondLoop: false,
          })

        if (
          timeExceeded === true &&
          animation.wrapMode === Animation.WrapMode.once
        ) {
          const endFrameEvent =
            property.keyframes[property.keyframes.length - 1]?.endFrameEvent

          if (endFrameEvent) {
            emitEvent(endFrameEvent)
          }
          animationTimeExceeded = true
          return
        }

        const keyframe = property.keyframes[keyframeIndex]

        const progress = getPercentageProgress(
          keyframeCurrentTime,
          keyframe.duration,
          keyframe.timingFunction,
        )

        // todo next value should be taken from next keyframe, not from valueRange
        const value = updateAnimation({
          keyframe,
          timingMode: animation.timingMode,
          progress,
        })

        const { component, entity, path } = property

        component &&
          set(state.component, `${component}.${entity}.${path}`, value)

        state = updateComponent({
          state,
          entity,
          name: component,
          update: () => ({}),
        })
      })

      if (animationTimeExceeded) {
        return setComponent({
          state,
          data: {
            ...animation,
            currentTime: 0,
            isPlaying: false,
            isFinished: true,
          },
        })
      }

      const time = getTime({ state })
      if (!time) return state

      const currentTime = animation.currentTime + time.delta

      return setComponent({
        state,
        data: {
          ...animation,
          currentTime,
          isFinished: animationTimeExceeded,
        },
      })
      // }
    },
  })
