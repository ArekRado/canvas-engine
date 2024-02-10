import { getSystemByComponentName } from '../system/getSystemByName'
import { Entity, EmptyState } from '../type'

export const createComponent = <Data, State extends EmptyState, ExtraParameters = unknown>(
  state: State,
  name: string,
  entity: Entity,
  data: Data,
  extraParameters?: ExtraParameters
): void => {
  const isFirstComponentThisName = state.component[name] === undefined
  const needCreateEntity = isFirstComponentThisName
    ? true
    : state.component[name]?.get?.(entity) === undefined

  if (isFirstComponentThisName) {
    state.component[name] = new Map()
  }

  state.component[name].set(entity, data)

  const system = getSystemByComponentName(name, state.system)

  if (
    system?.create !== undefined &&
    (isFirstComponentThisName || needCreateEntity)
  ) {
    system.create({
      component: data,
      entity,
      name,
      extraParameters,
    })
  }
}
