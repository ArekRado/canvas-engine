import 'regenerator-runtime/runtime'
import { getInitialState, getState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { removeComponent, setComponent } from '../component'
import { createSystem } from '../system/createSystem'
import { Dictionary, State } from '../type'

describe('component', () => {
  it('should call system create and remove methods', () => {
    const entity1 = createEntity({ name: 'e1' })
    const entity2 = createEntity({ name: 'e2' })

    const create = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const remove = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const tick = jest.fn<State, [{ state: State }]>(({ state }) => state)

    let state = setEntity({
      entity: entity1,
      state: getState({}),
    })

    state = createSystem({
      state,
      name: 'test',
      create,
      remove,
      tick,
    })

    state = setComponent<Dictionary<{}>>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })
    state = setComponent<Dictionary<{}>>({
      state,
      data: {
        entity: entity2,
        name: 'test',
      },
    })

    state = runOneFrame({ state })
    state = removeComponent({ name: 'test', entity: entity1, state })

    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalled()
    expect(tick).toHaveBeenCalled()

    // create new component after remove
    state = setComponent<Partial<{}>>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
    state = setComponent<Partial<{}>>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3)
  })
})
