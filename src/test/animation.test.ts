import 'regenerator-runtime/runtime'
import { vector, Vector2D } from '@arekrado/vector-2d'
import {
  transform as defaultTransform,
  animationNumber,
  animationString,
  animationVector2D,
  animationVector3D,
} from '../util/defaultComponents'
import { getActiveKeyframe } from '../system/animation'
import { createEntity, setEntity } from '../entity'
import { State, Vector3D } from '../type'
import { runOneFrame } from '../util/runOneFrame'
import { getComponent, setComponent } from '../component'
import { componentName } from '../component'
import { setTime } from '../system/time'
import {
  AnimationNumber,
  AnimationString,
  AnimationVector2D,
  AnimationVector3D,
  Component,
  Transform,
} from '..'
import { getState } from '../util/state'

type AnyComponent<Value> = Component<{ value: Value }>

type NumberComponent = AnyComponent<Number>
const numberComponentName = 'NumberComponentName'

type StringComponent = AnyComponent<String>
const stringComponentName = 'stringComponentName'

type Vector2DComponent = AnyComponent<Vector2D>
const vector2DComponentName = 'vector2DComponentName'

type Vector3DComponent = AnyComponent<Vector3D>
const vector3DComponentName = 'vector3DComponentName'

describe('animation', () => {
  const entity = createEntity({ name: 'entity' })

  const getNumberComponent = (state: State) =>
    getComponent<NumberComponent>({ name: numberComponentName, state, entity })

  const getStringComponent = (state: State) =>
    getComponent<StringComponent>({ name: stringComponentName, state, entity })

  const getVector2DComponent = (state: State) =>
    getComponent<Vector2DComponent>({
      name: vector2DComponentName,
      state,
      entity,
    })

  const getVector3DComponent = (state: State) =>
    getComponent<Vector3DComponent>({
      name: vector3DComponentName,
      state,
      entity,
    })

  const getAnimationNumber = (state: State) =>
    getComponent<AnimationNumber>({
      name: componentName.animationNumber,
      state,
      entity,
    })

  const getAnimationString = (state: State) =>
    getComponent<AnimationString>({
      name: componentName.animationString,
      state,
      entity,
    })

  const getAnimationVector2D = (state: State) =>
    getComponent<AnimationVector2D>({
      name: componentName.animationVector2D,
      state,
      entity,
    })

  const getAnimationVector3D = (state: State) =>
    getComponent<AnimationVector3D>({
      name: componentName.animationVector3D,
      state,
      entity,
    })

  const tick = (timeNow: number, state: State) => {
    state = setTime({
      state,
      data: {
        dataOverwrite: {
          previousTimeNow: timeNow === 0 ? 0 : undefined,
          // delta: 0,
          timeNow,
        },
      },
    })

    return runOneFrame({ state })
  }

  describe('getActiveKeyframe', () => {
    it('should return proper time and index when time is zero', () => {
      const animation = animationNumber({
        entity,
        isPlaying: true,
        currentTime: 0,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entity,
        },
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      const { keyframeCurrentTime, keyframeIndex } = getActiveKeyframe(
        animation,
        false,
      )

      expect(keyframeCurrentTime).toBe(0)
      expect(keyframeIndex).toBe(0)
    })

    it('should return proper time and index when time is non zero', () => {
      const animation = animationNumber({
        entity,
        isPlaying: true,
        currentTime: 5,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entity,
        },
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      const { keyframeCurrentTime, keyframeIndex } = getActiveKeyframe(
        animation,
        false,
      )

      expect(keyframeCurrentTime).toBe(5)
      expect(keyframeIndex).toBe(0)
    })

    it('should return proper data when animation has multiple keyframes and currentTime exceeded all keyframes', () => {
      const animation = animationNumber({
        entity,
        isPlaying: true,
        currentTime: 2000,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entity,
        },
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 1,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 2,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 100,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
        getActiveKeyframe(animation, false)

      expect(keyframeCurrentTime).toBe(1887.0)
      expect(timeExceeded).toBe(true)
      expect(keyframeIndex).toBe(-1)
    })

    it('should return proper data when animation has multiple keyframes and is looped', () => {
      const animation = animationNumber({
        entity,
        isPlaying: true,
        currentTime: 2000,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entity,
        },
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 1,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 2,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 100,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
        ],
        isFinished: false,
        wrapMode: 'loop',
      })

      const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
        getActiveKeyframe(animation, false)

      expect(keyframeCurrentTime).toBe(66.0)
      expect(timeExceeded).toBe(true)
      expect(keyframeIndex).toBe(3)
    })
  })

  describe('number', () => {
    it('Linear animation should change value in proper way', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      state = setComponent<AnimationNumber>({
        state,
        data: animationNumber({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'value',
            component: numberComponentName,
            entity,
          },
        }),
      })

      state = tick(0, state)
      expect(getNumberComponent(state)?.value).toBe(0)

      state = tick(1, state)
      expect(getNumberComponent(state)?.value).toBe(0)

      state = tick(2, state)
      expect(getNumberComponent(state)?.value).toBe(0.1)

      state = tick(2, state)
      expect(getNumberComponent(state)?.value).toBe(0.2)

      state = tick(10, state)
      expect(getNumberComponent(state)?.value).toBe(0.2)

      state = tick(10, state)
      expect(getNumberComponent(state)?.value).toBe(1)

      state = tick(12, state)
      expect(getNumberComponent(state)?.value).toBe(1)

      state = tick(120, state)
      expect(getNumberComponent(state)?.value).toBe(1)

      state = tick(1020, state)
      expect(getNumberComponent(state)?.value).toBe(1)
    })

    it('Should works with negative values', () => {
      const v1 = setEntity({ state: getState({}), entity })
      const v2 = setComponent<NumberComponent>({
        state: v1,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      const v3 = setComponent<AnimationNumber>({
        state: v2,
        data: animationNumber({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: vector(-1, -2),
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'value',
            component: numberComponentName,
            entity,
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getNumberComponent(v4)?.value).toBe(-0)

      const v5 = tick(1, v4)
      expect(getNumberComponent(v5)?.value).toBe(-0)

      const v6 = tick(22, v5)
      expect(getNumberComponent(v6)?.value).toBe(-0.1)

      const v7 = tick(22, v6)
      expect(getNumberComponent(v7)?.value).toBe(-2)

      const v8 = tick(2, v7)
      expect(getNumberComponent(v8)?.value).toBe(-2)
    })

    it('Should works with multiple frames', () => {
      const v1 = setEntity({ state: getState({}), entity })
      const v2 = setComponent<NumberComponent>({
        state: v1,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      const v3 = setComponent<AnimationNumber>({
        state: v2,
        data: animationNumber({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
            {
              duration: 1,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
            {
              duration: 2,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
            {
              duration: 100,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'value',
            component: numberComponentName,
            entity,
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getNumberComponent(v4)?.value).toBe(0)

      const v5 = tick(5, v4)
      expect(getNumberComponent(v5)?.value).toBe(0)

      const v6 = tick(10.5, v5)
      expect(getNumberComponent(v6)?.value).toBe(0.5)

      const v7 = tick(12, v6)
      expect(getNumberComponent(v7)?.value).toBe(0.5)

      const v8 = tick(100, v7)
      expect(getNumberComponent(v8)?.value).toBe(0.5)

      const v9 = tick(300, v8)
      expect(getNumberComponent(v9)?.value).toBe(0.87)

      const v10 = tick(100, v9)

      // (getTransform(newState)?.value === 0.0);
      // expect(getAnimation(v10)?.isPlaying).toBe(false)
      // expect(getAnimation(v10)?.currentTime).toBe(0)
      expect(getAnimationNumber(v10)?.isPlaying).toBe(true)
      expect(getAnimationNumber(v10)?.currentTime).toBe(300)
    })

    it('Should works with looped animations', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      state = setComponent<AnimationNumber>({
        state,
        data: animationNumber({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
            {
              duration: 1,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
            {
              duration: 2,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
            {
              duration: 100,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
          ],
          currentTime: 0,
          wrapMode: 'loop',
          isFinished: false,
          property: {
            path: 'value',
            component: numberComponentName,
            entity,
          },
        }),
      })

      state = tick(0, state)
      state = tick(2000, state)

      state = tick(2000, state)
      expect(getNumberComponent(state)?.value).toBe(0.66)
      expect(getAnimationNumber(state)?.isFinished).toBe(true)
      expect(getAnimationNumber(state)?.isPlaying).toBe(true)
      expect(getAnimationNumber(state)?.currentTime).toBe(66)

      state = tick(2010, state)
      expect(getAnimationNumber(state)?.isFinished).toBe(false)
      expect(getAnimationNumber(state)?.isPlaying).toBe(true)
      expect(getAnimationNumber(state)?.currentTime).toBe(76)
    })
  })

  it('timingMode step - should change value only once per keyframe', () => {
    let state = setEntity({ state: getState({}), entity })
    state = setComponent<Transform>({
      state,
      data: defaultTransform({ entity }),
    })
    state = setComponent<AnimationNumber>({
      state,
      data: animationNumber({
        entity,
        isPlaying: true,
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: vector(1, 2),
          },
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: vector(3, 4),
          },
        ],
        currentTime: 0,
        wrapMode: 'once',
        isFinished: false,
        property: {
          path: 'value',
          component: numberComponentName,
          entity,
        },
        timingMode: 'step',
      }),
    })

    state = tick(0, state)
    expect(getNumberComponent(state)?.value).toBe(1)

    state = tick(5, state)
    expect(getNumberComponent(state)?.value).toBe(1)

    state = tick(7, state)
    expect(getNumberComponent(state)?.value).toBe(1)

    state = tick(8, state)
    expect(getNumberComponent(state)?.value).toBe(1)

    state = tick(10.5, state)
    expect(getNumberComponent(state)?.value).toBe(1)

    state = tick(12, state)
    expect(getNumberComponent(state)?.value).toBe(3)

    state = tick(100, state)
    expect(getNumberComponent(state)?.value).toBe(3)

    state = tick(300, state)
    expect(getNumberComponent(state)?.value).toBe(3)
  })

  describe('string', () => {
    it('Linear animation should change value in a proper way', () => {
      const parentId1 = 'walk1.png'
      const parentId2 = 'walk2.png'

      let state = setEntity({ state: getState({}), entity })
      state = setComponent<StringComponent>({
        state,
        data: { name: stringComponentName, entity, value: '' },
      })

      state = setComponent<AnimationString>({
        state,
        data: animationString({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: parentId1,
            },
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: parentId2,
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'value',
            component: stringComponentName,
            entity,
          },
          timingMode: 'smooth', // string animation should always works as step
        }),
      })

      state = tick(0, state)
      expect(getStringComponent(state)?.value).toBe(parentId1)

      state = tick(5, state)
      expect(getStringComponent(state)?.value).toBe(parentId1)

      state = tick(7, state)
      expect(getStringComponent(state)?.value).toBe(parentId1)

      state = tick(8, state)
      expect(getStringComponent(state)?.value).toBe(parentId1)

      state = tick(10.5, state)
      expect(getStringComponent(state)?.value).toBe(parentId1)

      state = tick(12, state)
      expect(getStringComponent(state)?.value).toBe(parentId2)

      state = tick(100, state)
      expect(getStringComponent(state)?.value).toBe(parentId2)

      state = tick(300, state)
      expect(getStringComponent(state)?.value).toBe(parentId2)
    })
  })

  describe('vector2d', () => {
    it('Linear animation should change value in a proper way', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<Vector2DComponent>({
        state,
        data: { name: vector2DComponentName, entity, value: vector(-1, -1) },
      })
      state = setComponent<AnimationVector2D>({
        state,
        data: animationVector2D({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: [vector(0, 10), vector(20, 2)],
            },
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: [vector(11, 70), vector(3, 21)],
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'value',
            component: vector2DComponentName,
            entity,
          },
          timingMode: 'smooth', // string animation should always works as step
        }),
      })

      state = tick(0, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(0, 0).toString(),
      )

      state = tick(5, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(0, 0).toString(),
      )

      state = tick(7, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(10, -4).toString(),
      )

      state = tick(8, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(14, -5.6000000000000005).toString(),
      )

      state = tick(10.5, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(16, -6.4).toString(),
      )

      state = tick(12, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(3, 21).toString(),
      )

      state = tick(100, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(3, 21).toString(),
      )

      state = tick(300, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(3, 21).toString(),
      )
    })
  })

  describe('vector3d', () => {
    it('Linear animation should change value in a proper way', () => {
      let state = setEntity({ state: getState({}), entity })

      state = setComponent<Vector3DComponent>({
        state,
        data: { name: vector3DComponentName, entity, value: [-1, -1, -1] },
      })

      state = setComponent<AnimationVector3D>({
        state,
        data: animationVector3D({
          entity,
          isPlaying: true,
          isFinished: false,
          property: {
            path: 'value',
            component: vector3DComponentName,
            entity,
          },
          keyframes: [
            {
              duration: 300,
              timingFunction: 'Linear',
              valueRange: [
                [0, 0, 0],
                [0, 0, 1],
              ],
            },
            {
              duration: 600,
              timingFunction: 'Linear',
              valueRange: [
                [0, 0, 1],
                [0, 0, -1],
              ],
            },
            {
              duration: 300,
              timingFunction: 'Linear',
              valueRange: [
                [0, 0, -1],
                [0, 0, 0],
              ],
            },
            {
              duration: 0,
              timingFunction: 'Linear',
              valueRange: [
                [0, 0, 0],
                [0, 0, 0],
              ],
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          timingMode: 'smooth', // string animation should always works as step
        }),
      })

      state = tick(0, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(0, 0).toString(),
      )

      state = tick(5, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(0, 0).toString(),
      )

      state = tick(7, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(10, -4).toString(),
      )

      state = tick(8, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(14, -5.6000000000000005).toString(),
      )

      state = tick(10.5, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(16, -6.4).toString(),
      )

      state = tick(12, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(3, 21).toString(),
      )

      state = tick(100, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(3, 21).toString(),
      )

      state = tick(300, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(3, 21).toString(),
      )
    })
  })
})

// 0 0.8333333333333333
// 0 0.8933333333333333
// 0 0.9466666666666668
// 1 -0.003333333333333333
// 1 -0.06
// 1 -0.11333333333333334

// state = setComponent<Animation>({
//   state,
//   data: {
//     name: componentName.animation,
//     entity: boxEntity,

//     isPlaying: true,
//     isFinished: false,
//     property: {
//       path: 'rotation',
//       component: vector2DComponentName,
//       entity: boxEntity,
//     },
//     keyframes: [
//       {
//         duration: 300,
//         timingFunction: 'Linear',
//         value: {
//           type: 'vector3D',
//           value: [0, 0, 0],
//         },
//       },
//       {
//         duration: 600,
//         timingFunction: 'Linear',
//         value: {
//           type: 'vector3D',
//           value: [0, 0, 1],
//         },
//       },
//       {
//         duration: 300,
//         timingFunction: 'Linear',
//         value: {
//           type: 'vector3D',
//           value: [0, 0, -1],
//         },
//       },
//       {
//         duration: 0,
//         timingFunction: 'Linear',
//         value: {
//           type: 'vector3D',
//           value: [0, 0, 0],
//         },
//       },
//     ],
//     currentTime: 0,
//     wrapMode: 'once',
//     timingMode: 'smooth', // string animation should always works as step
//   },
// });
