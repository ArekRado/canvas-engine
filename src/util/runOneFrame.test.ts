/* eslint-disable @typescript-eslint/no-explicit-any */
import { createComponent } from '../component/createComponent'
import { createGlobalSystem, createSystem } from '../system/createSystem'
import { EmptyState } from '../type'
import { runOneFrame } from './runOneFrame'
import { getEmptyState } from './state'
import { vi, describe, it, expect } from 'vitest'

describe('runOneFrame', () => {
  it('should call system tick in proper order depending on system priority', () => {
    const callQueue: string[] = []

    const tick1 = vi.fn(({ state }) => {
      callQueue.push('tick1')
      return state
    })
    const tick2 = vi.fn(({ state }) => {
      callQueue.push('tick2')
      return state
    })
    const tick3 = vi.fn(({ state }) => {
      callQueue.push('tick3')
      return state
    })
    const tick4 = vi.fn(({ state }) => {
      callQueue.push('tick4')
      return state
    })
    const tick5 = vi.fn(({ state }) => {
      callQueue.push('tick5')
      return state
    })

    let state = getEmptyState()
    state = createComponent(state, 'system4', 'entity system4', {})
    state = createComponent(state, 'system5', 'entity system5', {})

    state = createGlobalSystem<EmptyState<any, any>>({
      name: 'system1',
      tick: tick1,
      state,
      priority: 1,
    })

    state = createGlobalSystem<EmptyState<any, any>>({
      name: 'system2',
      tick: tick2,
      state,
      priority: 2,
    })

    state = createGlobalSystem<EmptyState<any, any>>({
      name: 'system3',
      tick: tick3,
      state,
      priority: 1,
    })

    state = createSystem<null, EmptyState<any, any>>({
      name: 'system4',
      componentName: 'system4',
      tick: tick4,
      state,
      priority: 3,
    })

    state = createSystem<null, EmptyState<any, any>>({
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
