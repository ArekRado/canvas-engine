import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { defaultAnimation, defaultSprite } from '../util/defaultComponents'
import { getActiveKeyframe } from '../system/animation'
import { generate, set as setEntity } from '../util/entity'
import { State, Sprite, Animation } from '../type'
import { initialStateWithDisabledDraw } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { getComponent, setComponent } from '../component'
import { componentName } from '../component'

describe('animation', () => {
  const entity = generate('entity')

  const getSprite = (state: State) =>
    getComponent<Sprite>(componentName.sprite, { state, entity })
  const getAnimation = (state: State) =>
    getComponent<Animation>(componentName.animation, { state, entity })

  const tick = (timeNow: number, state: State) =>
    runOneFrame({ state, timeNow })

  describe('getActiveKeyframe', () => {
    it('should return proper time and index when time is zero', () => {
      const animation = defaultAnimation({
        entity,
        isPlaying: true,
        currentTime: 0,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entity: entity,
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
          entity: entity,
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
          entity: entity,
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
          entity: entity,
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
      const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({ entity }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entity,
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
            path: 'rotation',
            component: 'sprite',
            entity: entity,
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getSprite(v4)?.rotation).toBe(0)

      const v5 = tick(1, v4)
      expect(getSprite(v5)?.rotation).toBe(0)

      const v6 = tick(2, v5)
      expect(getSprite(v6)?.rotation).toBe(0.1)

      const v7 = tick(2, v6)
      expect(getSprite(v7)?.rotation).toBe(0.2)

      const v8 = tick(10, v7)
      expect(getSprite(v8)?.rotation).toBe(0.2)

      const v9 = tick(10, v8)
      expect(getSprite(v9)?.rotation).toBe(1)

      const v10 = tick(12, v9)
      expect(getSprite(v10)?.rotation).toBe(1)

      const v11 = tick(120, v10)
      expect(getSprite(v11)?.rotation).toBe(1)

      const v12 = tick(1020, v11)
      expect(getSprite(v12)?.rotation).toBe(1)
    })

    it('Should works with negative values', () => {
      const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({ entity }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entity,
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
            path: 'rotation',
            component: 'sprite',
            entity: entity,
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getSprite(v4)?.rotation).toBe(-0)

      const v5 = tick(1, v4)
      expect(getSprite(v5)?.rotation).toBe(-0)

      const v6 = tick(22, v5)
      expect(getSprite(v6)?.rotation).toBe(-0.1)

      const v7 = tick(22, v6)
      expect(getSprite(v7)?.rotation).toBe(-2)

      const v8 = tick(2, v7)
      expect(getSprite(v8)?.rotation).toBe(-2)
    })

    it('Should works with multiple frames', () => {
      const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({ entity }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entity,
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
            path: 'rotation',
            component: 'sprite',
            entity: entity,
          },
        }),
      })

      const v4 = tick(0, v3)
      expect(getSprite(v4)?.rotation).toBe(0)

      const v5 = tick(5, v4)
      expect(getSprite(v5)?.rotation).toBe(0)

      const v6 = tick(10.5, v5)
      expect(getSprite(v6)?.rotation).toBe(0.5)

      const v7 = tick(12, v6)
      expect(getSprite(v7)?.rotation).toBe(0.5)

      const v8 = tick(100, v7)
      expect(getSprite(v8)?.rotation).toBe(0.5)

      const v9 = tick(300, v8)
      expect(getSprite(v9)?.rotation).toBe(0.87)

      const v10 = tick(100, v9)

      // (getSprite(newState)?.rotation === 0.0);
      // expect(getAnimation(v10)?.isPlaying).toBe(false)
      // expect(getAnimation(v10)?.currentTime).toBe(0)
      expect(getAnimation(v10)?.isPlaying).toBe(true)
      expect(getAnimation(v10)?.currentTime).toBe(300)
    })

    it('Should works with looped animations', () => {
      const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({ entity }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entity,
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
            path: 'rotation',
            component: 'sprite',
            entity: entity,
          },
        }),
      })

      const v4 = tick(2000, v3)

      const v5 = tick(2000, v4)
      expect(getSprite(v5)?.rotation).toBe(0.66)
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
