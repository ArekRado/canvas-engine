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

    actions.addItem(1)

    expect(getState().items).toEqual([1])
  })

  it('should be able to use actions as functions which have access to dispatch and getState', () => {
    const rawActions = {
      addItem: payload => ({
        type: 'addItem',
        payload,
      }),
      addMultipleItems: () => (dispatch, getState) => {
        dispatch({
          type: 'addItem',
          payload: getState().items.length,
        })
        dispatch({
          type: 'addItem',
          payload: getState().items.length,
        })
        dispatch({
          type: 'addItem',
          payload: getState().items.length,
        })
      },
    }

    const { getState, actions } = createStore(
      reducer,
      { items: [] },
      rawActions,
    )

    actions.addMultipleItems()

    expect(getState().items).toEqual([0, 1, 2])
  })

  it('should push object to array and not mutate prev state', () => {
    const rawActions = {
      addItem: payload => ({
        type: 'addItem',
        payload,
      }),
    }
    const { actions, getState } = createStore(
      reducer,
      { items: [] },
      rawActions,
    )
    const prevState = getState()

    actions.addItem(1)

    expect(getState().items).toEqual([1])
    expect(prevState.items).toEqual([])
  })
})
