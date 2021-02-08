import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import {
  sprite as defaultSprite,
  animation as defaultAnimation,
} from '../util/defaultComponents'
import { getActiveKeyframe } from '../system/animation'
import { generateEntity, getEntity, setEntity } from '../util/entity'
import { State, Sprite, Animation } from '../type'
import { initialStateWithDisabledDraw } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { getComponent, setComponent } from '../component'
import { componentName } from '../component'

describe('animation', () => {
  const entity = generateEntity('entity')
  const entityId = entity.id

  const getSprite = (state: State) =>
    getComponent<Sprite>(componentName.sprite, { state, entityId })
  const getAnimation = (state: State) =>
    getComponent<Animation>(componentName.animation, { state, entityId })

  const tick = (timeNow: number, state: State) =>
    runOneFrame({ state, timeNow })

  describe('getActiveKeyframe', () => {
    it('should return proper time and index when time is zero', () => {
      const animation = defaultAnimation({
        entityId,
        isPlaying: true,
        currentTime: 0,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entityId,
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
        entityId,
        isPlaying: true,
        currentTime: 5,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entityId,
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
        entityId,
        isPlaying: true,
        currentTime: 2000,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entityId,
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
        entityId,
        isPlaying: true,
        currentTime: 2000,
        property: {
          component: 'animation',
          path: 'FieldNumber',
          entityId,
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
      const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({ entityId }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entityId,
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
            path: 'rotation',
            component: 'sprite',
            entityId,
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
        data: defaultSprite({ entityId }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entityId,
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
            path: 'rotation',
            component: 'sprite',
            entityId,
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
        data: defaultSprite({ entityId }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entityId,
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
            path: 'rotation',
            component: 'sprite',
            entityId,
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
        data: defaultSprite({ entityId }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entityId,
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
            path: 'rotation',
            component: 'sprite',
            entityId,
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

  it('timingMode step - should change value only once per keyframe', () => {
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
    const v2 = setComponent<Sprite>(componentName.sprite, {
      state: v1,
      data: defaultSprite({ entityId }),
    })
    const v3 = setComponent<Animation>(componentName.animation, {
      state: v2,
      data: defaultAnimation({
        entityId,
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
          path: 'rotation',
          component: 'sprite',
          entityId,
        },
        timingMode: 'step',
      }),
    })

    const v4 = tick(0, v3)
    expect(getSprite(v4)?.rotation).toBe(1)

    const v5 = tick(5, v4)
    expect(getSprite(v5)?.rotation).toBe(1)

    const v6 = tick(7, v5)
    expect(getSprite(v6)?.rotation).toBe(1)

    const v7 = tick(8, v6)
    expect(getSprite(v7)?.rotation).toBe(1)

    const v8 = tick(10.5, v7)
    expect(getSprite(v8)?.rotation).toBe(1)

    const v9 = tick(12, v8)
    expect(getSprite(v9)?.rotation).toBe(3)

    const v10 = tick(100, v9)
    expect(getSprite(v10)?.rotation).toBe(3)

    const v11 = tick(300, v10)
    expect(getSprite(v11)?.rotation).toBe(3)
  })

  describe('string', () => {
    it('Linear animation should change value in proper way', () => {
      const src1 = 'walk1.png'
      const src2 = 'walk2.png'

      const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({ entityId }),
      })
      const v3 = setComponent<Animation>(componentName.animation, {
        state: v2,
        data: defaultAnimation({
          entityId,
          isPlaying: true,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'string',
                value: src1,
              },
            },
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: {
                type: 'string',
                value: src2,
              },
            },
          ],
          currentTime: 0,
          wrapMode: 'once',
          isFinished: false,
          property: {
            path: 'src',
            component: 'sprite',
            entityId,
          },
          timingMode: 'smooth', // string animation should always works as step
        }),
      })

      const v4 = tick(0, v3)
      expect(getSprite(v4)?.src).toBe(src1)

      const v5 = tick(5, v4)
      expect(getSprite(v5)?.src).toBe(src1)

      const v6 = tick(7, v5)
      expect(getSprite(v6)?.src).toBe(src1)

      const v7 = tick(8, v6)
      expect(getSprite(v7)?.src).toBe(src1)

      const v8 = tick(10.5, v7)
      expect(getSprite(v8)?.src).toBe(src1)

      const v9 = tick(12, v8)
      expect(getSprite(v9)?.src).toBe(src2)

      const v10 = tick(100, v9)
      expect(getSprite(v10)?.src).toBe(src2)

      const v11 = tick(300, v10)
      expect(getSprite(v11)?.src).toBe(src2)
    })
  })

  it('should animate entity properties', () => {
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })
    const v2 = setComponent<Sprite>(componentName.sprite, {
      state: v1,
      data: defaultSprite({ entityId }),
    })
    const v3 = setComponent<Animation>(componentName.animation, {
      state: v2,
      data: defaultAnimation({
        entityId,
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
          entityId,
        },
      }),
    })

    const v4 = tick(0, v3)
    expect(getEntity({ state: v4, entityId: entity.id })?.position).toEqual(
      vector(0, 0),
    )

    const v5 = tick(1, v4)
    expect(getEntity({ state: v5, entityId: entity.id })?.position).toEqual(
      vector(0, 0),
    )

    const v6 = tick(2, v5)
    expect(getEntity({ state: v6, entityId: entity.id })?.position).toEqual(
      vector(1.2, 1.2),
    )

    const v7 = tick(2, v6)
    expect(getEntity({ state: v7, entityId: entity.id })?.position).toEqual(
      vector(2.4, 2.4),
    )

    const v8 = tick(10, v7)
    expect(getEntity({ state: v8, entityId: entity.id })?.position).toEqual(
      vector(2.4, 2.4),
    )

    const v9 = tick(10, v8)
    expect(getEntity({ state: v9, entityId: entity.id })?.position).toEqual(
      vector(10, 10),
    )

    const v10 = tick(12, v9)
    expect(getEntity({ state: v10, entityId: entity.id })?.position).toEqual(
      vector(10, 10),
    )

    const v11 = tick(120, v10)
    expect(getEntity({ state: v11, entityId: entity.id })?.position).toEqual(
      vector(10, 10),
    )

    const v12 = tick(1020, v11)
    expect(getEntity({ state: v12, entityId: entity.id })?.position).toEqual(
      vector(10, 10),
    )
  })
})
