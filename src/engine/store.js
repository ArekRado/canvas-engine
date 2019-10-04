const i = x => x

export const createStore = (
  reducer = i,
  state = {},
  actions = {},
  enhancedReducer = i,
) => {
  let localState = state

  const dispatch = action => {
    if (typeof action === 'object') {
      localState = enhancedReducer(reducer(localState, action), action)
    } else {
      action(dispatch, () => localState)

      // localState = enhancedReducer(
      //   reducer(localState, action(dispatch, () => localState)),
      //   action,
      // )
    }
  }

  return {
    getState() {
      return localState
    },
    dispatch,
    actions: Object.keys(actions).reduce(
      (bindedActions, key) => ({
        ...bindedActions,
        [key]: (...args) => dispatch(actions[key](...args)),
      }),
      {},
    ),
  }
}
