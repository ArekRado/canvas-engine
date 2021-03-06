import { State, Time } from '../type'
import { TimingFunction, getValue } from '../util/bezierFunction'
import { Animation, Keyframe } from '../type'
import { magnitude, scale, sub, Vector2D } from '@arekrado/vector-2d'
import set from 'just-safe-set'
import { createSystem } from './createSystem'
import { setComponent } from '../component'
import { componentName } from '../component'

const getPercentageProgress = (
  currentTime: number,
  duration: number,
  timingFunction: TimingFunction,
): number => {
  const percentageProgress =
    currentTime === 0 ? 0 : (currentTime * 100) / duration

  return getValue(timingFunction, percentageProgress)
}

type ActiveKeyframe = {
  keyframeCurrentTime: number
  keyframeIndex: number
  timeExceeded: boolean
}

export const getActiveKeyframe = (
  animation: Animation,
  secondLoop: boolean,
): ActiveKeyframe => {
  const size = animation.keyframes.length

  if (size === 1 && animation.wrapMode === 'once') {
    return {
      keyframeCurrentTime: animation.currentTime,
      keyframeIndex: 0,
      timeExceeded: false,
    }
  } else {
    const { sum, activeIndex } = animation.keyframes.reduce(
      (acc, keyframe, index) => {
        if (acc.breakLoop === true) {
          return acc
        } else if (keyframe.duration + acc.sum < animation.currentTime) {
          if (size === index + 1) {
            return {
              // timeExceeded
              sum: keyframe.duration + acc.sum,
              activeIndex: -1,
              breakLoop: true,
            }
          } else {
            return {
              sum: keyframe.duration + acc.sum,
              activeIndex: index,
              breakLoop: false,
            }
          }
        } else {
          return { ...acc, activeIndex: index, breakLoop: true }
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
}

type UpdateNumberAnimation = (params: {
  keyframe: Keyframe
  time: Time
  animation: Animation
  progress: number
  keyframeCurrentTime: number
  timeExceeded: boolean
}) => [number, Animation]
const updateNumberAnimation: UpdateNumberAnimation = ({
  keyframe,
  time,
  animation,
  progress,
  keyframeCurrentTime,
  timeExceeded,
}) => {
  const currentTime = timeExceeded
    ? keyframeCurrentTime + time.delta
    : animation.currentTime + time.delta

  const v1 = keyframe.valueRange.value[0] as number
  const v2 = keyframe.valueRange.value[1] as number

  if (animation.timingMode === 'step') {
    return [
      v1,
      {
        ...animation,
        currentTime,
        isFinished: timeExceeded,
      },
    ]
  }

  const normalizedMax = v2 - v1
  const newValue = (progress * normalizedMax) / 100

  const isNegative = v2 > v1

  return [
    isNegative
      ? newValue > v2
        ? v2
        : newValue
      : newValue < v2
      ? v2
      : newValue,
    {
      ...animation,
      currentTime,
      isFinished: timeExceeded,
    },
  ]
}

const isGreater = (v1: Vector2D, v2: Vector2D): boolean =>
  magnitude(v1) > magnitude(v2)

const isLesser = (v1: Vector2D, v2: Vector2D): boolean =>
  magnitude(v1) < magnitude(v2)

type UpdateVectorAnimation = (params: {
  keyframe: Keyframe
  time: Time
  animation: Animation
  progress: number
  keyframeCurrentTime: number
  timeExceeded: boolean
}) => [Vector2D, Animation]
const updateVectorAnimation: UpdateVectorAnimation = ({
  keyframe,
  time,
  animation,
  progress,
  keyframeCurrentTime,
  timeExceeded,
}) => {
  const currentTime = timeExceeded
    ? keyframeCurrentTime + time.delta
    : animation.currentTime + time.delta

  const v1 = keyframe.valueRange.value[0] as Vector2D
  const v2 = keyframe.valueRange.value[1] as Vector2D

  if (animation.timingMode === 'step') {
    return [
      v1,
      {
        ...animation,
        currentTime,
        isFinished: timeExceeded,
      },
    ]
  }

  const normalizedMax = sub(v2, v1)
  const newValue = scale(1.0 / 100, scale(progress, normalizedMax))
  const isNegative = isLesser(v1, v2)

  return [
    isNegative
      ? isGreater(newValue, v2)
        ? v2
        : newValue
      : isLesser(newValue, v2)
      ? v2
      : newValue,
    {
      ...animation,
      currentTime,
      isFinished: timeExceeded,
    },
  ]
}

type UpdateStringAnimation = (params: {
  keyframe: Keyframe
  time: Time
  animation: Animation
  keyframeCurrentTime: number
  timeExceeded: boolean
}) => [string, Animation]
const updateStringAnimation: UpdateStringAnimation = ({
  keyframe,
  time,
  animation,
  keyframeCurrentTime,
  timeExceeded,
}) => {
  const currentTime = timeExceeded
    ? keyframeCurrentTime + time.delta
    : animation.currentTime + time.delta

  return [
    keyframe.valueRange.value as string,
    {
      ...animation,
      currentTime,
      isFinished: timeExceeded,
    },
  ]
}

export const animationSystem = (state: State) =>
  createSystem<Animation>({
    state,
    name: componentName.animation,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: animation }) => {
      if (animation.isPlaying === false) {
        return state
      }

      const {
        keyframeCurrentTime,
        keyframeIndex,
        timeExceeded,
      } = getActiveKeyframe(animation, false)

      if (timeExceeded === true && animation.wrapMode === 'once') {
        animation = {
          ...animation,
          currentTime: 0,
          isPlaying: false,
          isFinished: true,
        }
        return state
      } else {
        const keyframe = animation.keyframes[keyframeIndex]

        const progress = getPercentageProgress(
          keyframeCurrentTime,
          keyframe.duration,
          keyframe.timingFunction,
        )

        let updateFunction

        switch (keyframe.valueRange.type) {
          case 'number':
            updateFunction = updateNumberAnimation
            break
          case 'vector2D':
            updateFunction = updateVectorAnimation
            break
          case 'string':
            updateFunction = updateStringAnimation
            break
        }

        const [value, newAnimation] = updateFunction({
          keyframe,
          time: state.time,
          animation,
          progress,
          keyframeCurrentTime,
          timeExceeded,
        })

        const { component, entityId, path } = animation.property

        component
          ? set(state.component, `${component}.${entityId}.${path}`, value)
          : set(state.entity, `${entityId}.${path}`, value)

        return setComponent<Animation>(componentName.animation, {
          state,
          data: newAnimation,
        })
      }
    },
  })
