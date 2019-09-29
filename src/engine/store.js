const i = x => x

export const createStore = (
  reducer = i,
  state = {},
  actions = {},
  enhancedReducer = i,
) => {
  let localState = state

  const dispatch = action => payload => {
    const result = action(payload)

    console.log('payload', payload)

    if (typeof result === 'object') {
      localState = reducer(localState, action)
      // localState = enhancedReducer(reducer(localState, action), action)
    } else {
      // localState = enhancedReducer(
      //   reducer(localState, action(dispatch, () => localState)),
      //   action,
      // )
      localState = enhancedReducer(
        reducer(localState, result(dispatch, () => localState)),
        action,
      )
    }
  }

  // Object.keys(actions).forEach(key => {
  //   actions[key] = actions[key](dispatch, localState)
  // })

  return {
    getState() {
      return localState
    },
    dispatch,
    actions: Object.keys(actions).reduce(
      (bindedActions, key) => ({
        ...bindedActions,
        [key]: dispatch(actions[key]),
      }),
      {},
    ),
  }
}
