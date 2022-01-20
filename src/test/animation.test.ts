import 'regenerator-runtime/runtime'
import { vector, Vector2D } from '@arekrado/vector-2d'
import {
  transform as defaultTransform,
  animationNumber,
  animationString,
  animationVector2D,
  animationVector3D,
} from '../util/defaultComponents'
import {
  getActiveKeyframe,
  updateNumberAnimation,
  updateVector2DAnimation,
  updateVector3DAnimation,
  updateStringAnimation,
} from '../system/animation'
import { createEntity, setEntity } from '../entity'
import { InternalInitialState, Vector3D } from '../type'
import { runOneFrame } from '../util/runOneFrame'
import { getComponent, setComponent } from '../component'
import { componentName } from '../component'
import { getTime, setTime } from '../system/time'
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

  const getNumberComponent = (state: InternalInitialState) =>
    getComponent<NumberComponent>({ name: numberComponentName, state, entity })

  const getStringComponent = (state: InternalInitialState) =>
    getComponent<StringComponent>({ name: stringComponentName, state, entity })

  const getVector2DComponent = (state: InternalInitialState) =>
    getComponent<Vector2DComponent>({
      name: vector2DComponentName,
      state,
      entity,
    })

  const getVector3DComponent = (state: InternalInitialState) =>
    getComponent<Vector3DComponent>({
      name: vector3DComponentName,
      state,
      entity,
    })

  const getAnimationNumber = (state: InternalInitialState) =>
    getComponent<AnimationNumber>({
      name: componentName.animationNumber,
      state,
      entity,
    })

  const getAnimationString = (state: InternalInitialState) =>
    getComponent<AnimationString>({
      name: componentName.animationString,
      state,
      entity,
    })

  const getAnimationVector2D = (state: InternalInitialState) =>
    getComponent<AnimationVector2D>({
      name: componentName.animationVector2D,
      state,
      entity,
    })

  const getAnimationVector3D = (state: InternalInitialState) =>
    getComponent<AnimationVector3D>({
      name: componentName.animationVector3D,
      state,
      entity,
    })

  const tick = (timeNow: number, state: InternalInitialState) => {
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

    it('should return proper data when animation has multiple keyframes - animation in the middle ', () => {
      const animation = animationNumber({
        entity,
        isPlaying: true,
        keyframes: [
          {
            duration: 2,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
          {
            duration: 2,
            timingFunction: 'Linear',
            valueRange: vector(0, 1),
          },
        ],
        currentTime: 3,
        wrapMode: 'once',
        isFinished: false,
        property: {
          path: 'value',
          component: numberComponentName,
          entity,
        },
      })

      expect(getActiveKeyframe(animation, false)).toEqual({
        keyframeCurrentTime: 1,
        keyframeIndex: 1,
        timeExceeded: false,
      })
    })

    it('should return proper data when animation has one keyframe and currentTime exceeded animation', () => {
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
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
        getActiveKeyframe(animation, false)

      expect(keyframeCurrentTime).toBe(1990)
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

    it('should return proper data when animation has negative value range', () => {
      const animation1 = animationNumber({
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
            valueRange: vector(-1, -2),
          },
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      expect(getActiveKeyframe(animation1, false)).toEqual({
        keyframeCurrentTime: 5,
        keyframeIndex: 0,
        timeExceeded: false,
      })

      const animation2 = animationNumber({
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
            valueRange: vector(-1, -2),
          },
        ],
        isFinished: false,
        wrapMode: 'once',
      })

      expect(getActiveKeyframe(animation2, false)).toEqual({
        keyframeCurrentTime: 1990,
        keyframeIndex: -1,
        timeExceeded: true,
      })
    })
  })

  describe('updateNumberAnimation', () => {
    it('should return correct new value when keyframe has negative value range', () => {
      const value = updateNumberAnimation({
        keyframe: {
          duration: 10,
          timingFunction: 'Linear',
          valueRange: [-1, -2],
        },
        timingMode: 'smooth',
        progress: 0.5,
      })

      expect(value).toBe(-1.5)
    })

    it('should return correct new value', () => {
      const value = updateNumberAnimation({
        keyframe: {
          duration: 10,
          timingFunction: 'Linear',
          valueRange: [1, 2],
        },
        timingMode: 'smooth',
        progress: 0.5,
      })

      expect(value).toBe(1.5)
    })
  })

  describe('updateVector2DAnimation', () => {
    it('should return correct new value when keyframe has negative value range', () => {
      const value = updateVector2DAnimation({
        keyframe: {
          duration: 10,
          timingFunction: 'Linear',
          valueRange: [
            [-1, -1],
            [-2, -2],
          ],
        },
        timingMode: 'smooth',
        progress: 0.5,
      })

      expect(value.toString()).toBe([-1.5, -1.5].toString())
    })

    it('should return correct new value', () => {
      const value = updateVector2DAnimation({
        keyframe: {
          duration: 10,
          timingFunction: 'Linear',
          valueRange: [
            [1, 1],
            [2, 2],
          ],
        },
        timingMode: 'smooth',
        progress: 0.5,
      })

      expect(value.toString()).toBe([1.5, 1.5].toString())
    })
  })

  describe('updateVector3DAnimation', () => {
    it('should return correct new value when keyframe has negative value range', () => {
      const value = updateVector3DAnimation({
        keyframe: {
          duration: 10,
          timingFunction: 'Linear',
          valueRange: [
            [-1, -1, -1],
            [-2, -2, -2],
          ],
        },
        timingMode: 'smooth',
        progress: 0.5,
      })

      expect(value.toString()).toBe([-1.5, -1.5, -1.5].toString())
    })

    it('should return correct new value', () => {
      const value = updateVector3DAnimation({
        keyframe: {
          duration: 10,
          timingFunction: 'Linear',
          valueRange: [
            [1, 1, 1],
            [2, 2, 2],
          ],
        },
        timingMode: 'smooth',
        progress: 0.5,
      })

      expect(value.toString()).toBe([1.5, 1.5, 1.5].toString())
    })
  })

  describe('number', () => {
    it('Linear animation should change value in proper way', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      state = setComponent<AnimationNumber, InternalInitialState>({
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
      expect(getAnimationNumber(state)?.isFinished).toBeFalsy()
      expect(getAnimationNumber(state)?.isPlaying).toBeTruthy()

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

      expect(getAnimationNumber(state)?.isFinished).toBeTruthy()
      expect(getAnimationNumber(state)?.isPlaying).toBeFalsy()
    })

    it('Should works with negative values', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 5,
        },
      })
      state = setComponent<AnimationNumber, InternalInitialState>({
        state,
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

      // todo animation should not return -0
      //

      state = tick(0, state)
      expect(getNumberComponent(state)?.value).toBe(-1)

      state = tick(1, state)
      expect(getNumberComponent(state)?.value).toBe(-1)

      state = tick(3, state)
      expect(getNumberComponent(state)?.value).toBe(-1.1)

      state = tick(5, state)
      expect(getNumberComponent(state)?.value).toBe(-1.3)

      state = tick(8, state)
      expect(getNumberComponent(state)?.value).toBe(-1.5)

      state = tick(9, state)
      expect(getNumberComponent(state)?.value).toBe(-1.8)

      state = tick(10, state)
      expect(getNumberComponent(state)?.value).toBe(-1.9)

      state = tick(22, state)
      expect(getNumberComponent(state)?.value).toBe(-2)

      state = tick(23, state)
      expect(getNumberComponent(state)?.value).toBe(-2)

      state = tick(440, state)
      expect(getNumberComponent(state)?.value).toBe(-2)

      state = tick(460, state)
      expect(getNumberComponent(state)?.value).toBe(-2)
    })

    it('Should works with multiple frames', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      state = setComponent<AnimationNumber, InternalInitialState>({
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

      state = tick(5, state)
      expect(getNumberComponent(state)?.value).toBe(0)

      state = tick(10.5, state)
      expect(getNumberComponent(state)?.value).toBe(0.5)

      state = tick(12, state)
      expect(getNumberComponent(state)?.value).toBe(0.5)

      state = tick(100, state)
      expect(getNumberComponent(state)?.value).toBe(0.5)

      state = tick(300, state)
      expect(getNumberComponent(state)?.value).toBe(0.87)

      // // Last tick updates animation time, first tick runs animaiton with 0 currentTime
      // // We always want to run animation with 0 frame
      // // actually Im not sure xD
      // state = tick(300, state)

      // expect(getAnimationNumber(state)?.isPlaying).toBe(false)
      // expect(getAnimationNumber(state)?.isFinished).toBe(true)
      // expect(getAnimationNumber(state)?.currentTime).toBe(0)
    })

    it('Should works with looped animations', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      state = setComponent<AnimationNumber, InternalInitialState>({
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
    state = setComponent<Transform, InternalInitialState>({
      state,
      data: defaultTransform({ entity }),
    })
    state = setComponent<AnimationNumber, InternalInitialState>({
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
      state = setComponent<StringComponent, InternalInitialState>({
        state,
        data: { name: stringComponentName, entity, value: '' },
      })

      state = setComponent<AnimationString, InternalInitialState>({
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
      state = setComponent<Vector2DComponent, InternalInitialState>({
        state,
        data: { name: vector2DComponentName, entity, value: vector(-1, -1) },
      })
      state = setComponent<AnimationVector2D, InternalInitialState>({
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
        vector(0, 10).toString(),
      )

      state = tick(5, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(0, 10).toString(),
      )

      state = tick(7, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(10, 6).toString(),
      )

      state = tick(8, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(14, 4.4).toString(),
      )

      state = tick(10.5, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(16, 3.5999999999999996).toString(),
      )

      state = tick(12, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(10.6, 67.55).toString(),
      )

      state = tick(100, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(9.4, 60.2).toString(),
      )

      state = tick(300, state)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        vector(9.4, 60.2).toString(),
      )
    })
  })

  describe('vector3d', () => {
    it('Linear animation should change value in a proper way', () => {
      let state = setEntity({ state: getState({}), entity })

      state = setComponent<Vector3DComponent, InternalInitialState>({
        state,
        data: { name: vector3DComponentName, entity, value: [-1, -1, -1] },
      })

      state = setComponent<AnimationVector3D, InternalInitialState>({
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
          timingMode: 'smooth',
        }),
      })

      state = tick(0, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0].toString(),
      )

      state = tick(5, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0].toString(),
      )

      state = tick(7, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0.016666666666666666].toString(),
      )

      state = tick(8, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0.023333333333333334].toString(),
      )

      state = tick(10.5, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0.02666666666666667].toString(),
      )

      state = tick(12, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0.035].toString(),
      )

      state = tick(100, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0.04].toString(),
      )

      state = tick(300, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0.3333333333333333].toString(),
      )

      state = tick(600, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 1].toString(),
      )

      state = tick(1000, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, 0].toString(),
      )

      state = tick(4000, state)
      expect(getVector3DComponent(state)?.value.toString()).toBe(
        [0, 0, -0.6666666666666667].toString(),
      )
    })
  })
})
