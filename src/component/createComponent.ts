import { getSystemByComponentName } from '../system/getSystemByName'
import { Entity, InitialState } from '../type'

export const createComponent = <Data, State extends InitialState>(
  state: State,
  name: string,
  entity: Entity,
  data: Data,
): State => {
  const isFirstComponentThisName = state.component[name] === undefined
  const needCreateEntity = isFirstComponentThisName
    ? true
    : state.component[name]?.get?.(entity) === undefined

  if (isFirstComponentThisName) {
    state.component[name] = new Map()
    state.component[name].set(entity, data)
  } else {
    state.component[name].set(entity, data)
  }

  const system = getSystemByComponentName(name, state.system)

  if (
    system?.create !== undefined &&
    (isFirstComponentThisName || needCreateEntity)
  ) {
    return system.create({
      state: state,
      component: data,
      entity,
      name,
    }) as State
  }

  return state
}
