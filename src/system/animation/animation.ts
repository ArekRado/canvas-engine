import { Animation, AnyState, Color, Vector3D } from '../../type'
import { TimingFunction, getValue } from '../../util/bezierFunction'
import { add, magnitude, scale, sub, Vector2D } from '@arekrado/vector-2d'
import set from 'just-safe-set'
import { createSystem, systemPriority } from '../createSystem'
import { updateComponent } from '../../component/updateComponent'
import { componentName } from '../../component/componentName'

import { emitEvent } from '../../event'
import { timeEntity } from '../time/time'
import { getTime } from '../time/timeCrud'
import {
  removeAnimation,
  updateAnimation as updateAnimationCrud,
} from '../animation/animationCrud'

type UpdateAnimationParams = {
  keyframe: Animation.Keyframe
  timingMode: string
  progress: number
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

  if (size === 0) {
    return {
      keyframeCurrentTime: -1,
      keyframeIndex: -1,
      timeExceeded: true,
    }
  }

  const { sum, activeIndex } = animationProperty.keyframes
    // .map(({ duration }) => duration)
    .reduce(
      (acc, { duration }, index) => {
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
  const value = keyframe.valueRange[0] as Vector3D

  if (timingMode === 'step') {
    return value
  }

  const newVector: Vector3D = [0, 0, 0]
  for (let i = 0; i < value.length; i++) {
    const v1 = value[i]
    const v2 = (keyframe.valueRange[1] as Vector3D)[i]

    const isNegative = v2 > v1
    const normalizedMax = v2 - v1
    const newValue = v1 + progress * normalizedMax

    newVector[i] = isNegative
      ? newValue > v2
        ? v2
        : newValue
      : newValue < v2
      ? v2
      : newValue
  }

  return newVector
}

export const updateVector4DAnimation = ({
  keyframe,
  progress,
  timingMode,
}: UpdateAnimationParams) => {
  const value = keyframe.valueRange[0] as Color

  if (timingMode === 'step') {
    return value
  }

  const newVector: Color = [0, 0, 0, 0]
  for (let i = 0; i < value.length; i++) {
    const v1 = value[i]
    const v2 = (keyframe.valueRange[1] as Color)[i]

    const isNegative = v2 > v1
    const normalizedMax = v2 - v1
    const newValue = v1 + progress * normalizedMax

    newVector[i] = isNegative
      ? newValue > v2
        ? v2
        : newValue
      : newValue < v2
      ? v2
      : newValue
  }

  return newVector
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
    } else if (valueRange[0].length === 4) {
      return updateVector4DAnimation(params)
    }
  }

  return 0 // :<
}

export const animationSystem = (state: AnyState) =>
  createSystem<Animation.AnimationComponent, AnyState>({
    state,
    name: componentName.animation,
    componentName: componentName.animation,
    priority: systemPriority.animation,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: animation, entity }) => {
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
        if (animation.deleteWhenFinished) {
          return removeAnimation({
            state,
            entity,
          })
        } else {
          return updateAnimationCrud({
            state,
            entity,
            update: () => ({
              // ...animation,
              currentTime: 0,
              isPlaying: false,
              isFinished: true,
            }),
          })
        }
      }

      const time = getTime({
        state,
        entity: timeEntity,
      })
      if (!time) return state

      const currentTime = animation.currentTime + time.delta

      return updateAnimationCrud({
        state,
        entity,
        update: () => ({
          // ...animation,
          currentTime,
          isFinished: animationTimeExceeded,
        }),
      })
    },
  })
