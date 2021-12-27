import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import {
  transform as defaultTransform,
  animation as defaultAnimation,
} from '../util/defaultComponents'
import { getActiveKeyframe } from '../system/animation'
import { createEntity, setEntity } from '../entity'
import { State, Animation } from '../type'
import { runOneFrame } from '../util/runOneFrame'
import { getComponent, setComponent } from '../component'
import { componentName } from '../component'
import { setTime } from '../system/time'
import { Component, Transform } from '..'
import { getState } from '../util/state'

type NumberComponent = Component<{ value: number }>
const numberComponentName = 'numberComponentName'

describe('animation', () => {
  const entity = createEntity({ name: 'entity' })

  const getTransform = (state: State) =>
    getComponent<Transform>({ name: componentName.transform, state, entity })

  const getNumberComponent = (state: State) =>
    getComponent<NumberComponent>({ name: numberComponentName, state, entity })

  const getAnimation = (state: State) =>
    getComponent<Animation>({ name: componentName.animation, state, entity })

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
      const animation = defaultAnimation({
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
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
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
      const animation = defaultAnimation({
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
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
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
      const animation = defaultAnimation({
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
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
          {
            duration: 1,
            timingFunction: 'Linear',
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
          {
            duration: 2,
            timingFunction: 'Linear',
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
          {
            duration: 100,
            timingFunction: 'Linear',
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      const {
        keyframeCurrentTime,
        keyframeIndex,
        timeExceeded,
      } = getActiveKeyframe(animation, false)

      expect(keyframeCurrentTime).toBe(1887.0)
      expect(timeExceeded).toBe(true)
      expect(keyframeIndex).toBe(-1)
    })

    it('should return proper data when animation has multiple keyframes and is looped', () => {
      const animation = defaultAnimation({
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
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
          {
            duration: 1,
            timingFunction: 'Linear',
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
          {
            duration: 2,
            timingFunction: 'Linear',
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
          {
            duration: 100,
            timingFunction: 'Linear',
            valueRange: {
              type: 'number',
              value: vector(0, 1),
            },
          },
        ],
        isFinished: false,
        wrapMode: 'loop',
      })

      const {
        keyframeCurrentTime,
        keyframeIndex,
        timeExceeded,
      } = getActiveKeyframe(animation, false)

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
      state = setComponent<Animation>({
        state,
        data: defaultAnimation({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'number',
                value: vector(0, 1),
              },
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
      const v3 = setComponent<Animation>({
        state: v2,
        data: defaultAnimation({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'number',
                value: vector(-1, -2),
              },
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
      const v3 = setComponent<Animation>({
        state: v2,
        data: defaultAnimation({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
            },
            {
              duration: 1,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
            },
            {
              duration: 2,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
            },
            {
              duration: 100,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
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
      expect(getAnimation(v10)?.isPlaying).toBe(true)
      expect(getAnimation(v10)?.currentTime).toBe(300)
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
      state = setComponent<Animation>({
        state,
        data: defaultAnimation({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
            },
            {
              duration: 1,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
            },
            {
              duration: 2,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
            },
            {
              duration: 100,
              timingFunction: 'Linear',
              valueRange: { type: 'number', value: vector(0, 1) },
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
      expect(getAnimation(state)?.isFinished).toBe(true)
      expect(getAnimation(state)?.isPlaying).toBe(true)
      expect(getAnimation(state)?.currentTime).toBe(66)

      state = tick(2010, state)
      expect(getAnimation(state)?.isFinished).toBe(false)
      expect(getAnimation(state)?.isPlaying).toBe(true)
      expect(getAnimation(state)?.currentTime).toBe(76)
    })
  })

  it('timingMode step - should change value only once per keyframe', () => {
    const v1 = setEntity({ state: getState({}), entity })
    const v2 = setComponent<Transform>({
      state: v1,
      data: defaultTransform({ entity }),
    })
    const v3 = setComponent<Animation>({
      state: v2,
      data: defaultAnimation({
        entity,
        isPlaying: true,
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: { type: 'number', value: vector(1, 2) },
          },
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: { type: 'number', value: vector(3, 4) },
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

    const v4 = tick(0, v3)
    expect(getNumberComponent(v4)?.value).toBe(1)

    const v5 = tick(5, v4)
    expect(getNumberComponent(v5)?.value).toBe(1)

    const v6 = tick(7, v5)
    expect(getNumberComponent(v6)?.value).toBe(1)

    const v7 = tick(8, v6)
    expect(getNumberComponent(v7)?.value).toBe(1)

    const v8 = tick(10.5, v7)
    expect(getNumberComponent(v8)?.value).toBe(1)

    const v9 = tick(12, v8)
    expect(getNumberComponent(v9)?.value).toBe(3)

    const v10 = tick(100, v9)
    expect(getNumberComponent(v10)?.value).toBe(3)

    const v11 = tick(300, v10)
    expect(getNumberComponent(v11)?.value).toBe(3)
  })

  describe('string', () => {
    it('Linear animation should change value in proper way', () => {
      const parentId1 = 'walk1.png'
      const parentId2 = 'walk2.png'

      const v1 = setEntity({ state: getState({}), entity })
      const v2 = setComponent<Transform>({
        state: v1,
        data: defaultTransform({ entity }),
      })
      const v3 = setComponent<Animation>({
        state: v2,
        data: defaultAnimation({
          entity,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'string',
                value: parentId1,
              },
            },
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'string',
                value: parentId2,
              },
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'parentId',
            component: componentName.transform,
            entity,
          },
          timingMode: 'smooth', // string animation should always works as step
        }),
      })

      const v4 = tick(0, v3)
      expect(getTransform(v4)?.parentId).toBe(parentId1)

      const v5 = tick(5, v4)
      expect(getTransform(v5)?.parentId).toBe(parentId1)

      const v6 = tick(7, v5)
      expect(getTransform(v6)?.parentId).toBe(parentId1)

      const v7 = tick(8, v6)
      expect(getTransform(v7)?.parentId).toBe(parentId1)

      const v8 = tick(10.5, v7)
      expect(getTransform(v8)?.parentId).toBe(parentId1)

      const v9 = tick(12, v8)
      expect(getTransform(v9)?.parentId).toBe(parentId2)

      const v10 = tick(100, v9)
      expect(getTransform(v10)?.parentId).toBe(parentId2)

      const v11 = tick(300, v10)
      expect(getTransform(v11)?.parentId).toBe(parentId2)
    })
  })

  it('should animate entity properties', () => {
    const v1 = setEntity({ state: getState({}), entity })
    const v2 = setComponent<Transform>({
      state: v1,
      data: defaultTransform({ entity }),
    })
    const v3 = setComponent<Animation>({
      state: v2,
      data: defaultAnimation({
        entity,
        isPlaying: true,
        keyframes: [
          {
            duration: 10,
            timingFunction: 'Linear',
            valueRange: {
              type: 'vector2D',
              value: [vector(-2, -2), vector(10, 10)],
            },
          },
        ],
        currentTime: 0,
        wrapMode: 'once',
        isFinished: false,
        property: {
          path: 'position',
          entity,
          component: componentName.transform,
        },
      }),
    })

    const v4 = tick(0, v3)
    expect(
      getComponent<Transform>({
        state: v4,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(0, 0))

    const v5 = tick(1, v4)
    expect(
      getComponent<Transform>({
        state: v5,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(0, 0))

    const v6 = tick(2, v5)
    expect(
      getComponent<Transform>({
        state: v6,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(1.2, 1.2))

    const v7 = tick(2, v6)
    expect(
      getComponent<Transform>({
        state: v7,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(2.4, 2.4))

    const v8 = tick(10, v7)
    expect(
      getComponent<Transform>({
        state: v8,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(2.4, 2.4))

    const v9 = tick(10, v8)
    expect(
      getComponent<Transform>({
        state: v9,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(10, 10))

    const v10 = tick(12, v9)
    expect(
      getComponent<Transform>({
        state: v10,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(10, 10))

    const v11 = tick(120, v10)
    expect(
      getComponent<Transform>({
        state: v11,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(10, 10))

    const v12 = tick(1020, v11)
    expect(
      getComponent<Transform>({
        state: v12,
        entity,
        name: componentName.transform,
      })?.position,
    ).toEqual(vector(10, 10))
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
//       component: componentName.transform,
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
