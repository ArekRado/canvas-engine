import { createStore } from './store'

describe('store', () => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'addItem':
        return {
          ...state,
          items: state.items.concat(action.payload),
        }
      default:
        return state
    }
  }

  it('should return object with dispatch and state', () => {
    const store = createStore(reducer, null, { someAction: () => ({}) })

    expect(store.dispatch).toBeDefined()
    expect(store.getState).toBeDefined()
    expect(store.actions.someAction).toBeDefined()
  })

  it('should be able to use actions as object', () => {
    const rawActions = {
      addItem: payload => ({
        type: 'addItem',
        payload,
      }),
    }

    const { getState, actions } = createStore(
      reducer,
      { items: [] },
      rawActions,
    )

    console.log('actions', actions)
    actions.addItem(1)

    expect(getState().items).toEqual([1])
  })

  // it('should be able to use actions as functions which have access to dispatch and getState', () => {
  //   const store = createStore(reducer, { items: [] })

  //   store.dispatch({
  //     type: 'addItem',
  //     payload: 1,
  //   })

  //   expect(store.getState().items).toEqual([1])
  // })

  // it('should push object to array and return it as state', () => {
  //   const { getState, actions } = createStore(
  //     reducer,
  //     { items: [] },
  //     { addItem: payload => ({ type: 'addItem', payload }) },
  //   )

  //   actions.addItem({
  //     type: 'addItem',
  //     payload: 1,
  //   })

  //   expect(getState().items).toEqual([1])
  // })

  // it('should push object to array and not mutate prev state', () => {
  //   const actions = {
  //     addItem: (dispatch, localState) => payload => ({
  //       type: 'addItem',
  //       payload,
  //     }),
  //   }
  //   const store = createStore(reducer, { items: [] })
  //   const prevState = store.getState()

  //   actions.addItem()

  //   expect(store.getState().items).toEqual([1])
  //   expect(prevState.items).toEqual([])
  // })
})
