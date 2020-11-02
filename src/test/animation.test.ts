import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { defaultAnimation } from './defaultComponents'
import { getActiveKeyframe } from 'system/animation'

describe('animation', () => {
  const entity = 'entity'
  const animationName = 'animationName'
  const fieldFloatName = 'testFieldFloat'

  describe('getActiveKeyframe', () => {
    it('should return proper time and index when time is zero', () => {
      const animation = defaultAnimation({
        entity,
        name: animationName,
        data: {
          isPlaying: true,
          currentTime: 0,
          property: {
            path: 'FieldNumber',
            entity: entity,
            name: fieldFloatName,
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
            path: 'FieldNumber',
            entity: entity,
            name: fieldFloatName,
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
            path: 'FieldNumber',
            entity: entity,
            name: fieldFloatName,
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
            path: 'FieldNumber',
            entity: entity,
            name: fieldFloatName,
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

  describe('number', () => {})
})
