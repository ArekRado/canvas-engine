import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { defaultAnimation, defaultFieldNumber } from '../util/defaultComponents'
import { getActiveKeyframe } from 'system/animation'
import { set as setEntity } from '../util/entity'
import { initialState, State } from 'main'
import { animation, fieldNumber } from 'component'
import { runOneFrame } from 'util/runOneFrame'

describe('animation', () => {
  const entity = 'entity'
  const animationName = 'animationName'
  const fieldNumberName = 'testFieldNumber'
  // const fieldVectorName = 'testFieldVector'

  const getFieldFloat = (state: State) =>
    fieldNumber.get({ state, entity, name: fieldNumberName })?.data

  const getAnimation = (state: State) =>
    animation.get({ state, entity, name: animationName })?.data

  const tick = (timeNow: number, state: State) =>
    runOneFrame({ state, timeNow, enableDraw: false })

  describe('getActiveKeyframe', () => {
    it('should return proper time and index when time is zero', () => {
      const animation = defaultAnimation({
        entity,
        name: animationName,
        data: {
          isPlaying: true,
          currentTime: 0,
          property: {
            component: 'animation',
            path: 'FieldNumber',
            entity: entity,
            name: fieldNumberName,
          },
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
          ],
          isFinished: false,
          wrapMode: 'Once',
        },
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
        name: animationName,
        data: {
          isPlaying: true,
          currentTime: 5,
          property: {
            component: 'animation',
            path: 'FieldNumber',
            entity: entity,
            name: fieldNumberName,
          },
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
          ],
          isFinished: false,
          wrapMode: 'Once',
        },
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
        name: animationName,
        data: {
          isPlaying: true,
          currentTime: 2000,
          property: {
            component: 'animation',
            path: 'FieldNumber',
            entity: entity,
            name: fieldNumberName,
          },
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
            {
              duration: 1,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
            {
              duration: 2,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
            {
              duration: 100,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
          ],
          isFinished: false,
          wrapMode: 'Once',
        },
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
        name: animationName,
        data: {
          isPlaying: true,
          currentTime: 2000,
          property: {
            component: 'animation',
            path: 'FieldNumber',
            entity: entity,
            name: fieldNumberName,
          },
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
            {
              duration: 1,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
            {
              duration: 2,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
            {
              duration: 100,
              timingFunction: 'Linear',
              valueRange: {
                type: 'Number',
                value: vector(0, 1),
              },
            },
          ],
          isFinished: false,
          wrapMode: 'Loop',
        },
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
      const v1 = setEntity({ state: initialState, entity })
      const v2 = fieldNumber.set({
        state: v1,
        data: defaultFieldNumber({ entity, name: fieldNumberName, data: 0 }),
      })
      const v3 = animation.set({
        state: v2,
        data: defaultAnimation({
          entity,
          name: animationName,
          data: {
            isPlaying: true,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: {
                  type: 'Number',
                  value: vector(0, 1),
                },
              },
            ],
            currentTime: 0,
            wrapMode: 'Once',
            isFinished: false,
            property: {
              path: 'data',
              component: 'fieldNumber',
              entity: entity,
              name: fieldNumberName,
            },
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getFieldFloat(v4)).toBe(0)

      const v5 = tick(1, v4)
      expect(getFieldFloat(v5)).toBe(0)

      const v6 = tick(2, v5)
      expect(getFieldFloat(v6)).toBe(0.1)

      const v7 = tick(2, v6)
      expect(getFieldFloat(v7)).toBe(0.2)

      const v8 = tick(10, v7)
      expect(getFieldFloat(v8)).toBe(0.2)

      const v9 = tick(10, v8)
      expect(getFieldFloat(v9)).toBe(1)

      const v10 = tick(12, v9)
      expect(getFieldFloat(v10)).toBe(1)

      const v11 = tick(120, v10)
      expect(getFieldFloat(v11)).toBe(1)

      const v12 = tick(1020, v11)
      expect(getFieldFloat(v12)).toBe(1)
    })

    it('Should works with negative values', () => {
      const v1 = setEntity({ state: initialState, entity })
      const v2 = fieldNumber.set({
        state: v1,
        data: defaultFieldNumber({ entity, name: fieldNumberName, data: 0 }),
      })
      const v3 = animation.set({
        state: v2,
        data: defaultAnimation({
          entity,
          name: animationName,
          data: {
            isPlaying: true,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: {
                  type: 'Number',
                  value: vector(-1, -2),
                },
              },
            ],
            currentTime: 0,
            wrapMode: 'Once',
            isFinished: false,
            property: {
              path: 'data',
              component: 'fieldNumber',
              entity: entity,
              name: fieldNumberName,
            },
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getFieldFloat(v4)).toBe(-0)

      const v5 = tick(1, v4)
      expect(getFieldFloat(v5)).toBe(-0)

      const v6 = tick(22, v5)
      expect(getFieldFloat(v6)).toBe(-0.1)

      const v7 = tick(22, v6)
      expect(getFieldFloat(v7)).toBe(-2)

      const v8 = tick(2, v7)
      expect(getFieldFloat(v8)).toBe(-2)
    })

    it('Should works with multiple frames', () => {
      const v1 = setEntity({ state: initialState, entity })
      const v2 = fieldNumber.set({
        state: v1,
        data: defaultFieldNumber({ entity, name: fieldNumberName, data: 0 }),
      })
      const v3 = animation.set({
        state: v2,
        data: defaultAnimation({
          entity,
          name: animationName,
          data: {
            isPlaying: true,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
              {
                duration: 1,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
              {
                duration: 2,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
              {
                duration: 100,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
            ],
            currentTime: 0,
            wrapMode: 'Once',
            isFinished: false,
            property: {
              path: 'data',
              component: 'fieldNumber',
              entity: entity,
              name: fieldNumberName,
            },
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getFieldFloat(v4)).toBe(0)

      const v5 = tick(5, v4)
      expect(getFieldFloat(v5)).toBe(0)

      const v6 = tick(10.5, v5)
      expect(getFieldFloat(v6)).toBe(0.5)

      const v7 = tick(12, v6)
      expect(getFieldFloat(v7)).toBe(0.5)

      const v8 = tick(100, v7)
      expect(getFieldFloat(v8)).toBe(0.5)

      const v9 = tick(300, v8)
      expect(getFieldFloat(v9)).toBe(0.87)

      const v10 = tick(100, v9)

      // (getFieldFloat(newState).value === 0.0);
      expect(getAnimation(v10)?.isPlaying).toBe(false)
      expect(getAnimation(v10)?.currentTime).toBe(0)
    })

    it('Should works with looped animations', () => {
      const v1 = setEntity({ state: initialState, entity })
      const v2 = fieldNumber.set({
        state: v1,
        data: defaultFieldNumber({ entity, name: fieldNumberName, data: 0 }),
      })
      const v3 = animation.set({
        state: v2,
        data: defaultAnimation({
          entity,
          name: animationName,
          data: {
            isPlaying: true,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
              {
                duration: 1,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
              {
                duration: 2,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
              {
                duration: 100,
                timingFunction: 'Linear',
                valueRange: { type: 'Number', value: vector(0, 1) },
              },
            ],
            currentTime: 0,
            wrapMode: 'Loop',
            isFinished: false,
            property: {
              path: 'data',
              component: 'fieldNumber',
              entity: entity,
              name: fieldNumberName,
            },
          },
        }),
      })

      const v4 = tick(2000, v3)

      const v5 = tick(2000, v4)
      expect(getFieldFloat(v5)).toBe(0.66)
      expect(getAnimation(v5)?.isFinished).toBe(true)
      expect(getAnimation(v5)?.isPlaying).toBe(true)
      expect(getAnimation(v5)?.currentTime).toBe(66)

      const v6 = tick(2010, v5)
      expect(getAnimation(v6)?.isFinished).toBe(false)
      expect(getAnimation(v6)?.isPlaying).toBe(true)
      expect(getAnimation(v6)?.currentTime).toBe(76)
    })
  })
})
