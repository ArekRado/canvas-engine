import { State, Time, Keyframe } from 'main'
import { TimingFunction, getValue } from 'util/bezierFunction'
import { Animation } from 'component'
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
  const [v1, v2] = keyframe.value

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
  const [v1, v2] = keyframe.value

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

// const updateVectorAnimation =
//     (
//       ~keyframe: Type.keyframe,
//       ~time: Type.time,
//       ~animation: Type.animation,
//       ~progress: number,
//       ~keyframeCurrentTime: number,
//       ~timeExceeded: boolean,
//     )
//     : updateVectorAnimationType => {
//   const (v1, v2) =
//     switch (keyframe.valueRange) {
//     | Float(_) => (Vector_Util.zero, Vector_Util.zero)
//     | Vector(v) => v
//     };

//   const normalizedMax = Vector_Util.sub(v2, v1);
//   const newValue =
//     Vector_Util.scale(
//       1.0 /. 100,
//       Vector_Util.scale(progress, normalizedMax),
//     );

//   const isNegative = Vector_Util.isLesser(v1, v2);

//   (
//     isNegative
//       ? Vector_Util.isGreater(newValue, v2) ? v2 : newValue
//       : Vector_Util.isLesser(newValue, v2) ? v2 : newValue,
//     {
//       ...animation,
//       currentTime:
//         timeExceeded
//           ? keyframeCurrentTime +. time.delta
//           : animation.currentTime +. time.delta,
//       isFinished: timeExceeded,
//     },
//   );
// };

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
      animation = {
        ...animation,
        data: {
          ...animation.data,
          currentTime: 0,
          isPlaying: false,
          isFinished: true,
        },
      }
      return
    } else {
      const keyframe = animation.data.keyframes[keyframeIndex]

      const progress = getPercentageProgress(
        keyframeCurrentTime,
        keyframe.duration,
        keyframe.timingFunction,
      )

      switch (keyframe.valueRange.type) {
        case 'Number':
          const [value, newAnimation] = updateNumberAnimation({
            keyframe,
            time: state.time,
            animation,
            progress,
            keyframeCurrentTime,
            timeExceeded,
          })

          set(
            state.component,
            `${animation.data.property.component}.${animation.data.property.path}`,
            value,
          )

          break
        case 'Vector2D':
          const [value, newAnimation] = updateVectorAnimation({
            keyframe,
            time: state.time,
            animation,
            progress,
            keyframeCurrentTime,
            timeExceeded,
          })

          set(
            state.component,
            `${animation.data.property.component}.${animation.data.property.path}`,
            value,
          )
          break
      }
    }
  })

  return state
}

// const updateAnimation =
//     (acc: Type.state, _: string, animation: Type.animation) =>
//   if (animation.isPlaying) {
//     const {keyframeCurrentTime, keyframeIndex, timeExceeded} =
//       getActiveKeyframe(animation, false);

//     if (timeExceeded === true && animation.wrapMode === Once) {
//       Animation_Component.set(
//         ~state=acc,
//         ~name=animation.name,
//         ~entity=animation.entity,
//         ~animation={
//           ...animation,
//           currentTime: 0,
//           isPlaying: false,
//           isFinished: true,
//         },
//       );
//     } else {
//       switch (Belt.List.get(animation.keyframes, keyframeIndex)) {
//       | None => acc
//       | Some(keyframe) =>
//         const progress =
//           getPercentageProgress(
//             keyframeCurrentTime,
//             keyframe.duration,
//             keyframe.timingFunction,
//           );

//         switch (keyframe.valueRange) {
//         | Type.Float(_) =>
//           const (value, updatedAnimation) =
//             updateFloatAnimation(
//               ~keyframe,
//               ~time=acc.time,
//               ~animation,
//               ~progress,
//               ~keyframeCurrentTime,
//               ~timeExceeded,
//             );

//           const stateWithNewAnimation =
//             Animation_Component.set(
//               ~state=acc,
//               ~name=animation.name,
//               ~animation=updatedAnimation,
//               ~entity=animation.entity,
//             );

//           switch (animation.component) {
//           | FieldFloat(entity, fieldFloatName) =>
//             FieldFloat_Component.setValue(
//               ~state=stateWithNewAnimation,
//               ~name=fieldFloatName,
//               ~value,
//               ~entity,
//             )
//           | FieldVector(_) => acc
//           | TransformLocalPosition(_) => acc
//           };
//         | Type.Vector(_) =>
//           const (value, updatedAnimation) =
//             updateVectorAnimation(
//               ~keyframe,
//               ~time=acc.time,
//               ~animation,
//               ~progress,
//               ~keyframeCurrentTime,
//               ~timeExceeded,
//             );

//           const stateWithNewAnimation =
//             Animation_Component.set(
//               ~state=acc,
//               ~name=animation.name,
//               ~animation=updatedAnimation,
//               ~entity=animation.entity,
//             );

//           switch (animation.component) {
//           | FieldFloat(_) => acc
//           | FieldVector(entity, fieldVectorName) =>
//             FieldVector_Component.setValue(
//               ~state=stateWithNewAnimation,
//               ~name=fieldVectorName,
//               ~value,
//               ~entity,
//             )
//           | TransformLocalPosition(entity) =>
//             Transform_Component.setLocalPosition(
//               ~state=stateWithNewAnimation,
//               ~entity,
//               ~localPosition=value,
//             )
//           };
//         };
//       };
//     };
//   } else {
//     acc;
//   };

// const update = (~state: Type.state): Type.state =>
//   Belt.Map.String.reduce(state.animation, state, updateAnimation);
