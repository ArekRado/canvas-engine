import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'
import { setEntity, generateEntity } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'
import { removeComponent, setComponent } from '../component'
import { createSystem } from '../system/createSystem'
import { Dictionary, State } from '../type'

describe('component', () => {
  it('should call system create and remove methods', () => {
    const entity1 = generateEntity('e1')
    const entity2 = generateEntity('e2')

    const create = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const remove = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const tick = jest.fn<State, [{ state: State }]>(({ state }) => state)

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledDraw,
    })

    const v2 = createSystem({
      state: v1,
      name: 'test',
      create,
      remove,
      tick,
    })

    const v3 = setComponent<Dictionary<{}>>('test', {
      state: v2,
      data: {
        entity: entity1,
        name: 'test',
      },
    })
    const v4 = setComponent<Dictionary<{}>>('test', {
      state: v3,
      data: {
        entity: entity2,
        name: 'test',
      },
    })

    const v5 = runOneFrame({ state: v4, timeNow: 0 })
    const v6 = removeComponent('test', { entity: entity1, state: v5 })

    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalled()
    expect(tick).toHaveBeenCalled()

    // create new component after remove
    const v7 = setComponent<Partial<{}>>('test', {
      state: v6,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
    const v8 = setComponent<Partial<{}>>('test', {
      state: v7,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3)
  })
})
