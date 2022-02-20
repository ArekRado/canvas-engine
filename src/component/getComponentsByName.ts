import { AnyState, Component, Dictionary } from '../type'

export const getComponentsByName = <Data, State extends AnyState = AnyState>({
  name,
  state,
}: {
  name: string
  state: State
}) => {
  return state.component[name] as Dictionary<Component<Data>> | undefined
}
