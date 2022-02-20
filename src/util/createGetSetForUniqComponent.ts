import { getComponent } from '../component/getComponent'
import { setComponent } from '../component/setComponent'
import { AnyState, Component, Entity } from '../type'

/**
 * Creates get and set component functions for unique entity. Useful when you have always one component eg game settings or camera
 */
export const createGetSetForUniqComponent = <
  ComponentData,
  State extends AnyState = AnyState,
>({
  entity,
  name,
}: {
  entity: Entity
  name: string
}) => {
  type Getter = (params: { state: State }) => ComponentData | undefined
  const getter: Getter = ({ state }) =>
    getComponent<Component<ComponentData>>({
      state,
      entity,
      name,
    })

  type Setter = (params: {
    state: State
    data: Partial<ComponentData>
  }) => State
  const setter: Setter = ({ state, data: dataPartial }) => {
    const data = getter({ state })

    if (!data) {
      return state
    }

    state = setComponent<Component<ComponentData>, State>({
      state,
      data: {
        entity,
        name,
        ...data,
        ...dataPartial,
      },
    })

    return state
  }

  return {
    getComponent: getter,
    setComponent: setter,
  }
}
