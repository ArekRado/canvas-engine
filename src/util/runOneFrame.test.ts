import { createComponent } from '../component/createComponent'
import { createGlobalSystem, createSystem } from '../system/createSystem'
import { InternalInitialState } from '../type'
import { runOneFrame } from './runOneFrame'
import { getInitialState } from './state'

describe('runOneFrame', () => {
  it('should call system tick in proper order depending on system priority', () => {
    const callQueue: string[] = []

    const tick1 = jest.fn(({ state }) => {
      callQueue.push('tick1')
      return state
    })
    const tick2 = jest.fn(({ state }) => {
      callQueue.push('tick2')
      return state
    })
    const tick3 = jest.fn(({ state }) => {
      callQueue.push('tick3')
      return state
    })
    const tick4 = jest.fn(({ state }) => {
      callQueue.push('tick4')
      return state
    })
    const tick5 = jest.fn(({ state }) => {
      callQueue.push('tick5')
      return state
    })

    let state = getInitialState()
    state = createComponent({
      state,
      entity: 'entity system4',
      name: 'system4',
      data: {},
    })
    state = createComponent({
      state,
      entity: 'entity system5',
      name: 'system5',
      data: {},
    })

    state = createGlobalSystem<InternalInitialState>({
      name: 'system1',
      tick: tick1,
      state,
      priority: 1,
    })

    state = createGlobalSystem<InternalInitialState>({
      name: 'system2',
      tick: tick2,
      state,
      priority: 2,
    })

    state = createGlobalSystem<InternalInitialState>({
      name: 'system3',
      tick: tick3,
      state,
      priority: 1,
    })

    state = createSystem<null, InternalInitialState>({
      name: 'system4',
      componentName: 'system4',
      tick: tick4,
      state,
      priority: 3,
    })

    state = createSystem<null, InternalInitialState>({
      name: 'system5',
      componentName: 'system5',
      tick: tick5,
      state,
      priority: -1,
    })

    runOneFrame({ state })

    expect(callQueue.toString()).toBe('tick5,tick3,tick1,tick2,tick4')
  })
})
