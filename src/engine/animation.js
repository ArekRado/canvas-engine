import { createStore } from './store'

const linear = (from, to, progress) => (from * progress) / to

const mapSegments = segments =>
  segments.map(segment => ({
    delay: 0,
    easing: 'linear',
    onStart: '',
    onEnd: '',
    property: '',
    ...segment,
  }))

export const createAnimation = (segments = [], playOnStart = false) => {
  const state = {
    name: '',
    isPlaying: playOnStart,
    startTime: 0,
    index: 0,
    timer: 0,

    segments: mapSegments(segments),
    // segments: [
    //   {
    //     from: 0,
    //     to: 0,
    //     duration: 0,
    //     delay: 0,
    //     easing: 'linear',
    //     onStart: '',
    //     onEnd: '',
    //     property: '',
    //   },
    //   [],
    // ],
  }

  const actions = {
    setSegments: dispatch => payload =>
      dispatch({
        type: 'setSegments',
        payload,
      }),

    play: dispatch => () =>
      dispatch({
        type: 'setIsPlaying',
        payload: true,
      }),

    setCurrentSegment: dispatch => () =>
      dispatch({
        type: 'setCurrentSegment',
        payload: true,
      }),

    setTimer: dispatch => payload =>
      dispatch({
        type: 'setTimer',
        payload,
      }),

    reset: dispatch => () =>
      dispatch({
        type: 'reset',
      }),

    stop: dispatch => () =>
      dispatch({
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

  const store = createStore(reducer, state, actions)

  return {
    ...state,
    ...actions,
    store,
    tick: (go, app, currentAnimation) => {
      if (currentAnimation.isPlaying) {
        if (currentAnimation.segments.length > 0) {
          const { delta } = app.gameObjects.time
          const { timer, index, segments } = currentAnimation
          const currentSegment = segments[index]
          const { from, to, duration } = currentSegment

          const newTimer = timer + delta

          if (newTimer >= currentSegment.duration) {
            currentAnimation[currentSegment.onEnd]()
            go.setProperty(currentSegment.property, currentSegment.to)

            if (segments.length >= currentSegment + 1) {
              currentAnimation.setCurrentSegment(currentSegment + 1)
            } else {
              currentAnimation.reset()
            }
          } else {
            const progress = (newTimer * 100) / duration
            const newValue = linear(from, to, progress)

            go.setProperty(currentSegment.property, newValue)
          }
          currentAnimation.setTimer(newTimer)
        } else {
          currentAnimation.stop()
        }
      }
    },
  }
}
