import { State, Time } from 'main'
import { TimingFunction, getValue } from 'util/bezierFunction'
import { Animation, Keyframe } from 'component'
import { magnitude, scale, sub, Vector2D } from '@arekrado/vector-2d'
import set from 'just-safe-set'

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
  const size = animation.data.keyframes.length

  if (size === 1 && animation.data.wrapMode === 'Once') {
    return {
      keyframeCurrentTime: animation.data.currentTime,
      keyframeIndex: 0,
      timeExceeded: false,
    }
  } else {
    const { sum, activeIndex } = animation.data.keyframes.reduce(
      (acc, keyframe, index) => {
        if (acc.breakLoop === true) {
          return acc
        } else if (keyframe.duration + acc.sum < animation.data.currentTime) {
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

    if (activeIndex === -1 && animation.data.wrapMode === 'Loop') {
      return getActiveKeyframe(
        {
          ...animation,
          data: {
            ...animation.data,
            // mod_number prevents from unnecessary loops, instantly moves to last keyframe
            currentTime: animation.data.currentTime % sum,
          },
        },
        true,
      )
    } else {
      return {
        keyframeCurrentTime: animation.data.currentTime - sum,
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
  const v1 = keyframe.valueRange.value[0] as number
  const v2 = keyframe.valueRange.value[1] as number

  const normalizedMax = v2 - v1
  const newValue = (progress * normalizedMax) / 100

  const isNegative = v2 > v1

  // console.log({
  //   v1,
  //   v2,
  //   normalizedMax,
  //   newValue,
  //   isNegative,
  // })

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
      data: {
        ...animation.data,
        currentTime: timeExceeded
          ? keyframeCurrentTime + time.delta
          : animation.data.currentTime + time.delta,
        isFinished: timeExceeded,
      },
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
  const v1 = keyframe.valueRange.value[0] as Vector2D
  const v2 = keyframe.valueRange.value[1] as Vector2D

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
      currentTime: timeExceeded
        ? keyframeCurrentTime + time.delta
        : animation.data.currentTime + time.delta,
      isFinished: timeExceeded,
    },
  ]
}

type Update = (params: { state: State }) => State
export const update: Update = ({ state }) => {
  Object.values(state.component.animation).forEach((animation) => {
    if (animation.data.isPlaying === false) {
      return
    }

    const {
      keyframeCurrentTime,
      keyframeIndex,
      timeExceeded,
    } = getActiveKeyframe(animation, false)

    if (timeExceeded === true && animation.data.wrapMode === 'Once') {
      animation.data = {
        ...animation.data,
        currentTime: 0,
        isPlaying: false,
        isFinished: true,
      }
      return
    } else {
      const keyframe = animation.data.keyframes[keyframeIndex]

      const progress = getPercentageProgress(
        keyframeCurrentTime,
        keyframe.duration,
        keyframe.timingFunction,
      )

      const updateFunction =
        keyframe.valueRange.type === 'Number'
          ? updateNumberAnimation
          : updateVectorAnimation

      const [value, newAnimation] = updateFunction({
        keyframe,
        time: state.time,
        animation,
        progress,
        keyframeCurrentTime,
        timeExceeded,
      })

      const { component, entity, name, path } = animation.data.property
      set(state.component, `${component}.${entity + name}.${path}`, value)

      animation.data = newAnimation.data
    }
  })

  return state
}
