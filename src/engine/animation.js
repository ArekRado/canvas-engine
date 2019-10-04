import { createStore } from './store'

export const linear = (from, to, progress) =>
  ((to - from) * progress) / 100 + from

const mapSegments = segments =>
  segments.map(segment => ({
    delay: 0,
    easing: 'linear',
    onStart: '',
    onEnd: '',
    property: '',
    ...segment,
  }))

export const createAnimation = params => {
  const state = {
    name: '',
    isPlaying: params.playOnStart,
    startTime: 0,
    index: 0,
    timer: 0,

    segments: mapSegments(params.segments),
    // segments: [
    //   {
    //     from: 0,
    //     to: 0,
    //     duration: 0,
    //     delay: 0,
    //     easing: 'linear',
    //     onEnd: '',
    //     property: '',
    //   },
    //   [],
    // ],
  }

  const actions = {
    setSegments: payload => ({
      type: 'setSegments',
      payload,
    }),

    play: () => ({
      type: 'setIsPlaying',
      payload: true,
    }),

    setCurrentSegment: () => ({
      type: 'setCurrentSegment',
      payload: true,
    }),

    setTimer: payload => ({
      type: 'setTimer',
      payload,
    }),

    reset: () => ({
      type: 'reset',
    }),

    stop: () => ({
      type: 'setIsPlaying',
      payload: false,
    }),
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setIsPlaying':
        return {
          ...state,
          isPlaying: action.payload,
        }

      case 'setCurrentSegment':
        return {
          ...state,
          currentSegment: action.payload,
        }

      case 'setTimer':
        return {
          ...state,
          timer: action.payload,
        }

      case 'reset':
        return {
          ...state,
          isPlaying: false,
          startTime: 0,
          index: 0,
          timer: 0,
        }

      case 'setSegments':
        return {
          ...state,
          segments: action.payload,
        }

      default:
        return state
    }
  }

  const { actions: bindedActions, getState } = createStore(
    reducer,
    state,
    actions,
  )

  return {
    ...state,
    ...bindedActions,
    getState,
    tick: (go, app, currentAnimation) => {
      if (currentAnimation.isPlaying) {
        if (currentAnimation.segments.length > 0) {
          const { timer, index, segments } = currentAnimation
          const currentSegment = segments[index]
          const { from, to, duration } = currentSegment

          const newTimer = timer + app.gameObjects.time.delta

          if (newTimer >= currentSegment.duration) {
            go.setProperty(currentSegment.property, currentSegment.to)

            if (segments.length >= currentSegment + 1) {
              currentSegment.onEnd && currentSegment.onEnd()
              currentAnimation.setCurrentSegment(currentSegment + 1)
            } else {
              currentSegment.onEnd && currentSegment.onEnd()
              currentAnimation.stop()
              // currentAnimation.reset()
            }
          } else {
            const progress = (newTimer * 100) / duration
            const newValue = linear(from, to, progress)

            go.setProperty(currentSegment.property, newValue)
          }
          currentAnimation.setTimer(newTimer)
        } else {
          console.log('stop')
          currentAnimation.stop()
        }
      }
    },
  }
}
