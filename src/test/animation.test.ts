import 'regenerator-runtime/runtime'
import { vector, Vector2D } from '@arekrado/vector-2d'
import {
  animation,
  transform as defaultTransform,
} from '../util/defaultComponents'
import {
  getActiveKeyframe,
  updateNumberAnimation,
  updateVector2DAnimation,
  updateVector3DAnimation,
  // updateStringAnimation,
} from '../system/animation'
import { createEntity, setEntity } from '../entity'
import { ECSEvent, InternalInitialState, Vector3D } from '../type'
import { runOneFrame } from '../util/runOneFrame'
import { getComponent, setComponent } from '../component'
import { componentName } from '../component'
import { setTime } from '../system/time'
import {
  Animation,
  Component,
  createEventSystem,
  createSystem,
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

  const getAnimation = (state: InternalInitialState) =>
    getComponent<Animation.AnimationComponent>({
      name: componentName.animation,
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
      const { keyframeCurrentTime, keyframeIndex } = getActiveKeyframe({
        wrapMode: Animation.WrapMode.once,
        currentTime: 0,
        animationProperty: {
          component: 'animation',
          path: 'FieldNumber',
          entity,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
          ],
        },
        secondLoop: false,
      })

      expect(keyframeCurrentTime).toBe(0)
      expect(keyframeIndex).toBe(0)
    })

    it('should return proper time and index when time is non zero', () => {
      const { keyframeCurrentTime, keyframeIndex } = getActiveKeyframe({
        wrapMode: Animation.WrapMode.once,
        currentTime: 5,
        animationProperty: {
          component: 'animation',
          path: 'FieldNumber',
          entity,
          keyframes: [
            {
              duration: 10,
              timingFunction: 'Linear',
              valueRange: vector(0, 1),
            },
          ],
        },
        secondLoop: false,
      })

      expect(keyframeCurrentTime).toBe(5)
      expect(keyframeIndex).toBe(0)
    })

    it('should return proper data when animation has multiple keyframes and currentTime exceeded all keyframes', () => {
      const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
        getActiveKeyframe({
          secondLoop: false,
          currentTime: 2000,
          wrapMode: Animation.WrapMode.once,
          animationProperty: {
            component: 'animation',
            path: 'FieldNumber',
            entity,
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
          },
        })

      expect(keyframeCurrentTime).toBe(1887.0)
      expect(timeExceeded).toBe(true)
      expect(keyframeIndex).toBe(-1)
    })

    it('should return proper data when animation has multiple keyframes - animation in the middle ', () => {
      expect(
        getActiveKeyframe({
          currentTime: 3,
          wrapMode: Animation.WrapMode.once,
          animationProperty: {
            path: 'value',
            component: numberComponentName,
            entity,
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
          },
          secondLoop: false,
        }),
      ).toEqual({
        keyframeCurrentTime: 1,
        keyframeIndex: 1,
        timeExceeded: false,
      })
    })

    it('should return proper data when animation has one keyframe and currentTime exceeded animation', () => {
      const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
        getActiveKeyframe({
          currentTime: 2000,
          wrapMode: Animation.WrapMode.once,
          secondLoop: false,
          animationProperty: {
            component: 'animation',
            path: 'FieldNumber',
            entity,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: vector(0, 1),
              },
            ],
          },
        })

      expect(keyframeCurrentTime).toBe(1990)
      expect(timeExceeded).toBe(true)
      expect(keyframeIndex).toBe(-1)
    })

    it('should return proper data when animation has multiple keyframes and is looped', () => {
      const { keyframeCurrentTime, keyframeIndex, timeExceeded } =
        getActiveKeyframe({
          currentTime: 2000,
          wrapMode: Animation.WrapMode.loop,
          secondLoop: false,
          animationProperty: {
            component: 'animation',
            path: 'FieldNumber',
            entity,
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
          },
        })

      expect(keyframeCurrentTime).toBe(66.0)
      expect(timeExceeded).toBe(true)
      expect(keyframeIndex).toBe(3)
    })

    it('should return proper data when animation has negative value range', () => {
      expect(
        getActiveKeyframe({
          currentTime: 5,
          wrapMode: Animation.WrapMode.once,
          animationProperty: {
            component: 'animation',
            path: 'FieldNumber',
            entity,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: vector(-1, -2),
              },
            ],
          },
          secondLoop: false,
        }),
      ).toEqual({
        keyframeCurrentTime: 5,
        keyframeIndex: 0,
        timeExceeded: false,
      })

      expect(
        getActiveKeyframe({
          currentTime: 2000,
          wrapMode: Animation.WrapMode.once,
          animationProperty: {
            component: 'animation',
            path: 'FieldNumber',
            entity,
            keyframes: [
              {
                duration: 10,
                timingFunction: 'Linear',
                valueRange: vector(-1, -2),
              },
            ],
          },
          secondLoop: false,
        }),
      ).toEqual({
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
    it.todo('should works with index')

    it('should trigger system update method', () => {
      const update = jest.fn<
        InternalInitialState,
        [{ state: InternalInitialState }]
      >(({ state }) => state)

      let state = setEntity({ state: getState({}), entity })
      state = createSystem({
        state,
        name: numberComponentName,
        componentName: numberComponentName,
        update,
      })

      expect(update).toHaveBeenCalledTimes(0)

      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })

      expect(update).toHaveBeenCalledTimes(1)

      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
              keyframes: [
                {
                  duration: 10,
                  timingFunction: 'Linear',
                  valueRange: vector(0, 1),
                },
              ],
            },
          ],
        }),
      })

      state = tick(0, state)
      expect(update).toHaveBeenCalledTimes(2)
    })

    it('should emit even on every keyframe change', () => {
      const event = (type: string): ECSEvent<string, string> => ({
        type,
        payload: 'payload',
      })
      const eventHandler = jest.fn(({ state }) => state)
      const { emitEvent, eventSystem } = createEventSystem({ eventHandler })

      let state = setEntity({ state: getState({ emitEvent }), entity })

      state = eventSystem(state)

      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })

      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
              keyframes: [
                {
                  duration: 10,
                  timingFunction: 'Linear',
                  valueRange: vector(0, 1),
                  endFrameEvent: event('1'),
                },
                {
                  duration: 1,
                  timingFunction: 'Linear',
                  valueRange: vector(0, 1),
                  endFrameEvent: event('2'),
                },
                {
                  duration: 100,
                  timingFunction: 'Linear',
                  valueRange: vector(0, 1),
                  endFrameEvent: event('3'),
                },
              ],
            },
            {
              path: 'value',
              component: numberComponentName,
              entity,
              keyframes: [
                {
                  duration: 10,
                  timingFunction: 'Linear',
                  valueRange: vector(0, 1),
                  endFrameEvent: event('4'),
                },
              ],
            },
          ],
        }),
      })

      state = tick(0, state)

      // start - no events
      expect(eventHandler).toHaveBeenCalledTimes(0)
      // TODO - call events on each keyframe end instead of end of each property
      // middle of first keyframe - no events
      // state = tick(5, state)
      // expect(eventHandler).toHaveBeenCalledTimes(1);
      // // middle of third keyframe - 2 events
      // state = tick(61, state)
      // expect(eventHandler).toHaveBeenCalledTimes(1);
      // // middle of first keyframe in a second property - 3 events
      // state = tick(102, state)
      // expect(eventHandler).toHaveBeenCalledTimes(1);
      // time exceded - 4 events
      // state = tick(501, state)

      // triggers two properties
      // todo why it needs 3 ticks!!!
      state = tick(500, state)
      state = tick(501, state)
      state = tick(502, state)
      expect(eventHandler).toHaveBeenCalledTimes(2)
    })

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
      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
              keyframes: [
                {
                  duration: 10,
                  timingFunction: 'Linear',
                  valueRange: vector(0, 1),
                },
              ],
            },
          ],
        }),
      })

      state = tick(0, state)
      expect(getNumberComponent(state)?.value).toBe(0)
      expect(getAnimation(state)?.isFinished).toBeFalsy()
      expect(getAnimation(state)?.isPlaying).toBeTruthy()

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

      expect(getAnimation(state)?.isFinished).toBeTruthy()
      expect(getAnimation(state)?.isPlaying).toBeFalsy()
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
      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
              keyframes: [
                {
                  duration: 10,
                  timingFunction: 'Linear',
                  valueRange: vector(-1, -2),
                },
              ],
            },
          ],
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
      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
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
            },
          ],
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

      // expect(getAnimation(state)?.isPlaying).toBe(false)
      // expect(getAnimation(state)?.isFinished).toBe(true)
      // expect(getAnimation(state)?.currentTime).toBe(0)
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
      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.loop,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
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
            },
          ],
        }),
      })

      state = tick(0, state)
      state = tick(2000, state)

      state = tick(2000, state)
      expect(getNumberComponent(state)?.value).toBe(0.66)
      expect(getAnimation(state)?.isFinished).toBe(false)
      expect(getAnimation(state)?.isPlaying).toBe(true)
      expect(getAnimation(state)?.currentTime).toBe(2000)

      state = tick(2010, state)
      expect(getAnimation(state)?.isFinished).toBe(false)
      expect(getAnimation(state)?.isPlaying).toBe(true)
      expect(getAnimation(state)?.currentTime).toBe(2010)
    })

    it('Should works with multiple properties', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<NumberComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: numberComponentName,
          value: 0,
        },
      })
      state = setComponent<Vector2DComponent, InternalInitialState>({
        state,
        data: {
          entity,
          name: vector2DComponentName,
          value: [0, 0],
        },
      })

      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
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
            },
            {
              path: 'value',
              component: vector2DComponentName,
              entity,
              keyframes: [
                {
                  duration: 13,
                  timingFunction: 'Linear',
                  valueRange: [vector(0, 0), vector(0, 13)],
                },
                {
                  duration: 100,
                  timingFunction: 'Linear',
                  valueRange: [vector(1, 1), vector(4, 4)],
                },
              ],
            },
          ],
        }),
      })

      state = tick(0, state)
      expect(getNumberComponent(state)?.value).toBe(0)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        [0, 0].toString(),
      )

      state = tick(5, state)
      expect(getNumberComponent(state)?.value).toBe(0)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        [0, 0].toString(),
      )

      state = tick(10.5, state)
      expect(getNumberComponent(state)?.value).toBe(0.5)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        [0, 5].toString(),
      )

      state = tick(12, state)
      expect(getNumberComponent(state)?.value).toBe(0.5)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        [0.0, 10.5].toString(),
      )

      state = tick(100, state)
      expect(getNumberComponent(state)?.value).toBe(0.5)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        [0, 12].toString(),
      )

      state = tick(300, state)
      expect(getNumberComponent(state)?.value).toBe(0.87)
      expect(getVector2DComponent(state)?.value.toString()).toBe(
        [3.61, 3.61].toString(),
      )
      state = tick(300, state)

      expect(getAnimation(state)?.isPlaying).toBe(false)
      expect(getAnimation(state)?.isFinished).toBe(true)
      expect(getAnimation(state)?.currentTime).toBe(0)
    })

    it('timingMode step - should change value only once per keyframe', () => {
      let state = setEntity({ state: getState({}), entity })
      state = setComponent<Transform, InternalInitialState>({
        state,
        data: defaultTransform({ entity }),
      })
      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          timingMode: Animation.TimingMode.step,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: numberComponentName,
              entity,
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
            },
          ],
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

      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,
          properties: [
            {
              path: 'value',
              component: stringComponentName,
              entity,
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
            },
          ],
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
      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,

          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          isFinished: false,

          properties: [
            {
              path: 'value',
              component: vector2DComponentName,
              entity,
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
            },
          ],
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

      state = setComponent<Animation.AnimationComponent, InternalInitialState>({
        state,
        data: animation({
          entity,
          isPlaying: true,
          isFinished: false,
          currentTime: 0,
          wrapMode: Animation.WrapMode.once,
          properties: [
            {
              path: 'value',
              component: vector3DComponentName,
              entity,
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
            },
          ],
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
