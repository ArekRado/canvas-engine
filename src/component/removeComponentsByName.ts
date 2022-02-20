import { AnyState } from '../type'
import { getComponentsByName } from './getComponentsByName'
import { removeComponent } from './removeComponent'

export const removeComponentsByName = <
  Data,
  State extends AnyState = AnyState,
>({
  state,
  name,
}: {
  name: string
  state: State
}): State => {
  const components = getComponentsByName<Data>({ state, name })

  if (components) {
    return Object.keys(components).reduce((acc, entity) => {
      return removeComponent({ name, entity, state: acc })
    }, state)
  }

  return state
}
