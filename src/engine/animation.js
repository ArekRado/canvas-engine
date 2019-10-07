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
    hasCustomProperty: typeof segment.property === 'function',
    ...segment,
  }))

const finishAnimation = (go, currentSegment, currentAnimation) => {
  if (currentSegment.hasCustomProperty) {
    currentSegment.property(go, 100, currentSegment.to)
  } else {
    go.setProperty(currentSegment.property, currentSegment.to)
  }

  if (currentAnimation.segments.length >= currentSegment + 1) {
    currentSegment.onEnd && currentSegment.onEnd()
    currentAnimation.setCurrentSegment(currentSegment + 1)
  } else {
    currentSegment.onEnd && currentSegment.onEnd()
    currentAnimation.stop()
    // currentAnimation.reset()
  }
}

const nextAnimationFrame = (go, currentSegment, timer) => {
  const { duration, from, to } = currentSegment
  const progress = (timer * 100) / duration
  const value = linear(from, to, progress)

  if (currentSegment.hasCustomProperty) {
    currentSegment.property(go, progress, value)
  } else {
    go.setProperty(currentSegment.property, value)
  }
}

export const createAnimation = params => {
  const state = {
    name: '',
    isPlaying: params.playOnStart || false,
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

    play: (payload = {}) => ({
      type: 'play',
      payload,
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
      case 'play':
        console.log('action.payload', action.payload)
        return {
          ...state,
          isPlaying: true,
          duration: action.payload.duration || state.duration,
        }

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
      console.log(currentAnimation.segments[currentAnimation.index].duration)
      if (currentAnimation.isPlaying) {
        if (currentAnimation.segments.length > 0) {
          const { timer, index, segments } = currentAnimation
          const currentSegment = segments[index]

          const newTimer = timer + app.gameObjects.time.delta

          if (newTimer >= currentSegment.duration) {
            finishAnimation(go, currentSegment, currentAnimation)
          } else {
            nextAnimationFrame(go, currentSegment, newTimer)
          }
          currentAnimation.setTimer(newTimer)
        } else {
          currentAnimation.stop()
        }
      }
    },
  }
}
