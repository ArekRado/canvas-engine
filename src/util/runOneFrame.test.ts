import { createComponent } from '../component/createComponent'
import { createEntity } from '../entity/createEntity'
import { generateEntity } from '../entity/generateEntity'
import { createGlobalSystem, createSystem } from '../system/createSystem'
import { timeEntity } from '../system/time/time'
import { getTime } from '../system/time/timeCrud'
import { InternalInitialState } from '../type'
import { FIXED_TICK_TIME, runOneFrame } from './runOneFrame'
import { getInitialState, getState } from './state'
import { tick } from './testUtils'
import { vi } from 'vitest'

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

  it.skip('should call fixedTick in the correct amount of calls', () => {
    const deltaList: number[] = []
    const componentName = 'a'
    const fixedTickSystemMock = vi.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    const fixedTicGlobalSystemkMock = vi.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    let state = getState()

    state = createSystem({
      state,
      componentName,
      name: 'test system',
      fixedTick: ({ state }) => {
        const time = getTime({ state, entity: timeEntity })
        deltaList.push(time?.delta ?? -1)

        return fixedTickSystemMock({ state })
      },
    })

    state = createGlobalSystem({
      state,
      name: 'test globalSystem',
      fixedTick: fixedTicGlobalSystemkMock,
    })

    const entity = generateEntity()
    state = createEntity({ state, entity })
    state = createComponent({
      state,
      name: componentName,
      entity,
      data: {},
    })

    state = tick(0, state)
    state = tick(10, state)
    state = tick(20, state)

    expect(fixedTickSystemMock).toHaveBeenCalledTimes(10)
    expect(fixedTicGlobalSystemkMock).toHaveBeenCalledTimes(10)

    // Should call only once and keep 0.2 in a buffer
    state = tick(21.2, state)
    state = tick(21.2, state)

    expect(fixedTickSystemMock).toHaveBeenCalledTimes(21)
    expect(fixedTicGlobalSystemkMock).toHaveBeenCalledTimes(21)

    // Should not call tick and keep 0.7 in a buffer
    state = tick(21.9, state)
    state = tick(21.9, state)

    expect(fixedTickSystemMock).toHaveBeenCalledTimes(21)
    expect(fixedTicGlobalSystemkMock).toHaveBeenCalledTimes(21)

    // Buffer overflow, run tick once
    state = tick(22, state)
    state = tick(22, state)

    expect(fixedTickSystemMock).toHaveBeenCalledTimes(22)
    expect(fixedTicGlobalSystemkMock).toHaveBeenCalledTimes(22)

    // delta in fixedUpdate should be always equal FIXED_TICK_TIME
    deltaList.forEach((delta) => {
      expect(delta).toEqual(FIXED_TICK_TIME)
    })
  })
})
